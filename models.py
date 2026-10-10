from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    role = db.Column(db.String(20), default='customer') # 'customer' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    slug = db.Column(db.String(80), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    icon = db.Column(db.String(50), default='Coffee')

    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    dietary = db.Column(db.String(50), nullable=True)
    preparation_time = db.Column(db.String(50), nullable=True)
    calories = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Coupon(db.Model):
    __tablename__ = 'coupons'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(30), unique=True, nullable=False, index=True)
    discount_type = db.Column(db.String(20), default='percentage') # 'percentage' or 'fixed'
    discount_value = db.Column(db.Float, nullable=False)
    min_order_value = db.Column(db.Float, default=0.0)
    max_discount = db.Column(db.Float, nullable=True)
    expiry_date = db.Column(db.DateTime, nullable=False)
    usage_limit = db.Column(db.Integer, default=100)
    times_used = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    description = db.Column(db.String(255), nullable=True)

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    order_type = db.Column(db.String(20), default='Pickup') # 'Pickup' or 'Delivery'
    delivery_address = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    subtotal = db.Column(db.Float, nullable=False)
    tax_rate = db.Column(db.Float, default=0.05)
    tax_amount = db.Column(db.Float, default=0.0)
    delivery_charge = db.Column(db.Float, default=0.0)
    discount_amount = db.Column(db.Float, default=0.0)
    applied_coupon_code = db.Column(db.String(30), nullable=True)
    total_amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), default='Cash on pickup')
    payment_status = db.Column(db.String(30), default='Pending') # 'Pending', 'Paid', 'Failed', 'Refunded'
    order_status = db.Column(db.String(30), default='Pending') # 'Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan', lazy=True)
    payments = db.relationship('PaymentRecord', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=True) # Soft connection to preserve history
    product_name = db.Column(db.String(120), nullable=False) # Snapshot
    unit_price = db.Column(db.Float, nullable=False) # Snapshot
    quantity = db.Column(db.Integer, nullable=False)
    line_total = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

class PaymentRecord(db.Model):
    __tablename__ = 'payment_records'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    provider = db.Column(db.String(50), default='Cash') # 'Cash', 'Razorpay', etc.
    transaction_id = db.Column(db.String(100), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='unread')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class NewsletterSubscriber(db.Model):
    __tablename__ = 'newsletter_subscribers'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    active = db.Column(db.Boolean, default=True)
    unsubscribe_token = db.Column(db.String(64), unique=True, nullable=False)
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)

class WebsiteSetting(db.Model):
    __tablename__ = 'website_settings'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(60), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=False)
