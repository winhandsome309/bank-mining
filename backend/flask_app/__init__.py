from flask import Flask
from flask_cors import CORS
from flask_app.helper.config import DevConfig
from flask_app.database import init_db, db_session
from flask_app.models import User, Role
from flask_security import Security, SQLAlchemySessionUserDatastore, hash_password

app = Flask(__name__)
app.config.from_object(DevConfig)
CORS(app)

# manage sessions per request - make sure connections are closed and returned
app.teardown_appcontext(lambda exc: db_session.close())

# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
app.security = Security(app, user_datastore)

with app.app_context():
   init_db()

   app.security.datastore.find_or_create_role(
      name="Customer", permissions={"user-read", "user-write"}
   )
   db_session.commit()

   if not app.security.datastore.find_user(email="test1@me.com"):
      app.security.datastore.create_user(email="test1@me.com", password=hash_password("password"), roles=['Customer'])

   db_session.commit()

from . import routes