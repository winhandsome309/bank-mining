from flask import request, make_response
from flask_app import app
from flask_app.helper.session_scope import session_scope
import flask_app.helper.utils as utils
from sqlalchemy import select
from flask_app.models import ModelInfo
from flask_app.models import PredictResult

@app.route("/api/predict-result", methods=["GET", "POST"])
def get_predict_result():
    if request.method == "GET":
        application_id = request.args.get("application_id")

        with session_scope() as session:
            if application_id:
                stmt = select(PredictResult).where(PredictResult.id == application_id)
            else:
                stmt = select(PredictResult)
            res = session.execute(stmt).all()
            return utils.parse_output(res)

@app.route("/api/model-info", methods=["GET"])
def get_model_info():
    feature = request.args.get("feature")
    with session_scope() as session:
        model = ModelInfo
        res = []
        if model:
            stmt = select(model).where(model.feature == feature)
            res = session.execute(stmt).all()
        return utils.parse_output(res)