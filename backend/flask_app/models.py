import datetime
from typing_extensions import Annotated
from sqlalchemy import ForeignKey
from sqlalchemy import func
from sqlalchemy.orm import mapped_column, Mapped, relationship, backref
from sqlalchemy.sql import expression
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import DateTime
from sqlalchemy import Boolean, DateTime, Column, Integer, \
                    String, ForeignKey
from flask_security import UserMixin, RoleMixin, AsaList
from flask_app.database import Base

class utcnow(expression.FunctionElement):
    type = DateTime()
    inherit_cache = True

@compiles(utcnow, 'postgresql')
def pg_utcnow(element, compiler, **kw):
    return "TIMEZONE('utc', CURRENT_TIMESTAMP)"

timestamp = Annotated[
    datetime.datetime,
    mapped_column(nullable=False, server_default=utcnow())
]


class HistoryApps(Base):
    __tablename__ = 'history_loan_data'

    credit_policy:  Mapped[int] = mapped_column(primary_key=True)
    purpose:        Mapped[str]
    int_rate:       Mapped[float]
    installment:    Mapped[float]
    log_annual_inc: Mapped[float]
    dti:            Mapped[float]
    fico:           Mapped[int]
    days_with_cr_line: Mapped[float]
    revol_bal:      Mapped[int]
    revol_util:     Mapped[float]
    inq_last_6mths: Mapped[int]
    delinq_2yrs:    Mapped[int]
    pub_rec:        Mapped[int]
    not_fully_paid: Mapped[int]
    
    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class ClientID(Base):
    __tablename__ = 'clientid'

    id: Mapped[str] = mapped_column(primary_key=True)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class Application(Base):
    __tablename__ = 'loan_application'

    id:             Mapped[str] = mapped_column(ForeignKey("clientid.id"), primary_key=True)
    credit_policy:  Mapped[int] = mapped_column(nullable=True)
    purpose:        Mapped[str] = mapped_column(nullable=True)
    int_rate:       Mapped[float] = mapped_column(nullable=True)
    installment:    Mapped[float] = mapped_column(nullable=True)
    log_annual_inc: Mapped[float] = mapped_column(nullable=True)
    dti:            Mapped[float] = mapped_column(nullable=True)
    fico:           Mapped[int] = mapped_column(nullable=True)
    days_with_cr_line: Mapped[float] = mapped_column(nullable=True)
    revol_bal:      Mapped[int] = mapped_column(nullable=True)
    revol_util:     Mapped[float] = mapped_column(nullable=True)
    inq_last_6mths: Mapped[int] = mapped_column(nullable=True)
    delinq_2yrs:    Mapped[int] = mapped_column(nullable=True)
    pub_rec:        Mapped[int] = mapped_column(nullable=True)
    created:        Mapped[timestamp]
    processed:      Mapped[bool]
    processed_at:   Mapped[timestamp] = mapped_column(nullable=True, server_default=None)
    process_result: Mapped[bool] = mapped_column(nullable=True)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class HistoryMarketingClients(Base):
    __tablename__ = 'history_marketing_clients'
    
    age: Mapped[int]        = mapped_column(nullable=True, primary_key=True)
    job: Mapped[str]        = mapped_column(nullable=True)
    marital: Mapped[str]    = mapped_column(nullable=True)
    education: Mapped[str]  = mapped_column(nullable=True)
    default: Mapped[str]    = mapped_column(nullable=True)
    balance: Mapped[int]    = mapped_column(nullable=True)
    housing: Mapped[str]    = mapped_column(nullable=True)
    loan: Mapped[str]       = mapped_column(nullable=True)
    contact: Mapped[str]    = mapped_column(nullable=True)
    day: Mapped[int]        = mapped_column(nullable=True)
    month: Mapped[str]      = mapped_column(nullable=True)
    duration: Mapped[int]   = mapped_column(nullable=True)
    campaign: Mapped[int]   = mapped_column(nullable=True)
    pdays: Mapped[int]      = mapped_column(nullable=True)
    previous: Mapped[int]   = mapped_column(nullable=True)
    poutcome: Mapped[str]   = mapped_column(nullable=True)
    deposit: Mapped[str]    = mapped_column(nullable=True)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class MarketingClient(Base):
    __tablename__ = 'marketing_client'

    id: Mapped[str]         = mapped_column(ForeignKey("clientid.id"), primary_key=True)
    age: Mapped[int]        = mapped_column(nullable=True)
    job: Mapped[str]        = mapped_column(nullable=True)
    marital: Mapped[str]    = mapped_column(nullable=True)
    education: Mapped[str]  = mapped_column(nullable=True)
    default: Mapped[str]    = mapped_column(nullable=True)
    balance: Mapped[int]    = mapped_column(nullable=True)
    housing: Mapped[str]    = mapped_column(nullable=True)
    loan: Mapped[str]       = mapped_column(nullable=True)
    contact: Mapped[str]    = mapped_column(nullable=True)
    day: Mapped[int]        = mapped_column(nullable=True)
    month: Mapped[str]      = mapped_column(nullable=True)
    duration: Mapped[int]   = mapped_column(nullable=True)
    campaign: Mapped[int]   = mapped_column(nullable=True)
    pdays: Mapped[int]      = mapped_column(nullable=True)
    previous: Mapped[int]   = mapped_column(nullable=True)
    poutcome: Mapped[str]   = mapped_column(nullable=True)
    created: Mapped[timestamp]

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class HistoryCreditCardTransaction(Base):
    __tablename__ = 'history_credit_card_transaction'

    # id: Mapped[int]                                 = mapped_column(autoincrement=True, primary_key=True) #Drop after initialation
    distance_from_home: Mapped[float]               = mapped_column(nullable=True, primary_key=True)
    distance_from_last_transaction: Mapped[float]   = mapped_column(nullable=True)
    ratio_to_median_purchase_price: Mapped[float]   = mapped_column(nullable=True)
    repeat_retailer: Mapped[float]                   = mapped_column(nullable=True)
    used_chip: Mapped[float]                         = mapped_column(nullable=True)
    used_pin_number: Mapped[float]                   = mapped_column(nullable=True)
    online_order: Mapped[float]                      = mapped_column(nullable=True)
    fraud: Mapped[float]                             = mapped_column(nullable=True)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class CreditCardTransaction(Base):
    __tablename__ = 'credit_card_transaction'
    
    id: Mapped[str]                                 = mapped_column(ForeignKey("clientid.id"), primary_key=True)
    distance_from_home: Mapped[float]               = mapped_column(nullable=True)
    distance_from_last_transaction: Mapped[float]   = mapped_column(nullable=True)
    ratio_to_median_purchase_price: Mapped[float]   = mapped_column(nullable=True)
    repeat_retailer: Mapped[float]                   = mapped_column(nullable=True)
    used_chip: Mapped[float]                         = mapped_column(nullable=True)
    used_pin_number: Mapped[float]                   = mapped_column(nullable=True)
    online_order: Mapped[float]                      = mapped_column(nullable=True)
    created:        Mapped[timestamp]
    processed:      Mapped[bool]
    processed_at:   Mapped[timestamp]               = mapped_column(nullable=True, server_default=None)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class PredictResult(Base):
    __tablename__ = 'predict_result'

    id:             Mapped[str] = mapped_column(ForeignKey("clientid.id"), primary_key=True)
    predict:        Mapped[str] = mapped_column(nullable=True)
    reality:        Mapped[bool] = mapped_column(nullable=True)
    feature:        Mapped[str] = mapped_column(ForeignKey("feature.name"))
    note:           Mapped[str] = mapped_column(nullable=True)
    
    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class Feature(Base):
    __tablename__ = 'feature'
    id:             Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name:           Mapped[str] = mapped_column(unique=True)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class ModelInfo(Base):
    __tablename__ = 'model_info'

    model:          Mapped[str] = mapped_column(primary_key=True) 
    accuracy:       Mapped[float] = mapped_column(nullable=True)
    precision:      Mapped[float] = mapped_column(nullable=True)
    recall:         Mapped[float] = mapped_column(nullable=True)
    auc:            Mapped[float] = mapped_column(nullable=True)
    f1_score:       Mapped[float] = mapped_column(nullable=True)
    feature:        Mapped[str] = mapped_column(ForeignKey("feature.name"))

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
# class UserRole(Base):
#     __tablename__ = 'roles_users'
    
