from flask import request, make_response
from flask_app import app
from flask_app.database import db_session
import flask_app.helper.utils as utils
from sqlalchemy import select, join, update
from flask_app.models import ModelInfo
from flask_app.models import PredictResult
from flask_app.models import Staff, Customer, Vote, User, Role, RolesUsers, Application, CustomersApplications
from flask_security import roles_required, current_user, roles_accepted

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
@roles_accepted('Admin', 'Maintainer')
def get_all_staff():
    if request.method == "GET":
        try:
            staff_roles = select(User.email, User.active, User.chat_token, User.username, Staff.position, Staff.fname, Role.name.label('role')) \
                            .join(Staff, User.id == Staff.user_id) \
                            .join(RolesUsers, User.id == RolesUsers.user_id) \
                            .join(Role, RolesUsers.role_id == Role.id)
            res = db_session.execute(staff_roles)
            db_session.commit()

        except Exception as e:
            print(e)
            body = utils.create_response_body(status_code=400, error=True, action=get_all_staff.__name__)
            return make_response(body, 400)
        
        body = utils.create_response_body(status_code=200, error=False, action=get_all_staff.__name__, data=utils.Utils.parse_output(res))
        return make_response(body, 200)

@app.route("/api/admin/customers", methods=["GET", "POST"])
@roles_accepted('Admin', 'Maintainer')
def get_all_customer():
    if request.method == "GET":
        try:
            customer_with_role = select(User.email, User.active, User.chat_token, User.username, Customer.id, Customer.fname,
                                        Customer.since.label('customer_since'), Role.name.label('role'), CustomersApplications.appliation_id) \
                                .join(Customer, User.id == Customer.user_id) \
                                .join(RolesUsers, User.id == RolesUsers.user_id) \
                                .join(Role, RolesUsers.role_id == Role.id) \
                                .join(CustomersApplications, Customer.id == CustomersApplications.customer_id, isouter=True)
            # customer_with_role = select(Customer)
            res = db_session.execute(customer_with_role)
            db_session.commit()
        
        except Exception as e:
            print(e)
            body = utils.create_response_body(status_code=400, error=True, action=get_all_customer.__name__)
            return make_response(body, 400)
        
        body = utils.create_response_body(status_code=200, error=False, action=get_all_customer.__name__, data=utils.Utils.parse_output(res))
        return make_response(body, 200)

    if request.method == 'POST':
        form = request.form        
        email = form.get('email')
        customer_id = form.get('customer_id')
        application_id  = form.get('application_id')

        customer = find_customer(email=email, id=customer_id)
        if customer is not None:
            try:
                existed_app = db_session.query(CustomersApplications).filter_by(customer_id=customer.id)
                if existed_app is not None:
                    stmt = update(CustomersApplications).where(CustomersApplications.customer_id == customer.id) \
                            .values(customer_id=customer.id, appliation_id=application_id)
                    db_session.execute(stmt)
                    db_session.commit()
                else:
                    new_cus_app = CustomersApplications(
                        customer_id=customer.id,
                        application_id=application_id
                    )
                    db_session.add(new_cus_app)
                    db_session.commit()
                body = utils.create_response_body(200, False, get_all_customer.__name__, data={'message': 'Update application successfully!'})
                return make_response(body, 200)
            except:
                body = utils.create_response_body(400, True, get_all_customer.__name__)
                return make_response(body, 400)
        
        body = utils.create_response_body(400, True, get_all_customer.__name__)
        return make_response(body, 400)


def find_customer(id=None, email=None) -> Customer:
    if id is not None or email is not None:
        if id is not None:
            return db_session.query(Customer).filter_by(id=id)
        user = db_session.query(User).filter_by(email = email).first()
        return db_session.query(Customer).filter_by(user_id = user.id)
    return None

@app.route("/api/voting", methods=["GET", "POST"])
def get_vote():
    if request.method == "GET":
        id = request.args.get("id")
        stmt = select(Vote).where(Vote.application_id == id)
        res = db_session.execute(stmt).all()
        db_session.commit()

        voteRes = utils.parse_output(res)
        like, dislike = 0, 0
        for vote in voteRes:
            if (vote["status"] == "like"): like += 1
            else: dislike += 1
        return make_response({"like": like, "dislike": dislike}, 200)

    elif request.method == "POST":
        pass