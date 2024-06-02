import os

class DevConfig(object):
    FLASK_DEBUG                 = True

    DB_HOST                     = os.environ.get('POSTGRE_HOST')
    DB_USERNAME                 = os.environ.get('POSTGRE_USER')
    DB_PASSWORD                 = os.environ.get('POSTGRE_PASSWORD')
    DB_NAME                     = os.environ.get('POSTGRE_DB')
    SQLALCHEMY_DATABASE_URI     = os.environ.get('SQLALCHEMY_DATABASE_URI')
    METABASE_SITE_URL           = os.environ.get('METABASE_SITE_URL')
    METABASE_SECRET_KEY         = os.environ.get('METABASE_SECRET_KEY')
    CORS_HEADERS                = "Content-Type"
    SECRET_KEY                  = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
    SECURITY_PASSWORD_SALT      = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')
    BANK_MAINTAINER_PASSWORD    = os.environ.get("BANK_MAINTAINER_PASSWORD", 'admin')
    BANK_MAINTAINER_REMARK_TOKEN= os.environ.get("BANK_MAINTAINER_REMARK_TOKEN")
    BANK_MAINTAINER_USERNAME    = os.environ.get("BANK_MAINTAINER_USERNAME", 'admin')
    BANK_MAINTAINER_EMAIL       = os.environ.get("BANK_MAINTAINER_EMAIL", 'admin@banking.com')
    SECURITY_CHANGEABLE         = os.environ.get("SECURITY_CHANGEABLE", True)
    
    # Maill. ...
    MAIL_SERVER                 = os.environ.get("MAIL_SERVER")
    MAIL_PORT                   = os.environ.get("MAIL_PORT")
    MAIL_USE_TLS                = os.environ.get("MAIL_USE_TLS", True)
    MAIL_USERNAME               = os.environ.get("MAIL_USERNAME", "apikey")
    MAIL_PASSWORD               = os.environ.get("SENDGRID_API_KEY")
    MAIL_DEFAULT_SENDER         = os.environ.get("MAIL_DEFAULT_SENDER")
    # MAIL_BACKEND                = 'file'
    # MAIL_FILE_PATH              = 'backend/flask_app/temp/app-messages'
    REACT_APP_REMARK_URL        = os.environ.get("http://localhost:8080")