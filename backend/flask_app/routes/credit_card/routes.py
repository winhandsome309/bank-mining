
from flask_app.models import PredictResult
from flask_app.models import CreditCardTransaction
from flask_app.models import HistoryCreditCardTransaction
from flask_app.models import ClientID
from flask_app.helper.session_scope import session_scope
from sqlalchemy import select, null, update, delete
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk
import time

model_info = wk.ModelInfo.create('Credit Fraud Detection')
worker = wk.CreditCardWorker(model_info)
worker.load_model_info(session_scope)

@app.route("/api/credit_card/history_data", methods=["GET", "POST"])
def credit_card_history_data():
    if request.method == "GET":
        with session_scope() as session:
            stmt = select(HistoryCreditCardTransaction).fetch(100)
            res = session.execute(stmt).all()
            return utils.parse_output(res)

@app.route('/api/credit_card/transaction', methods=['GET', 'POST', 'DELETE'])
def credit_card_transaction():
   if request.method == 'GET': 
      with session_scope() as session:
         stmt = select(CreditCardTransaction)
         res = session.execute(stmt).all()
         return utils.parse_output(res)
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

      with session_scope() as session:
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
               session.add(new_id)
               session.add(new_client)
               session.add(new_predict_result)
         except:
               return make_response("ERROR", 401)
      return make_response(predict, 201)
   
   if request.method == "DELETE":
      form = request.form
      id = form.get("id")
      with session_scope() as session:
         stmtFind = select(CreditCardTransaction).where(CreditCardTransaction.id == id)
         resFind = session.execute(stmtFind).fetchall()
         if resFind.count == 0:
               return make_response("Record not found", 401)
         stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
         stmtDeleteApp = delete(CreditCardTransaction).where(CreditCardTransaction.id == id)
         resDeletePredict = session.execute(stmtDeletePredict)
         resDeleteApp = session.execute(stmtDeleteApp)
         return make_response("Deleted", 200)
