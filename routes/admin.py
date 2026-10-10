from datetime import datetime, date
from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, abort
from models import Order, Product, Category, Coupon, User, ContactMessage, NewsletterSubscriber
from extensions import db

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('user_role') != 'admin':
            flash('Administrator authentication required.', 'danger')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if user and user.role == 'admin' and user.check_password(password):
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_role'] = 'admin'
            flash('Welcome to the Sip And Joy Admin Portal!', 'success')
            return redirect(url_for('admin.dashboard'))

        flash('Invalid administrator credentials.', 'danger')
        return render_template('admin/login.html')

    return render_template('admin/login.html')

@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    today = date.today()
    total_orders = Order.query.count()
    todays_orders = Order.query.filter(db.func.date(Order.created_at) == today).count()
    total_customers = User.query.filter_by(role='customer').count()
    
    # Revenue: sum eligible non-cancelled orders
    valid_orders = Order.query.filter(Order.order_status != 'Cancelled').all()
    total_revenue = sum(o.total_amount for o in valid_orders)

    pending_orders = Order.query.filter(Order.order_status.in_(['Pending', 'Confirmed', 'Preparing'])).count()
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(8).all()

    return render_template('admin/dashboard.html',
                           total_orders=total_orders,
                           todays_orders=todays_orders,
                           total_customers=total_customers,
                           total_revenue=round(total_revenue, 2),
                           pending_orders=pending_orders,
                           recent_orders=recent_orders)

@admin_bp.route('/orders')
@admin_required
def orders():
    status = request.args.get('status', 'all')
    search = request.args.get('q', '').strip()
    query = Order.query

    if status and status != 'all':
        query = query.filter_by(order_status=status)
    if search:
        query = query.filter(Order.order_number.ilike(f'%{search}%') | Order.customer_name.ilike(f'%{search}%'))

    order_list = query.order_by(Order.created_at.desc()).all()
    return render_template('admin/orders.html', orders=order_list, current_status=status)

@admin_bp.route('/orders/<int:order_id>/status', methods=['POST'])
@admin_required
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    new_status = request.form.get('status')
    payment_status = request.form.get('payment_status')

    if new_status:
        order.order_status = new_status
    if payment_status:
        order.payment_status = payment_status

    db.session.commit()
    flash(f'Order {order.order_number} status updated to {new_status}.', 'success')
    return redirect(url_for('admin.orders'))

@admin_bp.route('/products')
@admin_required
def products():
    products_list = Product.query.order_by(Product.id.desc()).all()
    categories = Category.query.all()
    return render_template('admin/products.html', products=products_list, categories=categories)

@admin_bp.route('/products/add', methods=['GET', 'POST'])
@admin_required
def add_product():
    categories = Category.query.all()
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        price = float(request.form.get('price', 0))
        category_id = int(request.form.get('category_id'))
        image_url = request.form.get('image_url', '').strip()
        is_available = bool(request.form.get('is_available'))
        is_featured = bool(request.form.get('is_featured'))
        dietary = request.form.get('dietary')

        slug = name.lower().replace(' ', '-')
        product = Product(
            name=name,
            slug=slug,
            description=description,
            price=price,
            category_id=category_id,
            image_url=image_url or 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80',
            is_available=is_available,
            is_featured=is_featured,
            dietary=dietary
        )
        db.session.add(product)
        db.session.commit()
        flash('Product added to café catalog successfully!', 'success')
        return redirect(url_for('admin.products'))

    return render_template('admin/product_form.html', categories=categories, product=None)

@admin_bp.route('/coupons', methods=['GET', 'POST'])
@admin_required
def coupons():
    if request.method == 'POST':
        code = request.form.get('code', '').strip().upper()
        discount_type = request.form.get('discount_type', 'percentage')
        discount_value = float(request.form.get('discount_value', 10))
        min_order_value = float(request.form.get('min_order_value', 0))
        expiry_date = datetime.strptime(request.form.get('expiry_date'), '%Y-%m-%d')
        usage_limit = int(request.form.get('usage_limit', 100))

        coupon = Coupon(
            code=code,
            discount_type=discount_type,
            discount_value=discount_value,
            min_order_value=min_order_value,
            expiry_date=expiry_date,
            usage_limit=usage_limit,
            is_active=True
        )
        db.session.add(coupon)
        db.session.commit()
        flash(f'Coupon code {code} generated!', 'success')
        return redirect(url_for('admin.coupons'))

    coupons_list = Coupon.query.all()
    return render_template('admin/coupons.html', coupons=coupons_list)
