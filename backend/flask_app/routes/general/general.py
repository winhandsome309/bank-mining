from flask import request, make_response
from flask_app import app
from flask_app.database import db_session
import flask_app.helper.utils as utils
from sqlalchemy import select
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import Staff, Customer

@app.route("/api/predict-result", methods=["GET", "POST"])
def get_predict_result():
    if request.method == "GET":
        application_id = request.args.get("application_id")

        if application_id:
            stmt = select(PredictResult).where(PredictResult.id == application_id)
        else:
            stmt = select(PredictResult)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.parse_output(res)

@app.route("/api/model-info", methods=["GET"])
def get_model_info():
    feature = request.args.get("feature")
    model = ModelInfo
    res = []
    if model:
        stmt = select(model).where(model.feature == feature)
        res = db_session.execute(stmt).all()
        db_session.commit()
    return utils.parse_output(res)

@app.route("/api/admin/staffs", methods=["GET", "POST"])
def get_all_staff():
    if request.method == "GET":
        stmt = select(Staff)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.parse_output(res)

@app.route("/api/admin/customers", methods=["GET", "POST"])
def get_all_customer():
    if request.method == "GET":
        stmt = select(Customer)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.parse_output(res)
