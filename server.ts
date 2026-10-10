import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { db, verifyPassword } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple Bearer/Admin session helper for authorization
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  // Allows Bearer token or custom header 'x-admin-token'
  if (authHeader?.includes('admin-token-') || req.headers['x-admin-token']) {
    return next();
  }
  return res.status(403).json({ error: 'Access forbidden. Administrator privileges required.' });
}

// ---------------- PUBLIC API ROUTES ----------------

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({ success: true, settings });
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json({ success: true, categories });
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const categoryId = req.query.category as string;
  const search = req.query.search as string;
  const featuredOnly = req.query.featured === 'true';
  const availableOnly = req.query.available === 'true';
  const sortBy = req.query.sort as 'price-asc' | 'price-desc' | 'name' | undefined;

  const products = db.getProducts({
    categoryId,
    search,
    featuredOnly,
    availableOnly,
    sortBy
  });
  res.json({ success: true, products });
});

// Product detail
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Also send related products from same category
  const related = db.getProducts({ categoryId: product.categoryId })
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  res.json({ success: true, product, related });
});

// Calculate Cart / Quote
app.post('/api/cart/calculate', (req: Request, res: Response) => {
  const { items, couponCode, orderType } = req.body;
  const calculation = db.calculateCartSummary(items, couponCode, orderType || 'Pickup');
  if (!calculation.valid) {
    return res.status(400).json({ success: false, error: calculation.error });
  }
  res.json({ success: true, calculation });
});

// Validate Coupon
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code is required.' });
  }
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  if (!result.valid) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({
    success: true,
    discountAmount: result.discountAmount,
    coupon: result.coupon
  });
});

// Create Order (strict server recalculation)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      deliveryAddress,
      notes,
      paymentMethod,
      items,
      couponCode
    } = req.body;

    const order = db.createOrder({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      orderType: orderType || 'Pickup',
      deliveryAddress,
      notes,
      paymentMethod: paymentMethod || 'Cash on pickup',
      items,
      couponCode
    });

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to place order' });
  }
});

// Track/View single order
app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// User order history
app.get('/api/orders/user/:userId', (req: Request, res: Response) => {
  const orders = db.getOrders({ userId: req.params.userId });
  res.json({ success: true, orders });
});

// Customer Authentication
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const user = db.registerUser(name, email, password, phone);
    const token = `usr-token-${user.id}-${Date.now()}`;
    res.status(201).json({ success: true, user, token });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  const userWithSecrets = db.findUserByEmail(email);
  if (!userWithSecrets) {
    // Generic error to avoid user enumeration
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = verifyPassword(password, userWithSecrets.passwordHash, userWithSecrets.salt);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { passwordHash, salt, ...publicUser } = userWithSecrets;
  const token = `usr-token-${publicUser.id}-${Date.now()}`;
  res.json({ success: true, user: publicUser, token });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const match = authHeader.match(/usr-token-([a-zA-Z0-9-]+)/);
  if (!match) {
    return res.status(401).json({ error: 'Invalid session token' });
  }
  const userId = match[1];
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const { passwordHash, salt, ...publicUser } = user;
  res.json({ success: true, user: publicUser });
});

// Contact Form
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const msg = db.addContactMessage(name, email, subject, message);
  res.json({
    success: true,
    message: 'Thank you for reaching out! Your message has been received by the Sip And Joy team.',
    id: msg.id
  });
});

// Newsletter
app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const result = db.subscribeNewsletter(email);
  res.json({ success: true, ...result });
});

app.post('/api/newsletter/unsubscribe', (req: Request, res: Response) => {
  const { tokenOrEmail } = req.body;
  if (!tokenOrEmail) {
    return res.status(400).json({ error: 'Token or email is required.' });
  }
  const ok = db.unsubscribeNewsletter(tokenOrEmail);
  if (ok) {
    res.json({ success: true, message: 'You have been successfully unsubscribed from newsletter updates.' });
  } else {
    res.status(404).json({ error: 'Subscriber not found.' });
  }
});

// Reviews
app.get('/api/reviews', (_req: Request, res: Response) => {
  const reviews = db.getReviews();
  res.json({ success: true, reviews });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { customerName, rating, comment, productName } = req.body;
  if (!customerName || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating and review text are required.' });
  }
  const newRev = db.addReview(customerName, Number(rating), comment, productName);
  res.status(201).json({ success: true, review: newRev });
});

// ---------------- ADMINISTRATOR API ROUTES ----------------

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Admin credentials required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const valid = verifyPassword(password, user.passwordHash, user.salt);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const adminToken = `admin-token-${user.id}-${Date.now()}`;
  res.json({
    success: true,
    token: adminToken,
    user: { id: user.id, name: user.name, email: user.email, role: 'admin' }
  });
});

app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json({ success: true, stats });
});

app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  const status = req.query.status as string;
  const search = req.query.search as string;
  const orders = db.getOrders({ status, search });
  res.json({ success: true, orders });
});

app.post('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status, paymentStatus, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }
  const updated = db.updateOrderStatus(req.params.id, status, paymentStatus, note);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ success: true, order: updated });
});

app.get('/api/admin/products', requireAdmin, (_req: Request, res: Response) => {
  const products = db.getProducts();
  res.json({ success: true, products });
});

app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, description, price, categoryId, categoryName, imageUrl, isAvailable, isFeatured, dietary, preparationTime, calories, tags } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Product name, price, and category are required.' });
    }
    const newProduct = db.addProduct({
      name,
      description: description || '',
      price: Number(price),
      categoryId,
      categoryName: categoryName || 'Hot Coffee',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80',
      isAvailable: Boolean(isAvailable),
      isFeatured: Boolean(isFeatured),
      dietary,
      preparationTime,
      calories: calories ? Number(calories) : undefined,
      tags: Array.isArray(tags) ? tags : []
    });
    res.status(201).json({ success: true, product: newProduct });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ success: true, product: updated });
});

app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ success: true, message: 'Product deleted or marked unavailable for order continuity.' });
});

app.get('/api/admin/coupons', requireAdmin, (_req: Request, res: Response) => {
  const coupons = db.getCoupons();
  res.json({ success: true, coupons });
});

app.post('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
  try {
    const coupon = db.addCoupon(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/coupons/:code', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCoupon(req.params.code, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Coupon not found.' });
  }
  res.json({ success: true, coupon: updated });
});

app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
  const customers = db.getCustomers();
  res.json({ success: true, customers });
});

app.get('/api/admin/messages', requireAdmin, (_req: Request, res: Response) => {
  const messages = db.getContactMessages();
  res.json({ success: true, messages });
});

app.get('/api/admin/subscribers', requireAdmin, (_req: Request, res: Response) => {
  const subscribers = db.getSubscribers();
  res.json({ success: true, subscribers });
});

app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, settings: db.getSettings() });
});

app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// ---------------- VITE / STATIC SERVING ----------------

async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Sip And Joy server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});
