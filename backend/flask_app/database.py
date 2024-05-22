from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase
from contextlib import contextmanager
import os

engine = create_engine(os.environ.get('SQLALCHEMY_DATABASE_URI_LOCAL'))
db_session = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))

Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import flask_app.models
    print(f">> INFO: Initializing database ...")
    Base.metadata.create_all(engine, Base.metadata.tables.values(), checkfirst=True)