import random
from datetime import datetime
from flask import Blueprint, render_template, request, session, redirect, url_for, flash, abort
from models import Order, OrderItem, User
from extensions import db
from routes.cart import calculate_cart

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/checkout', methods=['GET', 'POST'])
def checkout():
    cart = session.get('cart', {})
    if not cart:
        flash('Your cart is empty. Add delicious treats first!', 'info')
        return redirect(url_for('menu.menu_list'))

    coupon_code = session.get('coupon_code')
    order_type = request.form.get('order_type') if request.method == 'POST' else session.get('order_type', 'Pickup')
    calc = calculate_cart(cart, coupon_code, order_type)

    if not calc['items']:
        flash('None of the items in your cart are currently available.', 'warning')
        return redirect(url_for('cart.view_cart'))

    if request.method == 'POST':
        customer_name = request.form.get('customer_name', '').strip()
        customer_email = request.form.get('customer_email', '').strip().lower()
        customer_phone = request.form.get('customer_phone', '').strip()
        order_type = request.form.get('order_type', 'Pickup')
        delivery_address = request.form.get('delivery_address', '').strip()
        notes = request.form.get('notes', '').strip()
        payment_method = request.form.get('payment_method', 'Cash on pickup')

        if not customer_name or not customer_email or not customer_phone:
            flash('Please fill in your name, email, and contact number.', 'danger')
            return render_template('checkout.html', calc=calc)

        if order_type == 'Delivery' and len(delivery_address) < 5:
            flash('Please provide a complete delivery address.', 'danger')
            return render_template('checkout.html', calc=calc)

        # Recalculate strictly on the server
        server_calc = calculate_cart(cart, coupon_code, order_type)

        date_str = datetime.utcnow().strftime('%Y%m%d')
        order_number = f"SJ-{date_str}-{random.randint(1000, 9999)}"

        user_id = session.get('user_id')

        order = Order(
            order_number=order_number,
            user_id=user_id,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            order_type=order_type,
            delivery_address=delivery_address if order_type == 'Delivery' else None,
            notes=notes,
            subtotal=server_calc['subtotal'],
            tax_rate=server_calc['tax_rate'],
            tax_amount=server_calc['tax_amount'],
            delivery_charge=server_calc['delivery_charge'],
            discount_amount=server_calc['discount_amount'],
            applied_coupon_code=coupon_code if server_calc['applied_coupon'] else None,
            total_amount=server_calc['total'],
            payment_method=payment_method,
            payment_status='Pending',
            order_status='Pending'
        )
        db.session.add(order)
        db.session.flush()

        # Save order items snapshot
        for item in server_calc['items']:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item['product'].id,
                product_name=item['product'].name,
                unit_price=item['unit_price'],
                quantity=item['quantity'],
                line_total=item['line_total'],
                image_url=item['product'].image_url
            )
            db.session.add(order_item)

        # Update coupon times used if applied
        if server_calc['applied_coupon']:
            server_calc['applied_coupon'].times_used += 1

        db.session.commit()

        # Clear cart
        session.pop('cart', None)
        session.pop('coupon_code', None)

        flash('Your order has been placed successfully!', 'success')
        return redirect(url_for('orders.order_confirmation', order_number=order.order_number))

    user = User.query.get(session.get('user_id')) if session.get('user_id') else None
    return render_template('checkout.html', calc=calc, user=user)

@orders_bp.route('/confirmation/<order_number>')
def order_confirmation(order_number):
    order = Order.query.filter_by(order_number=order_number).first_or_404()
    return render_template('order_confirmation.html', order=order)

@orders_bp.route('/history')
def order_history():
    user_id = session.get('user_id')
    if not user_id:
        flash('Please login to view your order history.', 'info')
        return redirect(url_for('auth.login'))

    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return render_template('order_history.html', orders=orders)
