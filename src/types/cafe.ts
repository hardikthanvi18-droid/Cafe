export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type PaymentMethod = 'Cash on pickup' | 'Cash on delivery' | 'Online payment (Demo / Gateway)';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in INR
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  dietary?: 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Contains Dairy' | 'Eggless';
  preparationTime?: string;
  calories?: number;
  ingredients?: string[];
  tags?: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryName: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 50 for ₹50
  minOrderValue: number; // minimum subtotal in INR
  maxDiscount?: number; // cap for percentage discount
  expiryDate: string; // ISO date string
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  description?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SJ-2026-1042
  createdAt: string;
  updatedAt: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'Pickup' | 'Delivery';
  deliveryAddress?: string;
  notes?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  taxRate: number; // e.g. 0.05 for 5%
  taxAmount: number;
  deliveryCharge: number;
  discountAmount: number;
  appliedCouponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  unsubscribeToken: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  productName?: string;
  isDemonstration: boolean; // Transparency requirement
}

export interface WebsiteSettings {
  cafeName: string;
  announcementText: string;
  announcementEnabled: boolean;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxPercentage: number;
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
  promoBannerText: string;
  promoBannerActive: boolean;
  promoBannerSubtext: string;
  promoBannerCoupon?: string;
  razorpayKeyId?: string; // Optional gateway setting
}

export interface AdminStats {
  totalOrders: number;
  todaysOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  topSellingProducts: { name: string; quantity: number; revenue: number }[];
}
