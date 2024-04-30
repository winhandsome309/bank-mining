from flask_cors import cross_origin
from flask import request
import jwt
import time
from flask_app.helper.config import DevConfig
from flask_app import app

appconfig = DevConfig


@app.route("/")
@cross_origin()
def index():
    return "<p>This is index file</p>"

@app.route("/api/metabase/get-token", methods=["GET"])
@cross_origin()
def getToken():
    if request.method == "GET":
        idDashboard = int(request.args.get("id"))
        payload = {
        "resource": {"dashboard": idDashboard},
        "params": {
            
        },
        "exp": round(time.time()) + (60 * 10) # 10 minute expiration
        }
        token = jwt.encode(payload, appconfig.METABASE_SECRET_KEY, algorithm="HS256")

        iframeUrl = appconfig.METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true"
        return iframeUrl