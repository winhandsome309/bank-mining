from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase
from contextlib import contextmanager
import os

DB_URI = os.environ.get('SQLALCHEMY_DATABASE_URI_LOCAL', 'postgresql://bankadmin:admin@127.0.0.1:5434/banking')
DATA_URL='/home'
engine = create_engine(DB_URI)
db_session = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))

Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import flask_app.models as md
    print(f">> INFO: Initializing database ...")
    Base.metadata.create_all(engine, Base.metadata.tables.values(), checkfirst=True)

    stmt1 = select(md.Feature)
    stmt2 = select(md.HistoryApps)
    stmt3 = select(md.HistoryCreditCardTransaction)
    stmt4 = select(md.HistoryMarketingClients)

    if not db_session.execute(stmt1).first():
        f1 = md.Feature(name='loan')
        f3 = md.Feature(name='marketing')
        f2 = md.Feature(name='credit_card')
        db_session.add(f1)
        db_session.add(f2)
        db_session.add(f3)
        db_session.commit()

    if not db_session.execute(stmt2).first():
        print("Adding history loan data ... ")
        loan_data_dir = os.path.join(DATA_URL, 'loan_data.csv')
        stmt = text(f"""
            COPY history_loan_data
            (credit_policy, purpose, int_rate, installment, log_annual_inc, dti, fico, days_with_cr_line, revol_bal, revol_util, inq_last_6mths, delinq_2yrs, pub_rec, not_fully_paid)
            FROM '{loan_data_dir}' DELIMITER ',' CSV HEADER;
            COMMIT;
            """)
        db_session.execute(stmt)
        db_session.commit()

    if not db_session.execute(stmt3).first():
        credit_data_dir = os.path.join(DATA_URL, 'card_transdata.csv')
        print("Adding history credit data ... ")
        stmt = text(f"""
            COPY history_credit_card_transaction(distance_from_home,distance_from_last_transaction,ratio_to_median_purchase_price,repeat_retailer,used_chip,used_pin_number,online_order,fraud)
            FROM '{credit_data_dir}' DELIMITER ',' CSV HEADER;
            COMMIT;
            """)
        db_session.execute(stmt)
        db_session.commit()

    if not db_session.execute(stmt4).first():
        mark_data_dir = os.path.join(DATA_URL, 'bank.csv')
        print("Adding history marketing data ... ")
        stmt = text(f"""
            COPY history_marketing_clients(age,job,marital,education,"default",balance,housing,loan,contact,"day","month",duration,campaign,pdays,previous,poutcome,deposit)
            FROM '{mark_data_dir}' DELIMITER ',' CSV HEADER;
            COMMIT;
            """)
        db_session.execute(stmt)
        db_session.commit()
    db_session.close()