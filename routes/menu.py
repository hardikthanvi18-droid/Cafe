from flask import Blueprint, render_template, request, abort
from models import Product, Category

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/')
def menu_list():
    category_slug = request.args.get('category', 'all')
    search_query = request.args.get('q', '').strip()
    sort_by = request.args.get('sort', 'default')

    query = Product.query

    categories = Category.query.all()
    selected_category = None
    if category_slug and category_slug != 'all':
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            selected_category = cat
            query = query.filter_by(category_id=cat.id)

    if search_query:
        query = query.filter(Product.name.ilike(f'%{search_query}%') | Product.description.ilike(f'%{search_query}%'))

    if sort_by == 'price_low':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_high':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.is_featured.desc(), Product.id.asc())

    products = query.all()
    return render_template('menu.html', products=products, categories=categories, selected_category=selected_category, search_query=search_query, sort_by=sort_by)

@menu_bp.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    related = Product.query.filter(Product.category_id == product.category_id, Product.id != product.id).limit(4).all()
    return render_template('product_detail.html', product=product, related=related)
