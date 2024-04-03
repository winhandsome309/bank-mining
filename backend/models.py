from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column, Mapped
from dataclasses import dataclass

class Base(DeclarativeBase):
    pass

class HistoryApps(Base):
    '''
        credit_policy integer,
        purpose varchar(50),
        int_rate real,
        installment real,
        log_annual_inc real,
        dti real,
        fico integer,
        days_with_cr_line real,
        revol_bal integer,
        revol_util real,
        inq_last_6mths integer,
        delinq_2yrs integer,
        pub_rec integer,
        not_fully_paid integer
    '''
    __tablename__ = 'history_loan_data'

    credit_policy: Mapped[int] = mapped_column(primary_key=True)
    purpose: Mapped[str]
    int_rate: Mapped[float]
    installment: Mapped[float]
    log_annual_inc: Mapped[float]
    dti: Mapped[float]
    fico: Mapped[int]
    days_with_cr_line: Mapped[float]
    revol_bal: Mapped[int]
    revol_util: Mapped[float]
    inq_last_6mths: Mapped[int]
    delinq_2yrs: Mapped[int]
    pub_rec: Mapped[int]
    not_fully_paid: Mapped[int]
    
    def as_dict(self): 
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}

class WaitingApps():
   pass