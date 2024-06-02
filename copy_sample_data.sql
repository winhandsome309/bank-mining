COPY history_loan_data
(credit_policy, purpose, int_rate, installment, log_annual_inc, dti, fico, days_with_cr_line, revol_bal, revol_util, inq_last_6mths, delinq_2yrs, pub_rec, not_fully_paid) 
FROM '/home/loan_data.csv' DELIMITER ',' CSV HEADER;


COPY history_credit_card_transaction(distance_from_home,distance_from_last_transaction,ratio_to_median_purchase_price,repeat_retailer,used_chip,used_pin_number,online_order,fraud)
FROM '/home/card_transdata.csv' DELIMITER ',' CSV HEADER;

COPY history_marketing_clients("age",job,marital,education,"default",balance,housing,loan,contact,"day","month",duration,campaign,pdays,previous,poutcome,deposit)
FROM '/home/bank.csv' DELIMITER ',' CSV HEADER;