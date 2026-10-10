from flask import Blueprint, render_template, request, session, redirect, url_for, flash, jsonify
from models import Product, Coupon
from datetime import datetime

cart_bp = Blueprint('cart', __name__)

def calculate_cart(cart_dict, coupon_code=None, order_type='Pickup'):
    items = []
    subtotal = 0.0

    for prod_id_str, qty in cart_dict.items():
        try:
            prod_id = int(prod_id_str)
            qty = int(qty)
        except (ValueError, TypeError):
            continue

        if qty <= 0:
            continue

        product = Product.query.get(prod_id)
        if product and product.is_available:
            line_total = product.price * qty
            subtotal += line_total
            items.append({
                'product': product,
                'quantity': qty,
                'unit_price': product.price,
                'line_total': line_total
            })

    discount_amount = 0.0
    applied_coupon = None

    if coupon_code:
        coupon = Coupon.query.filter_by(code=coupon_code.upper().strip()).first()
        if coupon and coupon.is_active and coupon.expiry_date >= datetime.utcnow() and coupon.times_used < coupon.usage_limit:
            if subtotal >= coupon.min_order_value:
                if coupon.discount_type == 'percentage':
                    discount_amount = (subtotal * coupon.discount_value) / 100.0
                    if coupon.max_discount and discount_amount > coupon.max_discount:
                        discount_amount = coupon.max_discount
                else:
                    discount_amount = min(coupon.discount_value, subtotal)
                applied_coupon = coupon

    delivery_charge = 40.0 if (order_type == 'Delivery' and subtotal < 500) else 0.0
    taxable = max(0.0, subtotal - discount_amount)
    tax_rate = 0.05
    tax_amount = round(taxable * tax_rate, 2)
    total = round(taxable + delivery_charge + tax_amount, 2)

    return {
        'items': items,
        'subtotal': round(subtotal, 2),
        'tax_rate': tax_rate,
        'tax_amount': tax_amount,
        'delivery_charge': delivery_charge,
        'discount_amount': round(discount_amount, 2),
        'applied_coupon': applied_coupon,
        'total': total
    }

@cart_bp.route('/')
def view_cart():
    cart = session.get('cart', {})
    coupon_code = session.get('coupon_code')
    order_type = session.get('order_type', 'Pickup')
    calc = calculate_cart(cart, coupon_code, order_type)
    return render_template('cart.html', calc=calc, coupon_code=coupon_code)

@cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    product_id = request.form.get('product_id')
    quantity = int(request.form.get('quantity', 1))

    if quantity <= 0:
        flash('Invalid quantity', 'danger')
        return redirect(request.referrer or url_for('menu.menu_list'))

    product = Product.query.get(product_id)
    if not product or not product.is_available:
        flash('Item is currently not available', 'warning')
        return redirect(request.referrer or url_for('menu.menu_list'))

    cart = session.get('cart', {})
    cart[str(product_id)] = cart.get(str(product_id), 0) + quantity
    session['cart'] = cart
    session.modified = True
    flash(f'Added {product.name} to your joy cart!', 'success')
    return redirect(request.referrer or url_for('cart.view_cart'))

@cart_bp.route('/update', methods=['POST'])
def update_cart():
    product_id = request.form.get('product_id')
    quantity = int(request.form.get('quantity', 1))
    cart = session.get('cart', {})

    if quantity <= 0:
        cart.pop(str(product_id), None)
    else:
        cart[str(product_id)] = quantity

    session['cart'] = cart
    session.modified = True
    return redirect(url_for('cart.view_cart'))

@cart_bp.route('/remove/<product_id>')
def remove_from_cart(product_id):
    cart = session.get('cart', {})
    cart.pop(str(product_id), None)
    session['cart'] = cart
    session.modified = True
    return redirect(url_for('cart.view_cart'))

@cart_bp.route('/coupon', methods=['POST'])
def apply_coupon():
    code = request.form.get('code', '').strip().upper()
    cart = session.get('cart', {})
    calc = calculate_cart(cart, code)

    if calc['applied_coupon']:
        session['coupon_code'] = code
        flash(f'Coupon {code} applied successfully! You saved ₹{calc["discount_amount"]}', 'success')
    else:
        session.pop('coupon_code', None)
        flash('Invalid or ineligible coupon code.', 'danger')

    return redirect(url_for('cart.view_cart'))
