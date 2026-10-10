import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'sip-and-joy-secret-rose-bliss-2026')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'sip_and_joy.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@sipandjoycafe.com')
    ADMIN_INITIAL_PASSWORD = os.environ.get('ADMIN_INITIAL_PASSWORD', 'Admin@SipJoy2026')
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
