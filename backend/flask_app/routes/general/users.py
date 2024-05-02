from flask import request, make_response
from flask_app import app
from flask_app.database import db_session
import flask_app.helper.utils as utils
from sqlalchemy import select, update
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import Staff, Customer, CustomersApplications, Application, User
from flask_security import hash_password, roles_required, current_user, roles_accepted, verify_password
import datetime
import time

@app.route("/api/staff/create", methods=['POST'])
@roles_required('Maintainer', 'Admin')
def create_staff():
   form = request.form
   email       = form.get('email')
   username    = form.get('username')
   fname       = form.get('fname')
   position    = form.get('position')
   chat_token  = form.get('chat_token')
   roles       = list(form.get('roles'))
   password    = str(int(time.time()))

   try:
      user = app.security.datastore.create_user(email=email, username=username, chat_token=chat_token, password=hash_password(password), roles=roles)
      db_session.commit()

      new_staff = Staff(
         fname=fname,
         position=position,
         user_id=user.id
      )

      db_session.add(new_staff)
      db_session.commit()

      return make_response(
         {
            'status': 'Create',
            'response': {
               'email':    email,
               'username': username,
               'password': password
            }
         },
         200
      )
   except:
      return make_response("ERROR", 400)

@app.route("/api/customer/create", methods=['POST'])
@roles_accepted('Maintainer', 'Admin')
def create_customer():
   form = request.form
   email       = form.get('email')
   username    = form.get('username')
   fname       = form.get('fname')
   since       = datetime.datetime.now()

   password    = str(int(time.time()))

   try:
      user = app.security.datastore.create_user(email=email, username=username, password=hash_password(password), roles=['Customer'])
      db_session.commit()

      new_customer = Customer(
         fname=fname,
         since=since,
         user_id=user.id
      )

      db_session.add(new_customer)
      db_session.commit()
      
      # Assign customer with an application
      

      return make_response(
         {
            'status': 'Create',
            'response': {
               'email':    email,
               'username': username,
               'password': password
            }
         },
         200
      )
   except:
      return make_response("ERROR", 400)
   
@app.route('/api/customer/reset-password', methods=["POST"])
# @roles_required("Customer")
def customer_reset_password():
   form = request.form
   email    = form.get('email')
   oldPassword = form.get('oldPassword')
   newPassword = form.get('newPassword')
   try:
      stmt = (
         update(User)
         .where(User.email == email and verify_password(oldPassword, User.password))
         .values(password=hash_password(newPassword)))
      db_session.execute(stmt)
      db_session.commit()

      return make_response("SUCCESS", 200)
   except:
      return make_response("ERROR", 400)

@app.route('/api/user/application', methods=['GET', 'POST'])
@roles_required('Customer')
def get_user_application():
   user_id = current_user.id
   stmt = select(Customer).where(Customer.user_id == user_id)
   customer = db_session.execute(stmt).first()[0] #(<flask_app.models.Customer object at 0x734637d520d0>,)
   db_session.commit()

   if isinstance(customer, Customer):
      try:
         stmt = select(Application).where(Application.id == select(CustomersApplications.appliation_id).where(CustomersApplications.customer_id == customer.id))
         application = db_session.execute(stmt).fetchall()
         db_session.commit()

      except:
         print(customer)
         return make_response("ERROR", 400)

      return utils.parse_output(application)

   return make_response('NOT FOUND', 404)