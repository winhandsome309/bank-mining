from flask_app.models import PredictResult
from flask_app.models import HistoryMarketingClients
from flask_app.models import MarketingClient
from flask_app.models import MarketingOldClient
from flask_app.models import ClientID
from flask_app.database import db_session
from sqlalchemy import select, null, update, delete
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk
from flask_security import roles_accepted
import time

model_info = wk.ModelInfo.create('Marketing Campaign')
worker = wk.MarketingWorker(model_info)
worker.load_model_info(db_session)

@app.route("/api/marketing/history_data", methods=["GET", "POST"], endpoint='marketing_histor_data')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin')
def marketing_history_data():
    if request.method == "GET":
         stmt = select(HistoryMarketingClients)
         res = db_session.execute(stmt).all()
         db_session.commit()

         return utils.parse_output(res)

@app.route('/api/marketing/client', methods=['GET', 'POST', 'DELETE'], endpoint='marketing_client')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin')
def marketing_client():
   if request.method == 'GET': 
      stmt = select(MarketingClient)
      res = db_session.execute(stmt).all()
      db_session.commit()

      return utils.parse_output(res)
   if request.method == 'POST':
      form = request.form
      age         = form.get('age')
      job         = form.get('job')
      marital     = form.get('marital')
      education   = form.get('education')
      default     = form.get('default')
      balance     = form.get('balance')
      housing     = form.get('housing')
      loan        = form.get('loan')
      contact     = form.get('contact')
      day         = form.get('day')
      month       = form.get('month')
      duration    = form.get('duration')
      campaign    = form.get('campaign')
      pdays       = form.get('pdays')
      previous    = form.get('previous')
      poutcome    = form.get('poutcome')

      created     = datetime.datetime.now()
      # id          = utils.get_new_applicaion_id(str(created))
      id = str(int(time.time()))

      new_id = ClientID(id=id)
      new_client = MarketingClient(
         id=id,
         age=age,
         job=job,
         marital=marital,
         education=education,
         default=default,
         balance=balance,
         housing=housing,
         loan=loan,
         contact=contact,
         day=day,
         month=month,
         duration=duration,
         campaign=campaign,
         pdays=pdays,
         previous=previous,
         poutcome=poutcome,
         created=created
      )
      predict = worker.predict(new_client.as_dict())

      new_predict_result = PredictResult(
                  id=id,
                  predict=predict.__str__(),
                  feature='marketing'
      )
      try:
            db_session.add(new_id)
            db_session.commit()

            db_session.add(new_client)
            db_session.commit()

            db_session.add(new_predict_result)
            db_session.commit()
      except:
            return make_response("ERROR", 401)
      return make_response(predict, 201)
   
   if request.method == "DELETE":
      form = request.form
      id = form.get("id")
      stmtFind = select(MarketingClient).where(MarketingClient.id == id)
      resFind = db_session.execute(stmtFind).fetchall()
      db_session.commit()

      if resFind.count == 0:
            return make_response("Record not found", 401)
      stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
      stmtDeleteApp = delete(MarketingClient).where(MarketingClient.id == id)
      resDeletePredict = db_session.execute(stmtDeletePredict)
      db_session.commit()

      resDeleteApp = db_session.execute(stmtDeleteApp)
      db_session.commit()

      return make_response("Deleted", 200)
      
@app.route("/api/marketing/old_client", methods=["GET", "POST"], endpoint='oldClient')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin')
def oldClient():
    if request.method == "GET":
      stmt = select(MarketingOldClient)
      res = db_session.execute(stmt).all()
      db_session.commit()
      return utils.parse_output(res)
        
    elif request.method == "POST":
      idCustomer = request.args.get("customer_id")
      stmtAcceptCustomer = select(MarketingClient).where(MarketingClient.id == idCustomer)
      customerRes = db_session.execute(stmtAcceptCustomer).all()
      db_session.commit()

      customer = utils.parse_output(customerRes)[0]
      oldCustomer = MarketingOldClient(
         id=customer["id"],
         age=customer["age"],
         job=customer["job"],
         marital=customer["marital"],
         education=customer["education"],
         default=customer["default"],
         balance=customer["balance"],
         housing=customer["housing"],
         loan=customer["loan"],
         contact=customer["contact"],
         day=customer["day"],
         month=customer["month"],
         duration=customer["duration"],
         campaign=customer["campaign"],
         pdays=customer["pdays"],
         previous=customer["previous"],
         poutcome=customer["poutcome"],
      )
      db_session.add(oldCustomer)
      stmtDeleteCustomer = delete(MarketingClient).where(MarketingClient.id == idCustomer)
      _ = db_session.execute(stmtDeleteCustomer)
      return make_response("success", 200)