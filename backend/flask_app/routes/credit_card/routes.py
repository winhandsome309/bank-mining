
from flask_app.models import PredictResult
from flask_app.models import CreditCardTransaction
from flask_app.models import HistoryCreditCardTransaction
from flask_app.models import ClientID
from flask_app.database import db_session
from sqlalchemy import select, null, update, delete
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk
import time
from flask_security import roles_accepted

model_info = wk.ModelInfo.create('Credit Fraud Detection')
worker = wk.CreditCardWorker(model_info)
worker.load_model_info(db_session)

@app.route("/api/credit_card/history_data", methods=["GET", "POST"], endpoint='credit_card_history_data')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin')
def credit_card_history_data():
    if request.method == "GET":
         stmt = select(HistoryCreditCardTransaction).fetch(100)
         res = db_session.execute(stmt).all()
         db_session.commit()
         return utils.parse_output(res)

@app.route('/api/credit_card/transaction', methods=['GET', 'POST', 'DELETE'], endpoint='credit_card_transaction')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin', 'Moderator')
def credit_card_transaction():
   if request.method == 'GET': 
      stmt = select(CreditCardTransaction)
      res = db_session.execute(stmt).all()
      db_session.commit()

      resp = utils.parse_output(res)
      for i in range(len(resp)):
         stmt = select(PredictResult).where(PredictResult.id == resp[i]["id"])
         res = db_session.execute(stmt).all()
         temp = utils.parse_output(res)

         resp[i]["predict"] = temp[0]["predict"]
         db_session.commit()

      return resp
   if request.method == 'POST':
      form = request.form
      distance_from_home = float(form.get('distance_from_home'))
      distance_from_last_transaction = float(form.get('distance_from_last_transaction'))
      ratio_to_median_purchase_price = float(form.get('ratio_to_median_purchase_price'))
      repeat_retailer = float(form.get('repeat_retailer'))
      used_chip = float(form.get('used_chip'))
      used_pin_number = float(form.get('used_pin_number'))
      online_order = float(form.get('online_order'))

      created     = datetime.datetime.now()
      # id          = utils.get_new_applicaion_id(str(created))
      id = str(int(time.time()))

      new_id = ClientID(id=id)
      new_client = CreditCardTransaction(
         id=id,
         distance_from_home=distance_from_home,
         distance_from_last_transaction=distance_from_last_transaction,
         ratio_to_median_purchase_price=ratio_to_median_purchase_price,
         repeat_retailer=repeat_retailer,
         used_chip=used_chip,
         used_pin_number=used_pin_number,
         online_order=online_order,
         created=created,
         processed=False,
         processed_at=null()
      )
      predict = worker.predict(new_client.as_dict())

      new_predict_result = PredictResult(
                  id=id,
                  predict=predict.__str__(),
                  feature='credit_card'
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
      stmtFind = select(CreditCardTransaction).where(CreditCardTransaction.id == id)
      resFind = db_session.execute(stmtFind).fetchall()
      db_session.commit()

      if resFind.count == 0:
            return make_response("Record not found", 401)
      stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
      stmtDeleteApp = delete(CreditCardTransaction).where(CreditCardTransaction.id == id)
      resDeletePredict = db_session.execute(stmtDeletePredict)
      db_session.commit()

      resDeleteApp = db_session.execute(stmtDeleteApp)
      db_session.commit()
      return make_response("Deleted", 200)
