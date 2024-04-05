import datetime
from typing_extensions import Annotated
from sqlalchemy import ForeignKey
from sqlalchemy import func
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import expression
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.types import DateTime

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
    pass

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
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}

class Application(Base):
    __tablename__ = 'loan_application'

    id:             Mapped[str] = mapped_column(primary_key=True)
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
    not_fully_paid: Mapped[int] = mapped_column(nullable=True)
    created:        Mapped[timestamp]
    processed:      Mapped[bool]
    processed_at:   Mapped[timestamp] = mapped_column(nullable=True, server_default=None)

    def as_dict(self): 
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}


class PredictResult(Base):
    __tablename__ = 'loan_predict_result'

    id:             Mapped[str] = mapped_column(ForeignKey("loan_application.id"), primary_key=True)
    predict:        Mapped[str]
    reality:        Mapped[bool]
    note:           Mapped[str]


