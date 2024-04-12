
from flask_app.models import PredictResult
from flask_app.models import HistoryMarketingClients
from flask_app.models import MarketingClient
from flask_app.models import ClientID
from flask_app.helper.session_scope import session_scope
from sqlalchemy import select, null, update, delete
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk

model_info = wk.ModelInfo.create('Marketing Campaign')
worker = wk.MarketingWorker(model_info)

@app.route("/api/marketing/history_data", methods=["GET", "POST"])
def marketing_history_data():
    if request.method == "GET":
        with session_scope() as session:
            stmt = select(HistoryMarketingClients)
            res = session.execute(stmt).all()
            return utils.parse_output(res)

@app.route('/api/marketing/client', methods=['GET', 'POST', 'DELETE'])
def client():
   if request.method == 'GET': 
      with session_scope() as session:
         stmt = select(MarketingClient)
         res = session.execute(stmt).all()
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
      id          = utils.get_new_applicaion_id(str(created))

      with session_scope() as session:
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
         stmtFind = select(MarketingClient).where(MarketingClient.id == id)
         resFind = session.execute(stmtFind).fetchall()
         if resFind.count == 0:
               return make_response("Record not found", 401)
         stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
         stmtDeleteApp = delete(MarketingClient).where(MarketingClient.id == id)
         resDeletePredict = session.execute(stmtDeletePredict)
         resDeleteApp = session.execute(stmtDeleteApp)
         return make_response("Deleted", 200)