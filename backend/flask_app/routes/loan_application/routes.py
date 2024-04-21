from flask_app.models import HistoryApps
from flask_app.models import Application
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import ClientID
from flask_app.helper.session_scope import session_scope
from sqlalchemy import select, null, update, delete
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk
import time

model_info = wk.ModelInfo.create("Loan Application")
worker = wk.LoanWorker(model_info)

@app.route("/api/loan_application/history_data", methods=["GET", "POST"])
def history_data():
    if request.method == "GET":
        with session_scope() as session:
            stmt = select(HistoryApps)
            res = session.execute(stmt).all()
            return utils.parse_output(res)

@app.route("/api/loan_application/waiting-list", methods=["GET", "POST", "DELETE"])
def waiting_list():
    if request.method == "GET":
        with session_scope() as session:
            stmt = select(Application)
            res = session.execute(stmt).all()
            return utils.parse_output(res)

    if request.method == "POST":
        form = request.form
        credit_policy = form.get("credit_policy")
        purpose =       form.get("purpose")
        int_rate =      form.get("int_rate")
        installment =   form.get("installment")
        log_annual =    form.get("log_annual_inc")
        dti =           form.get("dti")
        fico =          form.get("fico")
        days_with =     form.get("days_with_cr_line")
        revol_bal =     form.get("revol_bal")
        revol_util =    form.get("revol_util")
        inq_last =      form.get("inq_last_6mths")
        delinq_2yrs =   form.get("delinq_2yrs")
        pub_rec =       form.get("pub_rec")

        created =       datetime.datetime.now()
        # id =            utils.get_new_applicaion_id(created.__str__())
        id = str(int(time.time()))

        # predict


        with session_scope() as session:
            new_id = ClientID(id=id)
            new_app = Application(
                        id=id,
                        credit_policy=credit_policy, 
                        purpose=purpose,
                        int_rate=int_rate,
                        installment=installment,
                        log_annual_inc=log_annual,
                        dti=dti,
                        fico=fico,
                        days_with_cr_line=days_with,
                        revol_bal=revol_bal,
                        revol_util=revol_util,
                        inq_last_6mths=inq_last,
                        delinq_2yrs=delinq_2yrs,
                        pub_rec=pub_rec,
                        created=created,
                        processed=False,
                        processed_at=null()
                    )
            predict = worker.predict(new_app.as_dict())
            new_predict_result = PredictResult(
                        id=id,
                        predict=predict.__str__(),
                        feature='loan'
            )
            try:
                session.add(new_id)
                session.add(new_app)
                session.add(new_predict_result)
            except:
                return make_response("ERROR", 401)
        return make_response(predict, 201)

    if request.method == "DELETE":
        form = request.form
        id = form.get("id")
        with session_scope() as session:
            stmtFind = select(Application).where(Application.id == id)
            resFind = session.execute(stmtFind).fetchall()
            if resFind.count == 0:
                return make_response("Record not found", 401)
            stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
            stmtDeleteApp = delete(Application).where(Application.id == id)
            _ = session.execute(stmtDeletePredict)
            _ = session.execute(stmtDeleteApp)
            return make_response("Deleted", 200)

@app.route("/api/loan_application/processed-list", methods=["GET", "POST"])
def processed_list():
    if request.method == "GET":
        with session_scope() as session:
                stmt = select(HistoryApps)
                res = session.execute(stmt).all()
                return utils.parse_output(res)
    elif request.method == "POST":
        with session_scope() as session:
            idWaitingApp = request.args.get("application_id")
            stmtAcceptWaitingApp = select(Application).where(Application.id == idWaitingApp)
            waitingAppRes = session.execute(stmtAcceptWaitingApp).all()
            waitingApp = utils.parse_output(waitingAppRes)[0]
            processedApp = HistoryApps(
                id=waitingApp["id"],
                credit_policy=waitingApp["credit_policy"], 
                purpose=waitingApp["purpose"],
                int_rate=waitingApp["int_rate"],
                installment=waitingApp["installment"],
                log_annual_inc=waitingApp["log_annual_inc"],
                dti=waitingApp["dti"],
                fico=waitingApp["fico"],
                days_with_cr_line=waitingApp["days_with_cr_line"],
                revol_bal=waitingApp["revol_bal"],
                revol_util=waitingApp["revol_util"],
                inq_last_6mths=waitingApp["inq_last_6mths"],
                delinq_2yrs=waitingApp["delinq_2yrs"],
                pub_rec=waitingApp["pub_rec"],
                not_fully_paid=-1,
            )
            session.add(processedApp)
            stmtDeleteApp = delete(Application).where(Application.id == idWaitingApp)
            _ = session.execute(stmtDeleteApp)
            return make_response("success", 200)

@app.route("/api/loan_application/model-info/update", methods=["POST"])
def update_model_info():
    model_info_json = worker.get_model_info()
    try:
        with session_scope() as session:
            for model_info in model_info_json:
                new_model = ModelInfo(
                    model=model_info['Model'],
                    accuracy=model_info['Accuracy'],
                    precision=model_info['Precision'],
                    recall=model_info['Recall'],
                    auc=model_info['AUC'],
                    feature='loan_application'
                )
                stmt = select(ModelInfo).where(ModelInfo.model == new_model.model and ModelInfo.feature == new_model.feature)
            
                if session.execute(stmt).all():
                    stmt = (
                        update(ModelInfo)
                        .where(ModelInfo.model == new_model.model)
                        .where(ModelInfo.feature == new_model.feature)
                        .values(new_model.as_dict())
                    )
                    session.execute(stmt)
                else:
                    session.add(new_model)
            return make_response("Created", 201)
    except Exception as e:
        print(f">> ERROR: {e}")
        return make_response("ERROR", 401)