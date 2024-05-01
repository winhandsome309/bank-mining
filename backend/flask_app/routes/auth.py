from flask_cors import cross_origin
from flask import request, make_response
import jwt
import time
from flask_app.helper.config import DevConfig
from flask_app import app
from sqlalchemy import select
from flask_app.models import User, RolesUsers, Role
from flask_app.database import db_session
import flask_app.helper.utils as utils
import json
from flask_security import hash_password, verify_password

appconfig = DevConfig


@app.route("/")
@cross_origin()
def index():
    return "<p>This is index file</p>"

@app.route("/api/login", methods=["POST"])
def afterLogin():
    request_data = request.get_json()
    email       = request_data['email']
    password    = request_data['password']

    stmt        = select(User).where(User.email == email)
    res         = db_session.execute(stmt).all()
    db_session.commit()
    user        = utils.parse_output(res)[0]

    if (verify_password(password, user["password"])):
        stmt    = select(RolesUsers).where(RolesUsers.user_id == user['id'])
        res     = db_session.execute(stmt).all()
        db_session.commit()
        roleUser  = utils.parse_output(res)[0]

        stmt    = select(Role).where(Role.id == roleUser["role_id"])
        res     = db_session.execute(stmt).all()
        db_session.commit()
        role  = utils.parse_output(res)[0]

        resp = make_response("SUCCESS", 200)
        resp.set_cookie('role', role["name"].lower())
        return resp
    return make_response("ERROR", 400)

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