from flask_app.models import HistoryApps
from flask_app.models import Application
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.helper.session_scope import session_scope
from sqlalchemy import select, null, update
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper.worker import LoanWorker

MODEL_PKL = {
    "logistic_regression_(feature_selected)": 'analysis/loan_app/workspace/logistic_regression_(feature_selected).pkl',
    "logistic_regression_(improved)": "analysis/loan_app/workspace/logistic_regression_(improved).pkl",
    "random_forest_(improved)": "analysis/loan_app/workspace/random_forest_(improved).pkl"
}

MODEL_INFO = "analysis/loan_app/workspace/model_info.json"
LOAN_SCALER = "analysis/loan_app/workspace/loan_scaler.gz"

worker = LoanWorker(MODEL_PKL, MODEL_INFO, LOAN_SCALER)

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

        created =       datetime.datetime.now()
        id =            utils.get_new_applicaion_id(created.__str__())

        # predict


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
                        created=created,
                        processed=False,
                        processed_at=null()
                    )
            predict = worker.predict(new_app.as_dict())
            new_predict_result = PredictResult(
                        id=id,
                        predict=predict.__str__()
            )
            try:
                session.add(new_app)
                session.add(new_predict_result)
            except:
                return make_response("ERROR", 401)
        return make_response(predict, 201)

@app.route("/api/predict-result", methods=["POST"])
def get_predict_result():
    application_id = request.args.get("application_id")

    with session_scope() as session:
        stmt = select(PredictResult).where(PredictResult.id == application_id)
        res = session.execute(stmt).all()
        return utils.parse_output(res)

@app.route("/api/model-info", methods=["GET"])
def get_model_info():
    feature = request.args.get("feature")
    from_feature_to_model = {
        'loan_application': ModelInfo
    }
    with session_scope() as session:
        model = from_feature_to_model[feature]
        res = []
        if model:
            stmt = select(model)
            res = session.execute(stmt).all()
        return utils.parse_output(res)

@app.route("/api/loan_application/model-info/update", methods=["POST"])
def update_model_info(path=MODEL_INFO):
    model_info_json = utils.load_from_json(path)
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