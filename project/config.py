import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'your-very-strong-secret-key-here-CHANGE-IT')

    # Database Configuration
    DB_USER = os.environ.get('DB_USER', 'dhir4j')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'm4dc0d3r')
    DB_HOST = os.environ.get('DB_HOST', 'simple4j-4739.postgres.pythonanywhere-services.com')
    DB_PORT = os.environ.get('DB_PORT', '14739')
    DB_NAME = os.environ.get('DB_NAME', 'mandi')

    # PayU Credentials
    PAYU_KEY = os.environ.get('PAYU_KEY', 'MY7QQz')
    PAYU_SALT = os.environ.get('PAYU_SALT', 'MT4oTUimzDHYFhx5lIwOTF9XBdgvHAZe')

    # SabPaisa Credentials - Load from environment variables
    SABPAISA_CLIENT_CODE = os.environ.get('SABPAISA_CLIENT_CODE', 'RKRM88')
    SABPAISA_USERNAME = os.environ.get('SABPAISA_USERNAME', 'info@mandi2mandi.com')
    SABPAISA_PASSWORD = os.environ.get('SABPAISA_PASSWORD', 'RKRM88_SP24284')
    SABPAISA_AUTH_KEY = os.environ.get('SABPAISA_AUTH_KEY', '02sPLJl7wBKB/N/QS0u/CinEAWbXhSERS7xanaDhguU=')
    SABPAISA_AUTH_IV = os.environ.get('SABPAISA_AUTH_IV', 'E7kwjTIDcsQjKprRjGzZA/RdIhDfATdMaLuVcdnke4uBCP66ioxT70PKcqlGPOlc')
    SABPAISA_BASE_URL = os.environ.get('SABPAISA_BASE_URL', 'https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit')

    # Airpay Credentials - Load from environment variables
    # Get actual values from .credentials/AIRPAY_CREDENTIALS.txt
    AIRPAY_MERCHANT_ID = os.environ.get('AIRPAY_MERCHANT_ID', '')
    AIRPAY_USERNAME = os.environ.get('AIRPAY_USERNAME', '')
    AIRPAY_PASSWORD = os.environ.get('AIRPAY_PASSWORD', '')
    AIRPAY_SECRET_KEY = os.environ.get('AIRPAY_SECRET_KEY', '')
    # Airpay V4 OAuth2 credentials
    AIRPAY_CLIENT_ID = os.environ.get('AIRPAY_CLIENT_ID', '')
    AIRPAY_CLIENT_SECRET = os.environ.get('AIRPAY_CLIENT_SECRET', '')
    # Airpay V4 API URLs
    AIRPAY_BASE_URL = os.environ.get('AIRPAY_BASE_URL', 'https://payments.airpay.co.in/pay/v4/index.php')
    AIRPAY_OAUTH_URL = os.environ.get('AIRPAY_OAUTH_URL', 'https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/')

    # SQLAlchemy Configuration
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Resilient pool settings (highly recommended on PythonAnywhere)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 5,
        "max_overflow": 5,
        "connect_args": {
            "keepalives": 1,
            "keepalives_idle": 60,
            "keepalives_interval": 15,
            "keepalives_count": 5,
        },
    }

    # CORS
    CORS_ORIGINS = ["https://mandi2mandi.com"]

    # Secure cookies (required for cross-site with SameSite=None)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"
