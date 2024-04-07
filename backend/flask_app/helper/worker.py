import pickle
import numpy as np
import pandas as pd
import joblib

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
            clf = pickle.load(f)
            self.models[name] = clf
            print(f">> INFO: Load Loan Model - {name} successfully\n")

      self.scaler = joblib.load(scaler_path)

   def get_model_info(self):
      pass

   def predict(self, data) -> str:
      result = dict()

      data_transformed = self.transform(data)
      for name, model in self.models.items():
         result[name] = model.predit(data_transformed)
      return result
   
   def transform(self, test):
      def log_transform(data, to_log):
         X = data.copy()
         for item in to_log:
            # Add 1 to the data to prevent infinity values
            X[item] = np.log(1+X[item])
         return X
      
      X_test = test
      # Split col by data type
      X_test_e = pd.get_dummies(data=X_test)
      # X_test_e = X_test_e.drop(['purpose_all_other'], axis=1)

      to_log = ['credit_policy', 'int_rate', 'installment', 'dti', 'fico', 'days_with_cr_line', 'revol_bal', 'revol_util', 'inq_last_6mths', 'delinq_2yrs', 'pub_rec']

      X_test_e_l = log_transform(X_test_e, to_log)
      print(X_test_e_l.head())
      tmp_test = self.scaler.transform(X_test_e_l)
      X_test_e_l_n = pd.DataFrame(data=tmp_test, index=X_test_e.index, columns=X_test_e.columns)

      return X_test_e_l_n
if __name__ == '__main__':
   worker = LoanWorker(MODEL_PKL, MODEL_INFO, LOAN_SCALER)
   #credit.policy,purpose,int.rate,installment,log.annual.inc,dti,fico,days.with.cr.line,revol.bal,revol.util,inq.last.6mths,delinq.2yrs,pub.rec,not.fully.paid
   # 1,credit_card,0.1122,164.23,10.30895266,18.64,702,5190,15840,47.1,0,0,0,0

   # worker.
   test = {
        "credit_policy": 1,
        "purpose": "credit_card",
        "int_rate": 0.075,
        "installment": 250.0,
        "log_annual_inc": 10.2,
        "dti": 16.87	,
        "fico": 720,
        "days_with_cr_line": 2500.0,
        "revol_bal": 5000,
        "revol_util": 23.0	,
        "inq_last_6mths": 2,
        "delinq_2yrs": 0,
        "pub_rec": 0,
   }

   data = pd.DataFrame(test, index=[0])
   print(data.info())
   print(worker.predict(data))

   

