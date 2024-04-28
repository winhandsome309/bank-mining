import datetime
from typing_extensions import Annotated
from sqlalchemy import ForeignKey
from sqlalchemy import func
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import expression
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.types import DateTime
from sqlalchemy import DDL

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

class Base(DeclarativeBase):
    def as_dict(self): 
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

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
    
class ProcessedApps(Base):
    __tablename__ = 'processed_loan'

    id:             Mapped[str] = mapped_column(primary_key=True)
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

class ClientID(Base):
    __tablename__ = 'clientid'

    id: Mapped[str] = mapped_column(primary_key=True)

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

class MarketingOldClient(Base):
    __tablename__ = "marketing_old_client"

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

class PredictResult(Base):
    __tablename__ = 'loan_predict_result'

    id:             Mapped[str] = mapped_column(ForeignKey("clientid.id"), primary_key=True)
    predict:        Mapped[str] = mapped_column(nullable=True)
    reality:        Mapped[bool] = mapped_column(nullable=True)
    feature:        Mapped[str] = mapped_column(ForeignKey("feature.name"))
    note:           Mapped[str] = mapped_column(nullable=True)
    
class Feature(Base):
    __tablename__ = 'feature'
    id:             Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name:           Mapped[str] = mapped_column(unique=True)
class ModelInfo(Base):
    __tablename__ = 'model_info'

    model:          Mapped[str] = mapped_column(primary_key=True) 
    accuracy:       Mapped[float] = mapped_column(nullable=True)
    precision:      Mapped[float] = mapped_column(nullable=True)
    recall:         Mapped[float] = mapped_column(nullable=True)
    auc:            Mapped[float] = mapped_column(nullable=True)
    f1_score:       Mapped[float] = mapped_column(nullable=True)
    feature:        Mapped[str] = mapped_column(ForeignKey("feature.name"))

create_id_func = DDL(
    "CREATE FUNCTION trigger_function()"
    "RETURNS TRIGGER"
    "LANGUAGE PLPGSQL"
    "AS $$"
    "BEGIN"
    # Trigger logic
    "END;"
    "$$"
)

create_id = DDL(
    "CREATE TRIGGER insert_app_id"
    "BEFORE INSERT"
    "history_marketing_clients"
    "EXECUTE PROCEDURE insert_client_id"
)