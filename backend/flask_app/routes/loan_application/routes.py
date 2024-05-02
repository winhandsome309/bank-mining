from flask_app.models import HistoryApps
from flask_app.models import ProcessedApps
from flask_app.models import Application
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import ClientID
from flask_app.database import db_session
from sqlalchemy import select, null, update, delete
from flask_app import app
from flask import request, make_response, render_template_string
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk
import time
from flask_security import roles_accepted, auth_required, current_user, login_required
import pandas
import time

model_info = wk.ModelInfo.create("Loan Application")
worker = wk.LoanWorker(model_info)
worker.load_model_info(db_session)

@app.route("/api/loan_application/history_data", methods=["GET", "POST"])
def history_data():
    if request.method == "GET":
        stmt = select(HistoryApps).fetch(100)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.parse_output(res)

@app.route("/api/loan_application/waiting-list", methods=["GET", "POST", "DELETE"])
def waiting_list():
    if request.method == "GET":
        stmt = select(Application)
        res = db_session.execute(stmt).all()
        db_session.commit()

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
            db_session.add(new_id)
            db_session.commit()

            db_session.add(new_app)
            db_session.commit()

            db_session.add(new_predict_result)
            db_session.commit()
        except:
            return make_response("ERROR", 401)
        return make_response(predict, 201)

    if request.method == "DELETE":
        form = request.form
        id = form.get("id")
        stmtFind = select(Application).where(Application.id == id)
        resFind = db_session.execute(stmtFind).fetchall()
        if resFind.count == 0:
            return make_response("Record not found", 401)
        stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
        stmtDeleteApp = delete(Application).where(Application.id == id)
        _ = db_session.execute(stmtDeletePredict)
        db_session.commit()

        _ = db_session.execute(stmtDeleteApp)
        db_session.commit()

        return make_response("Deleted", 200)
    
@app.route("/api/loan_application/list/waiting-list", methods=["POST"])
def list_waiting_list():
    if request.method == "POST":
        file = request.files['file']
        if file.filename.endswith('.csv'):
            # Read file
            df = pandas.read_csv(file)
            listData = df.to_dict(orient="records")
            for data in listData:
                data["id"] = str(int(time.time()))
                id = str(int(time.time())) 
                new_id = ClientID(id=id)

                new_app = Application(
                    id=id,
                    credit_policy=data["credit_policy"],
                    purpose=data["purpose"],
                    int_rate=data["int_rate"],
                    installment=data["installment"],
                    log_annual_inc=data["log_annual_inc"],
                    dti=data["dti"],
                    fico=data["fico"],
                    days_with_cr_line=data["days_with_cr_line"],
                    revol_bal=data["revol_bal"],
                    revol_util=data["revol_util"],
                    inq_last_6mths=data["inq_last_6mths"],
                    delinq_2yrs=data["delinq_2yrs"],
                    pub_rec=data["pub_rec"],
                    created=datetime.datetime.now(),
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
                    db_session.add(new_id)
                    db_session.commit()

                    db_session.add(new_app)
                    db_session.commit()

                    db_session.add(new_predict_result)
                    db_session.commit()
                except:
                    pass
                time.sleep(1)
            return make_response("SUCCESS", 201)

@app.route("/api/loan_application/processed-list", methods=["GET", "POST"])
def processed_list():
    if request.method == "GET":
            stmt = select(ProcessedApps)
            res = db_session.execute(stmt).all()
            db_session.commit()
            return utils.parse_output(res)
        
    elif request.method == "POST":
        idWaitingApp = request.args.get("application_id")
        stmtAcceptWaitingApp = select(Application).where(Application.id == idWaitingApp)
        waitingAppRes = db_session.execute(stmtAcceptWaitingApp).all()
        db_session.commit()

        waitingApp = utils.parse_output(waitingAppRes)[0]
        processedApp = ProcessedApps(
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
            # not_fully_paid=-1,
        )
        db_session.add(processedApp)
        db_session.commit()

        stmtDeleteApp = delete(Application).where(Application.id == idWaitingApp)
        _ = db_session.execute(stmtDeleteApp)
        db_session.commit()
        return make_response("success", 200)
