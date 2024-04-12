import pickle
import numpy as np
import pandas as pd
import joblib
import json
from flask_app.helper import utils
# import utils
from typing import NamedTuple

class FeatureName():
   Loan_Application        = 'Loan Application'
   Marketing_Application   = 'Marketing Campaign'
   Credit_Application      = 'Credit Fraud Detection'

class ModelInfo(NamedTuple):
   feature:       FeatureName

   FEATURE_NAME_TO_MODEL_PATH = {
      FeatureName.Loan_Application : {
         "logistic_regression_(feature_selected)": 'analysis/loan_app/workspace/logistic_regression_(feature_selected).pkl',
         "logistic_regression_(improved)": "analysis/loan_app/workspace/logistic_regression_(improved).pkl",
         "random_forest_(improved)": "analysis/loan_app/workspace/random_forest_(improved).pkl"
      },
      FeatureName.Marketing_Application : {
         "gaussiannb": "analysis/marketing/gaussiannb.pkl",
         "gradientboostingclassifier": "analysis/marketing/gradientboostingclassifier.pkl",
         "mlpclassifier": "analysis/marketing/mlpclassifier.pkl",
         "votingclassifier": "analysis/marketing/votingclassifier.pkl"
      },
      FeatureName.Credit_Application: {
         
      }
   }

   FEATURE_NAME_TO_MODEL_INFO_PATH = {
      FeatureName.Loan_Application : "analysis/loan_app/workspace/model_info.json",
      FeatureName.Marketing_Application: "analysis/marketing/model_info.json",
      FeatureName.Credit_Application: "analysis/credit/model_info.json"
   }

   FEATURE_NAME_TO_SCALER_PATH = {
      FeatureName.Loan_Application : "analysis/loan_app/workspace/loan_scaler.gz",
      FeatureName.Marketing_Application: "",
      FeatureName.Credit_Application: ""
   }

   FEATURE_NAME_TO_MAPPING_PATH = {
      FeatureName.Loan_Application : "",
      FeatureName.Marketing_Application: "analysis/marketing/mapping_categorical_vars.json",
      FeatureName.Credit_Application: ""
   }

   FEATURE_NAME_TO_TEST_COLUMNS = {
      FeatureName.Loan_Application : {
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
      },
      FeatureName.Marketing_Application: {
         'age':         'int64',
         'job':         'int8',
         'marital':     'int8',
         'education':   'int8',
         'default':     'int8',
         'balance':     'int64',
         'housing':     'int8',
         'loan':        'int8',
         'contact':     'int8',
         'day':         'int64',
         'month':       'int8',
         'duration':    'int64',
         'campaign':    'int64',
         'pdays':       'int64',
         'previous':    'int64',
         'poutcome':    'int8'
      },
      FeatureName.Credit_Application: ""
   }

   @staticmethod
   def create(feature_name):
      return ModelInfo(feature=feature_name)
   
   def get_model_path(self):
      return self.FEATURE_NAME_TO_MODEL_PATH.get(self.feature, {})

   def get_scaler_path(self):
      return self.FEATURE_NAME_TO_SCALER_PATH.get(self.feature, {})

   def get_model_info_path(self):
      return self.FEATURE_NAME_TO_MODEL_INFO_PATH.get(self.feature, {})
   
   def get_mapping_vars_path(self):
      return self.FEATURE_NAME_TO_MAPPING_PATH.get(self.feature, {})

   def get_test_columns(self):
      return self.FEATURE_NAME_TO_TEST_COLUMNS.get(self.feature, {})

class AppWorker():
   model_info: ModelInfo

   def __init__(self, model_info: ModelInfo):
      self.model_info = model_info
      self.models = {}
      for name, path in model_info.get_model_path().items():
         with open(path, 'rb') as f:
            try:
               clf = pickle.load(f)
               self.models[name] = clf
               print(f">> INFO: Load sklearn model - {name} successfully")
            except Exception as e:
               print(f">> WARNING: Failed to load model - {name} in {path} \n {e}")

   def get_model_info(self) -> dict:
      return utils.load_from_json(self.model_info.get_model_info_path())
   
   def transform(self, test):
      pass

   def predict(self, test_df: dict) -> dict:
      result = dict()
      data_transformed = self.transform(test_df)
      for name, model in self.models.items():
         # Reorder features to fit model
         mask = model.feature_names_in_.tolist()
         ordered_data = data_transformed[mask]
         result[name] = model.predict(ordered_data).tolist()[0]
      return result

class LoanWorker(AppWorker):

   def __init__(self, model_info: ModelInfo):

      super().__init__(model_info)
      try:
         path = model_info.get_scaler_path()
         self.scaler = joblib.load(path)
         print(f">> INFO: Load scaler successfully")
      except:
         print(f">> WARNING: Failed to load scaler in {path}")
 
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

      cols_types = self.model_info.get_test_columns()
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

class MarketingWorker(AppWorker):
   categorical_to_number: dict

   def __init__(self, model_info: ModelInfo):
      mapping_path = model_info.get_mapping_vars_path()
      with open(mapping_path, 'r') as f:
         self.categorical_to_number = json.load(f)

      super().__init__(model_info)

   def transform(self, test: dict):      
      c = self.model_info.get_test_columns()
      for var_name in self.categorical_to_number.keys():
         categorical_var = test[var_name]
         try:
            test[var_name] = self.categorical_to_number[var_name][categorical_var]
         except Exception as e:
            print(f"{var_name} - {self.categorical_to_number[var_name]}")

      X_test = pd.DataFrame(test, [0])
      for cols in X_test.columns:
         if cols not in c.keys():
            X_test.drop([cols], axis=1)
      
      X_test = X_test.astype(c)
      X_test = X_test[c.keys()]

      return X_test

class TestData():
   loan = [{
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
   }]
    
   marketing = [
      {
         'age': 59,
         'job': 'admin.',
         'marital': 'married',
         'education': 'secondary',
         'default': 'no',
         'balance': 2343,
         'housing': 'yes',
         'loan': 'no',
         'contact': 'unknown',
         'day': 5,
         'month': 'may',
         'duration': 1042,
         'campaign': 1,
         'pdays': -1,
         'previous': 0,
         'poutcome': 'unknown',
         'deposit': 'yes'
      },
      {
         'age': 56,
         'job': 'admin.',
         'marital': 'married',
         'education': 'secondary',
         'default': 'no',
         'balance': 45,
         'housing': 'no',
         'loan': 'no',
         'contact': 'unknown',
         'day': 5,
         'month': 'may',
         'duration': 1467,
         'campaign': 1,
         'pdays': -1,
         'previous': 0,
         'poutcome': 'unknown',
         'deposit': 'no'
      },
      {
         'age': 19,
         'job': 'technician',
         'marital': 'married',
         'education': 'secondary',
         'default': 'no',
         'balance': 1000,
         'housing': 'yes',
         'loan': 'no',
         'contact': 'unknown',
         'day': 1,
         'month': 'may',
         'duration': 139,
         'campaign': 1,
         'pdays': -1,
         'previous': 0,
         'poutcome': 'unknown',
         'deposit': 'yes'
      }
   ]
if __name__ == '__main__':
   model_info = ModelInfo.create('Marketing Campaign')
   worker = MarketingWorker(model_info)
   test_data = TestData()
   for idx, test in enumerate(test_data.marketing):
      print(f">> RESULT #{idx + 1}: ")
      print(worker.predict(test))
