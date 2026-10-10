import secrets
from flask import Blueprint, render_template, request, flash, redirect, url_for
from models import ContactMessage, NewsletterSubscriber
from extensions import db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not subject or not message:
            flash('Please fill in all contact fields.', 'danger')
            return render_template('contact.html')

        msg = ContactMessage(name=name, email=email, subject=subject, message=message)
        db.session.add(msg)
        db.session.commit()

        flash('Thank you for reaching out! Your message has been received by Sip And Joy.', 'success')
        return redirect(url_for('contact.contact'))

    return render_template('contact.html')

@contact_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    email = request.form.get('email', '').strip().lower()
    if not email:
        flash('Please enter a valid email address.', 'warning')
        return redirect(request.referrer or url_for('main.index'))

    existing = NewsletterSubscriber.query.filter_by(email=email).first()
    if existing:
        if not existing.active:
            existing.active = True
            db.session.commit()
            flash('Welcome back! Your newsletter subscription has been reactivated.', 'success')
        else:
            flash('You are already subscribed to our sweet updates!', 'info')
        return redirect(request.referrer or url_for('main.index'))

    token = secrets.token_hex(16)
    sub = NewsletterSubscriber(email=email, unsubscribe_token=token)
    db.session.add(sub)
    db.session.commit()
    flash('Thank you for subscribing! Lovely sips and updates are headed your way.', 'success')
    return redirect(request.referrer or url_for('main.index'))

@contact_bp.route('/newsletter/unsubscribe/<token>')
def unsubscribe_newsletter(token):
    sub = NewsletterSubscriber.query.filter_by(unsubscribe_token=token).first_or_404()
    sub.active = False
    db.session.commit()
    return render_template('unsubscribed.html', email=sub.email)
