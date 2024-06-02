from hashlib import sha1
import json
import sqlalchemy
from functools import reduce
from flask_app.models import Base, CustomersApplications, Application, User, Customer
from sqlalchemy import select, update
from flask import jsonify, make_response
import jwt
import time

class Utils:

   @staticmethod
   def parse_output(result: sqlalchemy.engine.result.ChunkedIteratorResult) -> list:
      row_lst = list()
      for row in result:
         row = row._asdict()
         for key, value in row.items():
            if isinstance(value, Base):
               row_item_dict = value.as_dict()
               row.update({key: row_item_dict})
         row_lst.append(row)
      return row_lst

def parse_output(result: list[tuple]) -> list:
   output = []
   for row in result:
      output.append(row[0].as_dict())
   return output

def create_response_body(status_code: int, error: bool, action: str, data: list = None):

   if error:
      return {
         'meta': {
            'status_code': status_code,
            'status': f"An error occured when trying to {action}"
         },
         'error': error,
         'data': data
      }

   return {
      'meta': {
         'status_code': status_code,
      },
      'error': error,
      'data': data
   }

def get_new_applicaion_id(datetime: str)-> str:
   return sha1(datetime.encode()).hexdigest()

def load_from_json(path):
   with open(path) as f:
      return json.load(f)

def assign_customer_to_application(customer_id, application_id, db_session):
   stmt = select(Customer).where(Customer.id == customer_id)
   existed_customer = db_session.execute(stmt)
   assert existed_customer.first() is not None, "Customer is not existed!"

   stmt = select(CustomersApplications).where(CustomersApplications.application_id == application_id)
   existed_application = db_session.execute(stmt)
   assert existed_application.first() is None, "Application is assigned before!"

   application = db_session.execute(select(Application).where(Application.id == application_id))
   assert application.first(), "Application is not existed!"

   new_cus_app = CustomersApplications.create(customer_id, application_id)
   db_session.add(new_cus_app)

def update_customer_application(customer_id, application_id, db_session):

   stmt = select(CustomersApplications).where(CustomersApplications.application_id == application_id)
   existed_application = db_session.execute(stmt).all() # --> list(Tuple)

   assert len(existed_application) == 0, "Application is assigned before!"

   application = db_session.execute(select(Application).where(Application.id == application_id)).all()

   assert len(application) != 0, "Application is not existed!"
   stmt = select(CustomersApplications).where(CustomersApplications.customer_id == customer_id and CustomersApplications.application_id == application_id)
   record = db_session.execute(stmt).first()
   if not record:
      assign_customer_to_application(customer_id, application_id, db_session)
      return
   update_app = update(CustomersApplications).where(CustomersApplications.customer_id == customer_id).values(application_id = application_id)
   db_session.execute(update_app)

def find_customer(db_session, id=None, email=None) -> Customer:
    if id is not None or email is not None:
        if id is not None:
            return db_session.get(Customer, id)
        stmt = select(User.id).where(User.email == email)
        user_id = db_session.execute(stmt).first() # Tuple
        assert user_id, "User is not existed!"

        stmt = select(Customer).where(Customer.user_id == user_id[0])
        customer = db_session.execute(stmt).first() #Tuple
        assert customer, "Customer is not existed!"
        return customer[0]
    return None

def server_return_500_if_errors(f):
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            body = create_response_body(status_code=500, error=True, action=f.__name__, data={'exception': str(e)})
            return make_response(body, 500)
    return wrapper

def generate_remark_token(username, email):
   nbf = int(time.time())
   exp = int(time.time()) + 18000

   payload = {
      "aud": "remark",
      "exp": exp,
      "iss": "remark42",
      "nbf": nbf,
      "handshake": {
         "id": f"{username}::{email}"
      }
   }

   return jwt.encode(payload, "12345", algorithm="HS256")