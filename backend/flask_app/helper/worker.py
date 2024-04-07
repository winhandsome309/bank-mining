import pickle
import numpy as np
import pandas as pd
import joblib
from flask_app.helper import utils

MODEL_PKL = {
    "logistic_regression_(feature_selected)": 'analysis/loan_app/workspace/logistic_regression_(feature_selected).pkl',
    "logistic_regression_(improved)": "analysis/loan_app/workspace/logistic_regression_(improved).pkl",
    "random_forest_(improved)": "analysis/loan_app/workspace/random_forest_(improved).pkl"
}

MODEL_INFO = "analysis/loan_app/workspace/model_info.json"
LOAN_SCALER = "analysis/loan_app/workspace/loan_scaler.gz"

class AppWorker():
   pass

class LoanWorker(AppWorker):
   model_pkl_path: dict
   model_info_path: str
   models: dict
   scaler: object

   def __init__(self, model_pkl_path: dict, model_info_path: str, scaler_path: str) -> None:
      self.model_path = model_pkl_path
      self.model_info_path = model_info_path
      self.models = {}

      for name, path in model_pkl_path.items():
         with open(path, 'rb') as f:
            try:
               clf = pickle.load(f)
               self.models[name] = clf
               print(f">> INFO: Load sklearn model - {name} successfully")
            except Exception as e:
               print(f">> WARNING: Failed to load model - {name} in {path} \n {e}")
      self.scaler = joblib.load(scaler_path)

   def get_model_info(self) -> dict:
      return utils.load_from_json(self.model_info_path)
 
   def transform(self, test: dict) -> pd.DataFrame:
      def log_transform(data, to_log):
         X = data.copy()
         for item in to_log:
            # Add 1 to the data to prevent infinity values
            X[item] = np.log(1+X[item])
         return X
      
      # Reorder cols of data
      X_test = pd.DataFrame(test, index=[0])
      cols = ['credit_policy', 'purpose', 'int_rate', 'installment', 'log_annual_inc', 'dti', 'fico', 'days_with_cr_line', 'revol_bal', 'revol_util', 'inq_last_6mths', 'delinq_2yrs', 'pub_rec']
      for c in X_test.columns:
         if c not in cols:
            X_test.drop([c], axis=1)

      cols_types = {
         'credit_policy': 'int64',
         'days_with_cr_line': 'float64',
         'delinq_2yrs': 'int64',
         'dti': 'float64',
         'fico': 'int64',
         'inq_last_6mths': 'int64',
         'installment': 'float64',
         'int_rate': 'float64',
         'log_annual_inc': 'float64',
         'pub_rec': 'int64',
         'purpose': 'object',
         'revol_bal': 'int64',
         'revol_util': 'float64'
      }
      X_test = X_test.astype(cols_types)
      X_test = X_test[cols]
      # create_dummies
      all_purpose = ['all_other', 'credit_card', 'debt_consolidation', 'educational', 'home_improvement', 'major_purchase', 'small_business']
      for purpose in all_purpose:
         X_test[f'purpose_{purpose}'] = X_test['purpose'].apply(lambda x: True if x == purpose else False)

      X_test_e = X_test.drop(['purpose'], axis=1)
      X_test_e = X_test_e.drop(['purpose_all_other'], axis=1)

      to_log = ['credit_policy', 'int_rate', 'installment', 'dti', 'fico', 'days_with_cr_line', 'revol_bal', 'revol_util', 'inq_last_6mths', 'delinq_2yrs', 'pub_rec']
      X_test_e_l = log_transform(X_test_e, to_log)
      tmp_test = self.scaler.transform(X_test_e_l)
      X_test_e_l_n = pd.DataFrame(data=tmp_test, index=X_test_e.index, columns=X_test_e.columns)

      return X_test_e_l_n

   def predict(self, test_df: dict) -> dict:
      result = dict()
      data_transformed = self.transform(test_df)
      for name, model in self.models.items():
         # Reorder features to fit model
         mask = model.feature_names_in_.tolist()
         ordered_data = data_transformed[mask]
         result[name] = model.predict(ordered_data).tolist()[0]
      return result

if __name__ == '__main__':
   worker = LoanWorker(MODEL_PKL, MODEL_INFO, LOAN_SCALER)
   #credit.policy,purpose,int.rate,installment,log.annual.inc,dti,fico,days.with.cr.line,revol.bal,revol.util,inq.last.6mths,delinq.2yrs,pub.rec,not.fully.paid
   # 1,credit_card,0.1122,164.23,10.30895266,18.64,702,5190,15840,47.1,0,0,0,0
   cols = ['credit_policy', 'purpose', 'int_rate', 'installment', 'log_annual_inc', 'dti', 'fico', 'days_with_cr_line', 'revol_bal', 'revol_util', 'inq_last_6mths', 'delinq_2yrs', 'pub_rec']
   test_1 = [1,"debt_consolidation",0.1122,507.46,10.59663473,13.5,712,5368.958333,6513,34.3,3,0,1]
   # worker.
   test = {
        "id": "b2532f84ba5c7dc72dc968d5e039919e9da690c9bd6b145ddcc5d5f2263f49f8",
         "created": "Sat, 06 Apr 2024 01:19:39 GMT",
         "credit_policy": 1,
         "days_with_cr_line": 5368.958333,
         "delinq_2yrs": 0,
         "dti": 13.5,
         "fico": 712,
         "inq_last_6mths": 3,
         "installment": 507.46,
         "int_rate": 0.1122,
         "log_annual_inc": 10.59663473,
         "pub_rec": 1,
         "purpose": "debt_consolidation",
         "revol_bal": 6513,
         "revol_util": 34.3,
      }


   print(worker.predict(test))

   

