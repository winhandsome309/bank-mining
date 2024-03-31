# Command run: flask --app routes run --debug

import jwt
import time
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
import psycopg2
import ast

METABASE_SITE_URL = "http://localhost:3002"
METABASE_SECRET_KEY = "6d5bc8d158ffd9cd13c4cc4c503ce582f92eb7aa6b62ed08034c8f4b97b0b884"

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

postgre_host = "dpg-co4o7bcf7o1s738upj3g-a.singapore-postgres.render.com"
postgre_user = "banking_db_4ebh_user"
postgre_password = "h8cggpsHBl0E6KRdCuOxNnuL7OkX4BgV"
postgre_db = "banking_db_4ebh"

db = psycopg2.connect(
        host=postgre_host,
        database=postgre_db,
        user=postgre_user,
        password=postgre_password)

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
        token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")

        iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true"
        return iframeUrl

@app.route("/loan-app/waiting", methods=["GET", "POST"])
def loanAppWaiting():
    if request.method == "GET":
        cursor = db.cursor()
        cursor.execute("SELECT * from history_loan_data LIMIT 10")
        data = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = []
        for row in data:
            temp = {}
            for i, val in enumerate(columns):
                temp[val] = row[i]
            result.append(temp)
        return result