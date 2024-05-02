from flask import Flask
from flask_cors import CORS
from flask_app.helper.config import DevConfig
from flask_app.database import init_db, db_session
from flask_app.models import User, Role
from flask_security import Security, SQLAlchemySessionUserDatastore, hash_password
import flask_wtf

app = Flask(__name__)
app.config.from_object(DevConfig)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
flask_wtf.CSRFProtect(app)

# manage sessions per request - make sure connections are closed and returned
app.teardown_appcontext(lambda exc: db_session.close())

# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
app.security = Security(app, user_datastore)

with app.app_context():
    init_db()

	# Create all roles
    app.security.datastore.find_or_create_role(
        name="Maintainer", permissions={"all-read", "all-write"}
    )
    db_session.commit()

    app.security.datastore.find_or_create_role(
        name="Admin", permissions={"all-read", "all-write"}
    )
    db_session.commit()

    app.security.datastore.find_or_create_role(
        name="Moderator", permissions={"all-read"}
    )
    db_session.commit()

    app.security.datastore.find_or_create_role(
        name="Customer", permissions={"app-read"}
    )
    db_session.commit()

    maintainer_email = app.config["BANK_MAINTAINER_EMAIL"]
    maintainer_password = app.config["BANK_MAINTAINER_PASSWORD"]
    maintainer_username = app.config["BANK_MAINTAINER_USERNAME"]
    maintainer_chat_token = app.config["BANK_MAINTAINER_REMARK_TOKEN"]

    if not app.security.datastore.find_user(email=maintainer_email):
        app.security.datastore.create_user(
            email=maintainer_email,
            username=maintainer_username,
            chat_token=maintainer_chat_token,
            password=hash_password(maintainer_password),
            roles=["Maintainer"],
        )
        db_session.commit()

from . import routes
