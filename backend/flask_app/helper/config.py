import os

class DevConfig(object):
    FLASK_DEBUG = True

    DB_HOST = os.environ.get('POSTGRE_HOST')
    DB_USERNAME = os.environ.get('POSTGRE_USER')
    DB_PASSWORD = os.environ.get('POSTGRE_PASSWORD')
    DB_NAME = os.environ.get('POSTGRE_DB')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    METABASE_SITE_URL = os.environ.get('METABASE_SITE_URL')
    METABASE_SECRET_KEY = os.environ.get('METABASE_SECRET_KEY')
    CORS_HEADERS = "Content-Type"