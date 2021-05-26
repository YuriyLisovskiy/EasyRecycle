import os
from pathlib import Path

SECRET_ADMIN_URL = os.getenv('DJANGO_SECRET_ADMIN_URL')

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'none')

ALLOWED_HOSTS = [
	host.strip('\n').strip() for host in os.getenv('DJANGO_ALLOWED_HOSTS', '').split('\n')
]

DEBUG = os.getenv('DJANGO_DEBUG', 'false').lower() == 'true'

# DB_CERT_DIR = BASE_DIR / 'cert'

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql_psycopg2',
		'HOST': os.getenv('DATABASE_HOST', ''),
		'NAME': os.getenv('DATABASE_NAME', ''),
		'USER': os.getenv('DATABASE_USER', ''),
		'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
		# 'OPTIONS': {
		# 	'sslmode': os.getenv('DATABASE_SSL_MODE', ''),
		# 	'sslrootcert': str(DB_CERT_DIR / 'server-ca.pem'),
		# 	'sslcert': str(DB_CERT_DIR / 'client-cert.pem'),
		# 	'sslkey': str(DB_CERT_DIR / 'client-key.pem'),
		# },
	}
}

whitelist = os.getenv('CORS_ORIGIN_WHITELIST', '')
if whitelist != '':
	CORS_ORIGIN_WHITELIST = [
		origin.strip('\n').strip() for origin in whitelist.split('\n')
	]
else:
	CORS_ORIGIN_WHITELIST = []

MIDDLEWARE = [
	'corsheaders.middleware.CorsMiddleware',
	'django.middleware.security.SecurityMiddleware',
	'whitenoise.middleware.WhiteNoiseMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
