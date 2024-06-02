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
from flask_security import hash_password, verify_password, auth_required, current_user, logout_user, roles_accepted, unauth_csrf

appconfig = DevConfig

def getMetabaseDashboardId(typ):
    if typ == 'loan':
        return int(appconfig.LOAN_DASHBOARD)
    if typ == 'marketing':
        return int(appconfig.MARKETING_DASHBOARD)
    if typ == 'credit_card':
        return int(appconfig.CREDITCARD_DASHBOARD)

@app.route("/")
@cross_origin()
def index():
    return app.send_static_file('index.html')

@app.route("/api/login", methods=["POST"], endpoint='afterLogin')
@utils.server_return_500_if_errors
@auth_required()
def afterLogin():
    for role in ['Maintainer', 'Admin', 'Moderator', 'Customer']:
        if current_user.has_role(role):
           resp = make_response("SET ROLE SUCCESS", 200)
           resp.set_cookie('role', role)
           return resp
    logout_user()
    return make_response("User hasn't suitable role", 400)

@app.route("/api/metabase/get-token", methods=["GET"], endpoint='getMetabaseToken')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin', 'Moderator')
def getMetabaseToken():
    if request.method == "GET":
        typ = request.args.get("type")
        did = getMetabaseDashboardId(typ=typ)
        payload = {
        "resource": {"dashboard": did},
        "params": {

        },
        "exp": round(time.time()) + (60 * 10) # 10 minute expiration
        }
        token = jwt.encode(payload, appconfig.METABASE_SECRET_KEY, algorithm="HS256")

        iframeUrl = appconfig.METABASE_SITE_URL + "/embed/dashboard/" + token + "#theme=transparent&bordered=false&titled=false"
        app.logger.info(f"View {typ} dashboard - id: {did} - with key: {appconfig.METABASE_SECRET_KEY}")
        return iframeUrl

@app.route("/api/remark/get-token", methods=["GET"], endpoint='get_remark_token')
@utils.server_return_500_if_errors
@roles_accepted('Maintainer', 'Admin', 'Moderator')
def get_remark_token():
    if request.method == "GET":
        email = request.args.get("email")
        stmt = select(User.username).where(User.email == email)
        res = db_session.execute(stmt).first()
        app.logger.info(f"Using comment service in {appconfig.REACT_APP_REMARK_URL}")
        username = res[0]
        return {"url": appconfig.REACT_APP_REMARK_URL, "token": utils.generate_remark_token(username, email)}