#     id:         Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
#     user_id:    Mapped[str] = mapped_column(ForeignKey('user.id'))
#     role_id:    Mapped[int] = mapped_column(ForeignKey('role.id'))

# class User(Base,UserMixin):
#     __tablename__ = 'user'

#     id          : Mapped[str] = mapped_column(primary_key=True)
#     email       : Mapped[str] = mapped_column(unique=True)
#     username    : Mapped[str] = mapped_column(unique=True, nullable=True)
#     password    : Mapped[str]
#     last_login_at:  Mapped[timestamp] = mapped_column(nullable=True)
#     last_login_ip:  Mapped[str] = mapped_column(nullable=True)
#     current_login_at: Mapped[timestamp] = mapped_column(nullable=True)
#     current_login_ip: Mapped[str] = mapped_column(nullable=True)
#     active      : Mapped[bool]
#     fs_uniquifier:    Mapped[str] = mapped_column(nullable=True)
#     roles       : Mapped['Role'] = relationship('Role', secondary=UserRole.__tablename__, backref=backref('users', lazy='dynamic'))

# class Role(Base, RoleMixin):
#     __tablename__ = 'role'

#     id:     Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
#     name:   Mapped[str] = mapped_column(unique=True)
#     description: Mapped[str] = mapped_column(nullable=True)
#     permissions = mapped_column(MutableList.as_mutable(AsaList()), nullable=True)

