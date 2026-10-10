import os
from flask import Flask, render_template
from config import Config
from extensions import db
from models import User, Category, Product, Coupon, WebsiteSetting
from datetime import datetime, timedelta

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    # Register blueprints
    from routes.main import main_bp
    from routes.auth import auth_bp
    from routes.menu import menu_bp
    from routes.cart import cart_bp
    from routes.orders import orders_bp
    from routes.contact import contact_bp
    from routes.admin import admin_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(menu_bp, url_prefix='/menu')
    app.register_blueprint(cart_bp, url_prefix='/cart')
    app.register_blueprint(orders_bp, url_prefix='/orders')
    app.register_blueprint(contact_bp, url_prefix='/contact')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    # Error Handlers
    @app.errorhandler(403)
    def forbidden(e):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template('errors/500.html'), 500

    @app.route('/health')
    def health():
        return {'status': 'healthy', 'cafe': 'Sip And Joy'}, 200

    with app.app_context():
        # Ensure database tables exist
        os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)
        db.create_all()
        seed_initial_data(app)

    return app

def seed_initial_data(app):
    # Seed categories if empty
    if not Category.query.first():
        cats = [
            Category(name='Hot Coffee', slug='hot-coffee', description='Freshly roasted espresso drinks', icon='Coffee'),
            Category(name='Cold Coffee', slug='cold-coffee', description='Chilled brews and iced lattes', icon='CupSoda'),
            Category(name='Tea & Beverages', slug='tea-beverages', description='Artisanal floral teas and coolers', icon='Sparkles'),
            Category(name='Milkshakes', slug='milkshakes', description='Creamy thick gourmet shakes', icon='IceCream'),
            Category(name='Desserts', slug='desserts', description='Delicate cakes and artisan pastries', icon='Cake'),
            Category(name='Bakery', slug='bakery', description='Fresh buttery croissants and baked goods', icon='Utensils'),
            Category(name='Snacks', slug='snacks', description='Savory sourdough toasts and sandwiches', icon='Sandwich')
        ]
        db.session.add_all(cats)
        db.session.commit()

    # Seed products if empty
    if not Product.query.first():
        hot_coffee = Category.query.filter_by(slug='hot-coffee').first()
        cold_coffee = Category.query.filter_by(slug='cold-coffee').first()
        shakes = Category.query.filter_by(slug='milkshakes').first()
        desserts = Category.query.filter_by(slug='desserts').first()
        bakery = Category.query.filter_by(slug='bakery').first()

        sample_prods = [
            Product(name='Classic Cappuccino', slug='classic-cappuccino', description='Double shot of velvety espresso with silky steamed milk and cocoa dust.', price=195.0, category_id=hot_coffee.id, image_url='https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', is_available=True, is_featured=True, dietary='Vegetarian', preparation_time='5-7 mins', calories=140),
            Product(name='Iced Caramel Latte', slug='iced-caramel-latte', description='Slow-dripped espresso over cold milk and golden artisanal caramel.', price=240.0, category_id=cold_coffee.id, image_url='https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', is_available=True, is_featured=True, dietary='Vegetarian', preparation_time='4-6 mins', calories=220),
            Product(name='Strawberry Milkshake', slug='strawberry-milkshake', description='Fresh strawberry puree with Madagascar vanilla bean ice cream.', price=260.0, category_id=shakes.id, image_url='https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80', is_available=True, is_featured=True, dietary='Vegetarian', preparation_time='5-8 mins', calories=310),
            Product(name='Chocolate Brownie', slug='chocolate-brownie', description='Warm, fudgy Belgian dark chocolate brownie with molten core.', price=180.0, category_id=desserts.id, image_url='https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', is_available=True, is_featured=True, dietary='Eggless', preparation_time='3-5 mins', calories=290),
            Product(name='Butter Croissant', slug='butter-croissant', description='Golden flaky French pastry made with pure Normandy butter.', price=165.0, category_id=bakery.id, image_url='https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', is_available=True, is_featured=True, dietary='Vegetarian', preparation_time='Freshly Baked', calories=260),
            Product(name='Strawberry Cheesecake', slug='strawberry-cheesecake', description='Silky New York style cream cheese cake with strawberry glaze.', price=290.0, category_id=desserts.id, image_url='https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', is_available=True, is_featured=True, dietary='Eggless', preparation_time='Chilled', calories=340)
        ]
        db.session.add_all(sample_prods)
        db.session.commit()

    # Seed Admin if not exists
    admin_email = app.config['ADMIN_EMAIL']
    if not User.query.filter_by(email=admin_email).first():
        admin = User(name='Café Administrator', email=admin_email, role='admin')
        admin.set_password(app.config['ADMIN_INITIAL_PASSWORD'])
        db.session.add(admin)
        db.session.commit()

    # Seed Coupons if not exist
    if not Coupon.query.first():
        coupons = [
            Coupon(code='WELCOME10', discount_type='percentage', discount_value=10.0, min_order_value=250.0, max_discount=100.0, expiry_date=datetime.utcnow() + timedelta(days=90), usage_limit=500, is_active=True, description='10% off for new joy lovers'),
            Coupon(code='JOY15', discount_type='percentage', discount_value=15.0, min_order_value=499.0, max_discount=150.0, expiry_date=datetime.utcnow() + timedelta(days=90), usage_limit=300, is_active=True, description='15% off orders above ₹499'),
            Coupon(code='SWEETTREAT', discount_type='fixed', discount_value=50.0, min_order_value=300.0, expiry_date=datetime.utcnow() + timedelta(days=60), usage_limit=200, is_active=True, description='Flat ₹50 off on treats')
        ]
        db.session.add_all(coupons)
        db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=False)
