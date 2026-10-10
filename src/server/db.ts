import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Category,
  Product,
  Coupon,
  Order,
  OrderItemSnapshot,
  AdminStats,
  User,
  ContactMessage,
  NewsletterSubscriber,
  Review,
  WebsiteSettings,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '../types/cafe.ts';
import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialReviews,
  initialSettings
} from '../data/initialData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cafe_db.json');

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  users: (User & { passwordHash: string; salt: string })[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  reviews: Review[];
  settings: WebsiteSettings;
}

// Password hashing utilities using Node.js crypto
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch {
    return false;
  }
}

class CafeDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading DB file, re-initializing:', err);
      }
    }

    // Default Seed
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@SipJoy2026';
    const adminHash = hashPassword(adminPassword);

    const initialAdmin: User & { passwordHash: string; salt: string } = {
      id: 'usr-admin-1',
      name: 'Café Admin',
      email: 'admin@sipandjoycafe.com',
      phone: '+91 98765 43210',
      role: 'admin',
      createdAt: new Date().toISOString(),
      passwordHash: adminHash.hash,
      salt: adminHash.salt
    };

    const initialDb: DatabaseSchema = {
      categories: initialCategories,
      products: initialProducts,
      coupons: initialCoupons,
      orders: [
        {
          id: 'ord-sample-1',
          orderNumber: 'SJ-2026-1001',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          customerName: 'Aarav Patel',
          customerEmail: 'aarav@example.com',
          customerPhone: '9820011223',
          orderType: 'Pickup',
          items: [
            {
              productId: 'prod-1',
              productName: 'Classic Cappuccino',
              unitPrice: 195,
              quantity: 2,
              lineTotal: 390,
              imageUrl: initialProducts[0].imageUrl
            },
            {
              productId: 'prod-5',
              productName: 'Butter Croissant',
              unitPrice: 165,
              quantity: 1,
              lineTotal: 165,
              imageUrl: initialProducts[4].imageUrl
            }
          ],
          subtotal: 555,
          taxRate: 0.05,
          taxAmount: 27.75,
          deliveryCharge: 0,
          discountAmount: 0,
          totalAmount: 582.75,
          paymentMethod: 'Cash on pickup',
          paymentStatus: 'Paid',
          orderStatus: 'Completed',
          statusHistory: [
            { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
            { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 23.5).toISOString() },
            { status: 'Ready for Pickup', timestamp: new Date(Date.now() - 3600000 * 23).toISOString() },
            { status: 'Completed', timestamp: new Date(Date.now() - 3600000 * 22).toISOString() }
          ]
        }
      ],
      users: [initialAdmin],
      contactMessages: [
        {
          id: 'msg-1',
          name: 'Meera Kapoor',
          email: 'meera@example.com',
          subject: 'Event Booking Inquiry',
          message: 'Hi Sip And Joy team! Do you host private book club meetups on Sunday mornings? Would love to book tables for 8 people.',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          status: 'read'
        }
      ],
      newsletterSubscribers: [
        {
          id: 'sub-1',
          email: 'coffee.lover@example.com',
          subscribedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
          active: true,
          unsubscribeToken: 'unsub-token-sample-123'
        }
      ],
      reviews: initialReviews,
      settings: initialSettings
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // --- Products ---
  getProducts(filter?: { categoryId?: string; search?: string; featuredOnly?: boolean; availableOnly?: boolean; sortBy?: 'price-asc' | 'price-desc' | 'name' }) {
    let list = [...this.data.products];

    if (filter?.categoryId && filter.categoryId !== 'all') {
      list = list.filter(p => p.categoryId === filter.categoryId);
    }

    if (filter?.featuredOnly) {
      list = list.filter(p => p.isFeatured);
    }

    if (filter?.availableOnly) {
      list = list.filter(p => p.isAvailable);
    }

    if (filter?.search) {
      const query = filter.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query) ||
        p.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    if (filter?.sortBy) {
      if (filter.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (filter.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (filter.sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }

  getProductById(id: string) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(productData: Omit<Product, 'id' | 'slug'>) {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct: Product = {
      ...productData,
      id,
      slug
    };
    this.data.products.push(newProduct);
    this.saveDatabase();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.saveDatabase();
    return this.data.products[idx];
  }

  deleteProduct(id: string) {
    // Soft-delete or archive by marking unavailable if orders exist, or remove if safe
    const hasOrders = this.data.orders.some(o => o.items.some(i => i.productId === id));
    if (hasOrders) {
      // Soft deletion for historical consistency
      return this.updateProduct(id, { isAvailable: false });
    }
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products.splice(idx, 1);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- Categories ---
  getCategories() {
    return this.data.categories;
  }

  // --- Coupons ---
  getCoupons() {
    return this.data.coupons;
  }

  validateCoupon(code: string, subtotal: number) {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code.' };
    }
    if (!coupon.isActive) {
      return { valid: false, error: 'This coupon is currently inactive.' };
    }
    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
      return { valid: false, error: 'This coupon has expired.' };
    }
    if (coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit has been reached.' };
    }
    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        error: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    // round to 2 decimals
    discount = Math.round(discount * 100) / 100;

    return {
      valid: true,
      coupon,
      discountAmount: discount
    };
  }

  addCoupon(coupon: Coupon) {
    const existing = this.data.coupons.find(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (existing) {
      throw new Error(`Coupon with code ${coupon.code} already exists`);
    }
    this.data.coupons.push(coupon);
    this.saveDatabase();
    return coupon;
  }

  updateCoupon(code: string, updates: Partial<Coupon>) {
    const idx = this.data.coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
    if (idx === -1) return null;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
    this.saveDatabase();
    return this.data.coupons[idx];
  }

  // --- Cart Calculations (Server-Authoritative) ---
  calculateCartSummary(
    items: { productId: string; quantity: number }[],
    couponCode?: string,
    orderType: 'Pickup' | 'Delivery' = 'Pickup'
  ) {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        valid: false,
        error: 'Cart is empty',
        items: [],
        subtotal: 0,
        taxAmount: 0,
        deliveryCharge: 0,
        discountAmount: 0,
        totalAmount: 0
      };
    }

    const calculatedItems: OrderItemSnapshot[] = [];
    let subtotal = 0;

    for (const item of items) {
      const qty = Math.floor(Number(item.quantity));
      if (isNaN(qty) || qty <= 0 || qty > 50) {
        return { valid: false, error: `Invalid quantity for item ${item.productId}` };
      }

      const product = this.getProductById(item.productId);
      if (!product) {
        return { valid: false, error: `Product not found: ${item.productId}` };
      }
      if (!product.isAvailable) {
        return { valid: false, error: `${product.name} is currently out of stock.` };
      }

      const lineTotal = product.price * qty;
      subtotal += lineTotal;
      calculatedItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: qty,
        lineTotal,
        imageUrl: product.imageUrl
      });
    }

    // Apply Coupon
    let discountAmount = 0;
    let appliedCoupon: Coupon | undefined;
    if (couponCode && couponCode.trim()) {
      const couponRes = this.validateCoupon(couponCode, subtotal);
      if (couponRes.valid && couponRes.coupon) {
        discountAmount = couponRes.discountAmount || 0;
        appliedCoupon = couponRes.coupon;
      }
    }

    const settings = this.getSettings();

    // Delivery charge
    let deliveryCharge = 0;
    if (orderType === 'Delivery') {
      if (!settings.deliveryEnabled) {
        return { valid: false, error: 'Delivery is currently unavailable.' };
      }
      if (subtotal < settings.freeDeliveryThreshold) {
        deliveryCharge = settings.deliveryFee;
      } else {
        deliveryCharge = 0; // Free delivery above threshold
      }
    }

    // Taxes (GST calculated on discounted subtotal)
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxRate = (settings.taxPercentage || 5) / 100;
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;

    const totalAmount = Math.round((taxableAmount + deliveryCharge + taxAmount) * 100) / 100;

    return {
      valid: true,
      items: calculatedItems,
      subtotal,
      taxRate,
      taxAmount,
      deliveryCharge,
      discountAmount,
      appliedCouponCode: appliedCoupon?.code,
      totalAmount
    };
  }

  // --- Orders ---
  createOrder(orderData: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderType: 'Pickup' | 'Delivery';
    deliveryAddress?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    items: { productId: string; quantity: number }[];
    couponCode?: string;
  }) {
    // 1. Re-validate cart and compute strict server totals
    const calculation = this.calculateCartSummary(
      orderData.items,
      orderData.couponCode,
      orderData.orderType
    );

    if (!calculation.valid || !calculation.items) {
      throw new Error(calculation.error || 'Cart validation failed');
    }

    if (orderData.orderType === 'Delivery' && (!orderData.deliveryAddress || orderData.deliveryAddress.trim().length < 5)) {
      throw new Error('Please provide a complete delivery address.');
    }

    if (!orderData.customerName || orderData.customerName.trim().length < 2) {
      throw new Error('Valid customer name is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.customerEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (!phoneRegex.test(orderData.customerPhone)) {
      throw new Error('Please enter a valid mobile number.');
    }

    // 2. Increment coupon usage if used
    if (calculation.appliedCouponCode) {
      const coupon = this.data.coupons.find(
        c => c.code.toUpperCase() === calculation.appliedCouponCode?.toUpperCase()
      );
      if (coupon) {
        coupon.timesUsed += 1;
      }
    }

    // 3. Generate human readable unique order number
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SJ-${dateCode}-${randomSuffix}`;
    const orderId = `ord-${Date.now()}-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: orderData.userId,
      customerName: orderData.customerName.trim(),
      customerEmail: orderData.customerEmail.trim(),
      customerPhone: orderData.customerPhone.trim(),
      orderType: orderData.orderType,
      deliveryAddress: orderData.deliveryAddress?.trim(),
      notes: orderData.notes?.trim(),
      items: calculation.items,
      subtotal: calculation.subtotal || 0,
      taxRate: calculation.taxRate ?? 0.05,
      taxAmount: calculation.taxAmount || 0,
      deliveryCharge: calculation.deliveryCharge || 0,
      discountAmount: calculation.discountAmount || 0,
      appliedCouponCode: calculation.appliedCouponCode,
      totalAmount: calculation.totalAmount || 0,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer'
        }
      ]
    };

    this.data.orders.unshift(newOrder);
    this.saveDatabase();
    return newOrder;
  }

  getOrders(filter?: { status?: string; search?: string; userId?: string }) {
    let list = [...this.data.orders];

    if (filter?.userId) {
      list = list.filter(o => o.userId === filter.userId);
    }

    if (filter?.status && filter.status !== 'all') {
      list = list.filter(o => o.orderStatus === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getOrderById(idOrNumber: string) {
    return this.data.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, paymentStatus?: PaymentStatus, note?: string) {
    const order = this.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    // Validate Status Transition
    order.orderStatus = newStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    } else if (newStatus === 'Completed' && order.paymentStatus === 'Pending') {
      order.paymentStatus = 'Paid';
    }

    order.updatedAt = new Date().toISOString();
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    });

    this.saveDatabase();
    return order;
  }

  // --- Users & Authentication ---
  findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  registerUser(name: string, email: string, password: string, phone?: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (this.findUserByEmail(cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { hash, salt } = hashPassword(password);
    const newUser: User & { passwordHash: string; salt: string } = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim(),
      role: 'customer',
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt: salt
    };

    this.data.users.push(newUser);
    this.saveDatabase();

    const { passwordHash, salt: s, ...publicUser } = newUser;
    return publicUser;
  }

  getCustomers() {
    return this.data.users
      .filter(u => u.role === 'customer')
      .map(({ passwordHash, salt, ...publicUser }) => {
        const userOrders = this.data.orders.filter(o => o.userId === publicUser.id || o.customerEmail === publicUser.email);
        const totalSpent = userOrders
          .filter(o => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0);
        return {
          ...publicUser,
          orderCount: userOrders.length,
          totalSpent: Math.round(totalSpent * 100) / 100
        };
      });
  }

  // --- Contact Messages ---
  addContactMessage(name: string, email: string, subject: string, message: string) {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    this.data.contactMessages.unshift(newMsg);
    this.saveDatabase();
    return newMsg;
  }

  getContactMessages() {
    return this.data.contactMessages;
  }

  // --- Newsletter ---
  subscribeNewsletter(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = this.data.newsletterSubscribers.find(s => s.email === cleanEmail);
    if (existing) {
      if (existing.active) {
        return { status: 'already_subscribed', message: 'You are already subscribed to our newsletter!' };
      } else {
        existing.active = true;
        this.saveDatabase();
        return { status: 'resubscribed', message: 'Welcome back! Your subscription is active again.' };
      }
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      active: true,
      unsubscribeToken: crypto.randomBytes(16).toString('hex')
    };

    this.data.newsletterSubscribers.unshift(newSub);
    this.saveDatabase();
    return { status: 'subscribed', message: 'Thank you for subscribing! Joyful sips are on their way.' };
  }

  unsubscribeNewsletter(tokenOrEmail: string) {
    const sub = this.data.newsletterSubscribers.find(
      s => s.unsubscribeToken === tokenOrEmail || s.email.toLowerCase() === tokenOrEmail.toLowerCase().trim()
    );
    if (!sub) return false;
    sub.active = false;
    this.saveDatabase();
    return true;
  }

  getSubscribers() {
    return this.data.newsletterSubscribers;
  }

  // --- Reviews ---
  getReviews() {
    return this.data.reviews;
  }

  addReview(name: string, rating: number, comment: string, productName?: string) {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      customerName: name.trim(),
      rating: Math.max(1, Math.min(5, Math.round(rating))),
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
      productName: productName?.trim(),
      isDemonstration: false
    };
    this.data.reviews.unshift(newRev);
    this.saveDatabase();
    return newRev;
  }

  // --- Settings ---
  getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<WebsiteSettings>) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveDatabase();
    return this.data.settings;
  }

  // --- Admin Analytics ---
  getAdminStats(): AdminStats {
    const orders = this.data.orders;
    const today = new Date().toISOString().slice(0, 10);

    const todaysOrders = orders.filter(o => o.createdAt.slice(0, 10) === today).length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Preparing').length;
    
    // Revenue definition: Exclude cancelled orders
    const validPaidOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const totalRevenue = validPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Product frequency
    const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const ord of validPaidOrders) {
      for (const item of ord.items) {
        const curr = productSalesMap.get(item.productId) || { name: item.productName, quantity: 0, revenue: 0 };
        curr.quantity += item.quantity;
        curr.revenue += item.lineTotal;
        productSalesMap.set(item.productId, curr);
      }
    }

    const topSellingProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      todaysOrders,
      totalCustomers: this.data.users.filter(u => u.role === 'customer').length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingOrders,
      topSellingProducts
    };
  }
}

export const db = new CafeDatabase();
