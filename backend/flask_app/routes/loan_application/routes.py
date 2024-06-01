from flask_app.models import HistoryApps
from flask_app.models import Application
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import ClientID
from flask_app.models import Customer
from flask_app.database import db_session
from sqlalchemy import select, null, update, delete, desc
from sqlalchemy import func, text, inspect
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

@app.route("/api/loan_application/history_data", methods=["GET", "POST"], endpoint='history_data')
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
def history_data():
    if request.method == "GET":
        stmt = select(HistoryApps).fetch(100)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.parse_output(res)

@app.route("/api/loan_application/waiting-list", methods=["GET", "POST", "DELETE"], endpoint='waiting_list')
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin", "Moderator")
def waiting_list():
    if request.method == "GET":
        stmt = select(Application).where(Application.processed == False)
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
        customer_id =   form.get("customer_id")

        created =       datetime.datetime.now()
        # id =            utils.get_new_applicaion_id(created.__str__())
        id = str(int(time.time()))

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
            db_session.add(new_app)
            db_session.commit()

            db_session.add(new_id)
            utils.assign_customer_to_application(customer_id=int(customer_id), application_id=id, db_session=db_session)
            db_session.commit()

            db_session.add(new_predict_result)
            db_session.commit()
        except Exception as e:
            db_session.rollback()
            return make_response(str(e), 401)
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

@app.route("/api/loan_application/list/waiting-list", methods=["POST"], endpoint='list_waiting_list')
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
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

@app.route("/api/loan_application/processed-list", methods=["GET", "POST"], endpoint='processed_list')
@utils.server_return_500_if_errors
@roles_accepted('Admin', 'Maintainer')
def processed_list():
    if request.method == "GET":
            stmt = select(Application).where(Application.processed == True)
            res = db_session.execute(stmt).all()
            db_session.commit()
            return utils.parse_output(res)

@app.route('/api/loan_application/process', methods=['POST'], endpoint='toggle_process_application')
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
def toggle_process_application():
    form = request.form
    applicaton_id = str(form.get('application_id'))
    result = form.get('result')

    application = db_session.get(Application, applicaton_id)
    assert application, "Application is not existed!"

    processed_at = datetime.datetime.now()
    # stmt = update(Application).where(Application.id == applicaton_id) \
    #         .values(processed = not application.processed, processed_at=processed_at)

    stmt = update(Application).where(Application.id == applicaton_id) \
            .values(processed = True, processed_at=processed_at, process_result=(int(result) == 1))
    db_session.execute(stmt)
    db_session.commit()

    body = utils.create_response_body(200, False, toggle_process_application.__name__, data={"message": "Toggle process application successfully!"})
    return make_response(body, 200)

@app.route('/api/loan_application/detail', methods=['GET'], endpoint='get_detailed_describe_loan')
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
def get_detailed_describe_loan():
    detailed = []
    columns = [column.name for column in inspect(HistoryApps).c]
    application_id = request.args.get('id')
    this_application = db_session.get(Application, application_id)
    for key in columns:
        if key in ['id', 'not_fully_paid']: continue
        value = this_application.as_dict().get(key)
        info = {'name': key, 'type': "", 'value': []}
        if key in ['credit_policy', 'purpose']:
            info['type'] = 'category'
            stmt1 = text(f"""
                SELECT COUNT(*)
                FROM {HistoryApps.__tablename__} t
                WHERE t.{key} = '{value}' AND t.not_fully_paid = '1';
            """)
            stmt2 = select(HistoryApps.credit_policy)
            (len1,) = db_session.execute(stmt1).first() # (val,)

            rate = len1 / len(db_session.execute(stmt2).all())
            info['value'].append(round(rate, 2) * 100)
        else:
            info["type"] = 'number'
            stmt1 = text(f"""
                SELECT {key}
                FROM {HistoryApps.__tablename__}
                ORDER BY {key} DESC
            """)

            stmt2 = text(f"""
                SELECT AVG({key})
                FROM {HistoryApps.__tablename__}
            """)

            value_lst = [float(val) for (val,) in  db_session.execute(stmt1).all()]
            (avg,) = db_session.execute(stmt2).first()
            found_pos = False
            for idx, vl in enumerate(value_lst):
                try:
                    if value >= vl:
                        info["value"].append(round(idx / len(value_lst), 2) * 100)
                        found_pos = True
                        break
                    if value < vl:
                        continue
                except Exception as e:
                    app.logger.info(f"{e} -- {value, vl}")
            if not found_pos:
                info["value"].append(-1)
            info["value"].append(round(value - avg, 2))
            info["value"].append(round(avg, 2))

        detailed.append(info)

    db_session.commit()
    body = utils.create_response_body(200, False, get_detailed_describe_loan.__name__, detailed)
    return make_response(body, 200)
