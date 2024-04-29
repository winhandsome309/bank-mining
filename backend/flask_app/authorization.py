# from flask_app.models import Role
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

def create_roles(session: sessionmaker):
   # admin = Role(id=1, name="Admin")
   # staff = Role(id=2, name="Staff")
   # customer = Role(id=3, name="Customer")

   # if not session.execute(select(Role)).all():
   #    session.add(admin)
   #    session.add(staff)
   #    session.add(customer)

   print(">> INFO: Roles created successfully!")
