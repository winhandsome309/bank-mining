from flask_app.models import PredictResult
from flask_app.models import HistoryMarketingClients
from flask_app.models import MarketingClient
from flask_app.models import ClientID
from flask_app.database import db_session
from sqlalchemy import select, null, update, delete, inspect, text
from flask_app import app
from flask import request, make_response
import datetime
import flask_app.helper.utils as utils
from flask_app.helper import worker as wk
from flask_security import roles_accepted
import pandas
import time

model_info = wk.ModelInfo.create("Marketing Campaign")
worker = wk.MarketingWorker(model_info)
worker.load_model_info(db_session)


@app.route(
    "/api/marketing/history_data",
    methods=["GET", "POST"],
    endpoint="marketing_history_data",
)
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
def marketing_history_data():
    if request.method == "GET":
        stmt = select(HistoryMarketingClients).fetch(100)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.Utils.parse_output(res)


@app.route(
    "/api/marketing/client",
    methods=["GET", "POST", "DELETE"],
    endpoint="marketing_client",
)
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
def marketing_client():
    if request.method == "GET":
        stmt = select(MarketingClient)
        res = db_session.execute(stmt).all()
        db_session.commit()

        return utils.parse_output(res)
    if request.method == "POST":
        form = request.form
        age = form.get("age")
        job = form.get("job")
        marital = form.get("marital")
        education = form.get("education")
        default = form.get("default")
        balance = form.get("balance")
        housing = form.get("housing")
        loan = form.get("loan")
        contact = form.get("contact")
        day = form.get("day")
        month = form.get("month")
        duration = form.get("duration")
        campaign = form.get("campaign")
        pdays = form.get("pdays")
        previous = form.get("previous")
        poutcome = form.get("poutcome")

        created = datetime.datetime.now()
        # id          = utils.get_new_applicaion_id(str(created))
        id = str(int(time.time()))

        new_id = ClientID(id=id)
        new_client = MarketingClient(
            id=id,
            age=age,
            job=job,
            marital=marital,
            education=education,
            default=default,
            balance=balance,
            housing=housing,
            loan=loan,
            contact=contact,
            day=day,
            month=month,
            duration=duration,
            campaign=campaign,
            pdays=pdays,
            previous=previous,
            poutcome=poutcome,
            created=created,
        )
        predict = worker.predict(new_client.as_dict())

        new_predict_result = PredictResult(
            id=id, predict=predict.__str__(), feature="marketing"
        )
        try:
            db_session.add(new_id)
            db_session.commit()

            db_session.add(new_client)
            db_session.commit()

            db_session.add(new_predict_result)
            db_session.commit()
        except:
            return make_response("ERROR", 401)
        return make_response(predict, 201)

    if request.method == "DELETE":
        form = request.form
        id = form.get("id")
        stmtFind = select(MarketingClient).where(MarketingClient.id == id)
        resFind = db_session.execute(stmtFind).fetchall()
        db_session.commit()

        if resFind.count == 0:
            return make_response("Record not found", 401)
        stmtDeletePredict = delete(PredictResult).where(PredictResult.id == id)
        stmtDeleteApp = delete(MarketingClient).where(MarketingClient.id == id)
        resDeletePredict = db_session.execute(stmtDeletePredict)
        db_session.commit()

        resDeleteApp = db_session.execute(stmtDeleteApp)
        db_session.commit()

        return make_response("Deleted", 200)

@app.route(
    "/api/marketing/list",
    methods=["POST"],
    endpoint="marketing_list_client",
)
@utils.server_return_500_if_errors
def marketing_client():
    file = request.files['file']
    if file.filename.endswith('.csv'):
        # Read file
        df = pandas.read_csv(file)
        listData = df.to_dict(orient="records")
        for data in listData:
            data["id"] = str(int(time.time()))
            id = str(int(time.time())) 
            new_id = ClientID(id=id)

            new_client = MarketingClient(
                id=id,
                age = data["age"],
                job = data["job"],
                marital = data["marital"],
                education = data["education"],
                default = data["default"],
                balance = data["balance"],
                housing = data["housing"],
                loan = data["loan"],
                contact = data["contact"],
                day = data["day"],
                month = data["month"],
                duration = data["duration"],
                campaign = data["campaign"],
                pdays = data["pdays"],
                previous = data["previous"],
                poutcome = data["poutcome"],
            )
            predict = worker.predict(new_client.as_dict())

            new_predict_result = PredictResult(
                id=id, predict=predict.__str__(), feature="marketing"
            )
            try:
                db_session.add(new_id)
                db_session.commit()

                db_session.add(new_client)
                db_session.commit()

                db_session.add(new_predict_result)
                db_session.commit()
            except:
                pass
            time.sleep(1)
    return make_response("SUCCESS", 201)

@app.route(
    "/api/marketing/detail", methods=["GET"], endpoint="get_detailed_describe_marketing"
)
@utils.server_return_500_if_errors
@roles_accepted("Maintainer", "Admin")
def get_detailed_describe_marketing():
    detailed = []
    columns = [column.name for column in inspect(HistoryMarketingClients).c]
    marketing_client_id = request.args.get("id")
    this_marketing_client = db_session.get(MarketingClient, marketing_client_id)
    categorical_vars = worker.categorical_to_number.keys()
    for key in columns:
        if key == "deposit":
            continue
        value = this_marketing_client.as_dict().get(key)
        info = {"name": key, "type": "", "value": []}
        if key in categorical_vars:
            info["type"] = "category"
            stmt1 = text(
                f"""
                SELECT COUNT(*)
                FROM {HistoryMarketingClients.__tablename__} t
                WHERE t.{key} = '{value}' AND t.deposit = 'yes';
            """
            )
            stmt2 = select(HistoryMarketingClients)
            res = db_session.execute(stmt1).first()  # (val,)
            (len1,) = res

            rate = len1 / len(db_session.execute(stmt2).all())
            info["value"].append(round(rate, 2) * 100)
        else:
            info["type"] = "number"
            stmt1 = text(
                f"""
                SELECT {key}
                FROM {HistoryMarketingClients.__tablename__}
                ORDER BY {key} DESC
            """
            )

            stmt2 = text(
                f"""
                SELECT AVG({key})
                FROM {HistoryMarketingClients.__tablename__}
            """
            )

            value_lst = [float(val) for (val,) in db_session.execute(stmt1).all()]
            (avg,) = db_session.execute(stmt2).first()
            found_pos = False
            for idx, vl in enumerate(value_lst):
                if value >= vl:
                    info["value"].append(round(idx / len(value_lst), 2) * 100)
                    found_pos = True
                    break
                if value < vl:
                    continue
            if not found_pos:
                info["value"].append(-1)
            info["value"].append(round(value - avg, 2))
            info["value"].append(round(avg, 2))

        detailed.append(info)
    db_session.commit()
    body = utils.create_response_body(
        200, False, get_detailed_describe_marketing.__name__, detailed
    )
    return make_response(body, 200)
