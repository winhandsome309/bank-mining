from flask import request, make_response
from flask_app import app
from flask_app.database import db_session
import flask_app.helper.utils as utils
from sqlalchemy import select, update, delete
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import Staff, Customer, CustomersApplications, Application, User
from flask_security import hash_password, roles_required, current_user, roles_accepted, verify_password
import datetime
import time

@app.route("/api/staff/create", methods=['POST'])
@roles_accepted('Maintainer', 'Admin')
def create_staff():
   req = request.json
   email       = req['email']
   username    = req['username']
   fname       = req['fname']
   position    = req['position']
   chat_token  = req.get('chat_token')
   role_names  = req['role_names']
   password    = str(int(time.time()))

   try:
      roles = [app.security.datastore.find_role(r) for r in role_names]
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
   
@app.route('/api/staff/reset-password', methods=["POST"])
# @roles_required("Customer")
def staff_reset_password():
   form = request.form
   email    = form.get('email')
   oldPassword = form.get('old_password')
   newPassword = form.get('new_password')
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

@app.route("/api/customer/create", methods=['POST'])
@roles_accepted('Maintainer', 'Admin')
def create_customer():
   form = request.form
   email       = form.get('email')
   username    = form.get('username')
   fname       = form.get('fname')
   application_id = form.get('application_id')
   since       = datetime.datetime.now()

   password    = str(int(time.time()))

   try:
      if application_id:
         application = db_session.get(Application, str(application_id))
         assert application is not None, "Application is not existed!"
   
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
      if application_id:
         utils.assign_customer_to_application(new_customer.id, application_id, db_session) 
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

   except Exception as e:
      db_session.rollback()
      body = utils.create_response_body(400, True, "create customer", data={'exception': str(e)})
      return make_response(body, 400)
   
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
@utils.server_return_500_if_errors
def get_user_application():
   user_id = current_user.id
   stmt = select(Customer).where(Customer.user_id == user_id)
   customer = db_session.execute(stmt).first()[0] #(<flask_app.models.Customer object at 0x734637d520d0>,)
   db_session.commit()

   if isinstance(customer, Customer):
      try:
         stmt = select(Application) \
               .where(Application.id == select(CustomersApplications.application_id) \
               .where(CustomersApplications.customer_id == customer.id))

         applications = db_session.execute(stmt).all()
         if len(applications) == 0:
            body = utils.create_response_body(200, False, get_user_application.__name__, data={'message': "Not found applications for this user!"})
            return make_response(body, 200)
         db_session.commit()

         applications = utils.Utils.parse_output(applications)
         for app in applications:
            processed = app.get('processed')
            if processed:
               processed_at   = app.get('processed_at')
               reported       = app.get('reported')

               if reported:
                  app.update({"step": 3})
                  app.update({"last_update": processed_at})
               else:
                  app.update({"step": 2})
                  app.update({"last_update": processed_at})
            else:
               app.update({"step": 1})
               app.update({"last_update": None})

          
         return make_response(applications, 200)

      except:
         print(customer)
         return make_response("ERROR", 400)


   return make_response('NOT FOUND', 404)

@app.route('/api/role/change', methods=['POST'])
@roles_required('Maintainer')
@utils.server_return_500_if_errors
def change_staff_role():
   form = request.form
   email = form.get('email')
   role_name = form.get('role_name')

   datastore = app.security.datastore
   user = datastore.find_user(email=email)
   role = datastore.find_role(role=role_name)
   if user and role:
      status_code = 404
      if user == current_user:
         status_code = 400
         body = utils.create_response_body(400, True, change_staff_role.__name__, data={'message': 'You can not change role of yourself'})
      elif user.has_role('Customer'):
         body = utils.create_response_body(404, True, change_staff_role.__name__, data={'message': 'Can not change the role of a customer!'})
      elif user.has_role('Maintainer'):
         body = utils.create_response_body(404, True, change_staff_role.__name__, data={'message': 'Can not change the role of a maintainer!'})
      else:
         try:
            _ = datastore.remove_role_from_user(user, 'Admin')
            _ = datastore.remove_role_from_user(user, 'Moderator')
            success = datastore.add_role_to_user(user, role_name)

            db_session.commit()
            if success:
               body = utils.create_response_body(200, True, change_staff_role.__name__, data={'message': 'Change role successfully!'})
               status_code = 200
         except:
            body = utils.create_response_body(400, True, change_staff_role.__name__)

      return make_response(body, status_code)
   else:
      body = utils.create_response_body(404, True, change_staff_role.__name__, data={'message': 'User or role is not existed!'})
   return make_response(body, 404)



@app.route('/api/user/delete', methods=['POST'])
@roles_required('Maintainer')
def delete_user():
   form = request.form
   email = form.get('email')

   datastore = app.security.datastore
   user = datastore.find_user(email=email)
   
   if not user:
      body = utils.create_response_body(404, True, delete_user.__name__, data={'message': 'User or role is not existed!'})
      return make_response(body, 404)

   if user == current_user:   
      body = utils.create_response_body(400, True, delete_user.__name__, data={'message': 'Can not delete yourself!'})
      return make_response(body, 400)

   if user.has_role('Maintainer'):
      body = utils.create_response_body(400, True, delete_user.__name__, data={'message': 'Can not delete a mantainer!'})
      return make_response(body, 400)
   
   try:
      datastore.delete_user(user)
      db_session.commit()
      body = utils.create_response_body(200, False, delete_user.__name__, data={'message': 'Delete user successfully!'})
      return make_response(body, 200) 
   except Exception as e:
      body = utils.create_response_body(400, True, delete_user.__name__, data={'exception': str(e)}) 

   return make_response(body, 400)
