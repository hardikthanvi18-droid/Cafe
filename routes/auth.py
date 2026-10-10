from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import User
from extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        phone = request.form.get('phone', '').strip()

        if not name or not email or not password:
            flash('All required fields must be filled.', 'danger')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters.', 'danger')
            return render_template('register.html')

        existing = User.query.filter_by(email=email).first()
        if existing:
            flash('An account with this email already exists.', 'danger')
            return render_template('register.html')

        user = User(name=name, email=email, phone=phone, role='customer')
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id
        session['user_name'] = user.name
        session['user_role'] = user.role
        flash('Welcome to Sip And Joy! Account created successfully.', 'success')
        return redirect(url_for('main.index'))

    return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            flash('Invalid email or password.', 'danger')
            return render_template('login.html')

        session['user_id'] = user.id
        session['user_name'] = user.name
        session['user_role'] = user.role
        flash(f'Welcome back, {user.name}!', 'success')
        return redirect(url_for('main.index'))

    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('main.index'))

@auth_bp.route('/account', methods=['GET', 'POST'])
def account():
    user_id = session.get('user_id')
    if not user_id:
        flash('Please log in to view your profile.', 'warning')
        return redirect(url_for('auth.login'))

    user = User.query.get(user_id)
    if request.method == 'POST':
        user.name = request.form.get('name', user.name).strip()
        user.phone = request.form.get('phone', user.phone).strip()
        user.address = request.form.get('address', user.address).strip()
        db.session.commit()
        session['user_name'] = user.name
        flash('Profile updated successfully!', 'success')

    return render_template('account.html', user=user)
