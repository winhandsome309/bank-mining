from flask import Flask
from flask_cors import CORS
from flask_app.helper.config import DevConfig
from sqlalchemy import create_engine
import os
from flask_app.models import Base

app = Flask(__name__)
app.config.from_object(DevConfig)
CORS(app)


engine = create_engine(os.environ.get('SQLALCHEMY_DATABASE_URI'))
# Init database
Base.metadata.create_all(engine, Base.metadata.tables.values(), checkfirst=True)

from . import routes