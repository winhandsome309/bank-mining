from flask_app.models import HistoryApps
from flask_app.models import Application
from flask_app.helper.session_scope import session_scope
from sqlalchemy import select, null
from flask_app import app
from flask import request, jsonify, make_response
import datetime
import flask_app.helper.utils as utils



@app.route("/api/loan_application/history_data", methods=["GET", "POST"])
def history_data():
    if request.method == "GET":
        with session_scope() as session:
            stmt = select(HistoryApps)
            res = session.execute(stmt).all()
            return utils.parse_output(res)

@app.route("/api/loan_application/waiting-list", methods=["GET", "POST"])
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
        not_fuly_paid = form.get("not_fully_paid")

        created =       datetime.datetime.now()
        id =            utils.get_new_applicaion_id(created.__str__())

        with session_scope() as session:
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
                        not_fully_paid=not_fuly_paid,
                        created=created,
                        processed=False,
                        processed_at=null()
                    )
            try:
                session.add(new_app)
            except:
                return make_response("ERROR", 401)
        return make_response("Created", 201)