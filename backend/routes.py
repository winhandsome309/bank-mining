# Command run: flask run
import jwt
import time
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from config import DevConfig
from models import HistoryApps
from session_scope import session_scope
from sqlalchemy import select
import utils


appconfig = DevConfig
app = Flask(__name__)
app.config.from_object(appconfig)
cors = CORS(app)


@app.route("/")
@cross_origin()
def index():
    return "<p>This is index file</p>"

@app.route("/get-token", methods=["GET"])
@cross_origin()
def getToken():
    if request.method == "GET":
        payload = {
        "resource": {"dashboard": 9},
        "params": {
            
        },
        "exp": round(time.time()) + (60 * 10) # 10 minute expiration
        }
        token = jwt.encode(payload, appconfig.METABASE_SECRET_KEY, algorithm="HS256")

        iframeUrl = appconfig.METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true"
        return iframeUrl

@app.route("/loan-app/history", methods=["GET", "POST"])
def loanAppHistory():
    if request.method == "GET":
        with session_scope() as session:
            stmt = select(HistoryApps)
            res = session.execute(stmt).all()
            return utils.parse_output(res)