class RolesUsers(Base):
    __tablename__ = 'roles_users'

    id          = Column(Integer(), primary_key=True)
    user_id     = Column('user_id', Integer(), ForeignKey('user.id'))
    role_id     = Column('role_id', Integer(), ForeignKey('role.id'))

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class Role(Base, RoleMixin):
    __tablename__ = 'role'

    id          = Column(Integer(), primary_key=True)
    name        = Column(String(80), unique=True)
    description = Column(String(255))
    permissions = Column(MutableList.as_mutable(AsaList()), nullable=True)

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
class User(Base, UserMixin):
    __tablename__ = 'user'

    id                  = Column(Integer, primary_key=True)
    email               = Column(String(255), unique=True)
    username            = Column(String(255), unique=True, nullable=True)
    password            = Column(String(255), nullable=False)
    last_login_at       = Column(DateTime())
    current_login_at    = Column(DateTime())
    last_login_ip       = Column(String(100))
    current_login_ip    = Column(String(100))
    login_count         = Column(Integer)
    active              = Column(Boolean())
    chat_token          = Column(String(512), unique=True, nullable=True)
    fs_uniquifier       = Column(String(64), unique=True, nullable=False)
    confirmed_at        = Column(DateTime())
    current_login_ip    = Column(String(255), unique=True)
    roles               = relationship('Role', secondary='roles_users',
                                        backref=backref('users', lazy='dynamic'))

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Customer(Base):
    __tablename__ = 'customer'

    id:         Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fname:      Mapped[str]
    since:      Mapped[timestamp] = mapped_column(nullable=True)
    user_id:    Mapped[int] = mapped_column(ForeignKey('user.id', ondelete="CASCADE"))

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Staff(Base):
    __tablename__ = 'staff'

    id:         Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fname:      Mapped[str] 
    position:   Mapped[str]
    user_id:    Mapped[int] = mapped_column(ForeignKey('user.id', ondelete="CASCADE"))

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class CustomersApplications(Base):
    __tablename__ = 'customers_application'

    id:             Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    customer_id:    Mapped[int] = mapped_column(ForeignKey('customer.id', ondelete="CASCADE"))
    application_id: Mapped[str] = mapped_column(ForeignKey('loan_application.id', ondelete="CASCADE"))

    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @staticmethod
    def create(customer_id, application_id):
        return CustomersApplications(customer_id=customer_id, application_id=application_id)
     
class Vote(Base):
    __tablename__ = 'vote'

    id:             Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id:        Mapped[int] = mapped_column(ForeignKey('user.id'))
    application_id:  Mapped[str] = mapped_column(ForeignKey('loan_application.id'))
    status:         Mapped[str]
    
    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}