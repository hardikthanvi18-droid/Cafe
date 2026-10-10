from flask import Blueprint, render_template
from models import Product, Category

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    featured_products = Product.query.filter_by(is_featured=True, is_available=True).limit(6).all()
    categories = Category.query.all()
    return render_template('index.html', featured_products=featured_products, categories=categories)

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/gallery')
def gallery():
    return render_template('gallery.html')

@main_bp.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy.html')

@main_bp.route('/terms-and-conditions')
def terms():
    return render_template('terms.html')
