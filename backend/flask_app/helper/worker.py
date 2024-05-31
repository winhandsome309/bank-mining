import pickle
import numpy as np
import pandas as pd
import joblib
import json
from flask_app.helper import utils
# import utils
from typing import NamedTuple
from sqlalchemy import select, null, update, delete
from flask_app import models
import os
from flask_app import app

ANALYSIS_DIR = os.environ.get('ANALYSIS_DIR_LOCAL', 'analysis')

class FeatureName():
   Loan_Application        = 'Loan Application'
   Marketing_Application   = 'Marketing Campaign'
   Credit_Application      = 'Credit Fraud Detection'

class ModelInfo(NamedTuple):
   feature:       FeatureName

   FEATURE_NAME_TO_MODEL_PATH = {
      FeatureName.Loan_Application : {
         "logistic_regression_(feature_selected)": f'{ANALYSIS_DIR}/loan_app/workspace/logistic_regression_(feature_selected).pkl',
         "logistic_regression_(improved)": f"{ANALYSIS_DIR}/loan_app/workspace/logistic_regression_(improved).pkl",
         "random_forest_(improved)": f"{ANALYSIS_DIR}/loan_app/workspace/random_forest_(improved).pkl"
      },
      FeatureName.Marketing_Application : {
         "gaussiannb": f"{ANALYSIS_DIR}/marketing/gaussiannb.pkl",
         "gradientboostingclassifier": f"{ANALYSIS_DIR}/marketing/gradientboostingclassifier.pkl",
         "mlpclassifier": f"{ANALYSIS_DIR}/marketing/mlpclassifier.pkl",
         "votingclassifier": f"{ANALYSIS_DIR}/marketing/votingclassifier.pkl"
      },
      FeatureName.Credit_Application: {
         "decisiontreeclassifier": f"{ANALYSIS_DIR}/credit_card/decisiontreeclassifier.pkl",
         "kneighborsclassifier": f"{ANALYSIS_DIR}/credit_card/kneighborsclassifier.pkl",
         "randomforestclassifier": f"{ANALYSIS_DIR}/credit_card/randomforestclassifier.pkl" 
      }
   }

   FEATURE_NAME_TO_MODEL_INFO_PATH = {
      FeatureName.Loan_Application : f"{ANALYSIS_DIR}/loan_app/workspace/model_info.json",
      FeatureName.Marketing_Application: f"{ANALYSIS_DIR}/marketing/model_info.json",
      FeatureName.Credit_Application: f"{ANALYSIS_DIR}/credit_card/model_info.json"
   }

   FEATURE_NAME_TO_SCALER_PATH = {
      FeatureName.Loan_Application : f"{ANALYSIS_DIR}/loan_app/workspace/loan_scaler.gz",
      FeatureName.Marketing_Application: "",
      FeatureName.Credit_Application: f"{ANALYSIS_DIR}/credit_card/credit_scaler.gz"
   }

   FEATURE_NAME_TO_MAPPING_PATH = {
      FeatureName.Loan_Application : "",
      FeatureName.Marketing_Application: f"{ANALYSIS_DIR}/marketing/mapping_categorical_vars.json",
      FeatureName.Credit_Application: ""
   }

   # Test columns with right order and its type
   FEATURE_NAME_TO_TEST_COLUMNS = {
      FeatureName.Loan_Application : {
         'credit_policy':        'int64',
         'days_with_cr_line':    'float64',
         'delinq_2yrs':          'int64',
         'dti':                  'float64',
         'fico':                 'int64',
         'inq_last_6mths':       'int64',
         'installment':          'float64',
         'int_rate':             'float64',
         'log_annual_inc':       'float64',
         'pub_rec':              'int64',
         'purpose':              'object',
         'revol_bal':            'int64',
         'revol_util':           'float64'
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
      FeatureName.Credit_Application: {
         'distance_from_home':               'float64',
         'distance_from_last_transaction':   'float64',
         'ratio_to_median_purchase_price':   'float64',
         'repeat_retailer':                  'float64',
         'used_chip':                        'float64',
         'used_pin_number':                  'float64',
         'online_order':                     'float64',
      }
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
               app.logger.info(f"Load {name} successfully")
            except Exception as e:
               app.logger.warning(f">> {self.__class__.__name__} Failed to load - {name} in {path} \n {e}")

   def get_model_info(self) -> dict:
      return utils.load_from_json(self.model_info.get_model_info_path())
   
   def load_model_info(self, db_session: object, feature):
      model_info_json = self.get_model_info()
      try:
         for model_info in model_info_json:
            new_model = models.ModelInfo(
               model=model_info.get('Model'),
               accuracy=model_info.get('Accuracy'),
               precision=model_info.get('Precision'),
               recall=model_info.get('Recall'),
               f1_score=model_info.get('F1_Score'),
               auc=model_info.get('AUC'),
               feature=feature
            )

            stmt = select(models.ModelInfo).where(models.ModelInfo.model == new_model.model and models.ModelInfo.feature == new_model.feature)
            model_info_in_db = db_session.execute(stmt).all()
            db_session.commit()
            if model_info_in_db:
               stmt = (
                     update(models.ModelInfo)
                     .where(models.ModelInfo.model == new_model.model)
                     .where(models.ModelInfo.feature == new_model.feature)
                     .values(new_model.as_dict())
               )
               db_session.execute(stmt)
               db_session.commit()
            else:
               db_session.add(new_model)
               db_session.commit()
            db_session.close()
      except Exception as e:
         print(f">> ERROR: {e}")

   def transform(self, test: dict) -> pd.DataFrame:
      pass

   def predict(self, test_df: dict) -> dict:
      result = dict()
      data_transformed = self.transform(test_df)
      for name, model in self.models.items():
         # Reorder features to fit model
         if hasattr(model, 'feature_names_in_'):
            mask = model.feature_names_in_.tolist()
            ordered_data = data_transformed[mask]
            result[name] = model.predict(ordered_data).tolist()[0]
         else:
            result[name] = model.predict(data_transformed).tolist()[0]
      return result

class LoanWorker(AppWorker):

   def __init__(self, model_info: ModelInfo):

      super().__init__(model_info)
      try:
         path = model_info.get_scaler_path()
         self.scaler = joblib.load(path)
         app.logger.info(f"LOAN: Load scaler successfully")
      except:
         app.logger.warning(f"LOAN: Failed to load scaler in {path}")
 
   def load_model_info(self, db_session: object):
      return super().load_model_info(db_session, feature='loan')

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
            X_test = X_test.drop([c], axis=1)

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

   def load_model_info(self, db_session: object):
      return super().load_model_info(db_session, feature='marketing')
   
   def transform(self, test: dict) -> pd.DataFrame:      
      right_order_colums_with_types = self.model_info.get_test_columns()
      for var_name in self.categorical_to_number.keys():
         categorical_var = test[var_name]
         try:
            test[var_name] = self.categorical_to_number[var_name][categorical_var]
         except Exception as e:
            print(f"{var_name} - {self.categorical_to_number[var_name]}")

      X_test = pd.DataFrame(test, [0])
      for column in X_test.columns:
         if column not in right_order_colums_with_types.keys():
            X_test = X_test.drop([column], axis=1)
      
      X_test = X_test.astype(right_order_colums_with_types)

      # Rearrange columns order
      X_test = X_test[right_order_colums_with_types.keys()]

      return X_test

class CreditCardWorker(AppWorker):
   def __init__(self, model_info: ModelInfo):
      super().__init__(model_info)

      try:
         path = model_info.get_scaler_path()
         self.scaler = joblib.load(path)
         app.logger.info(f"CREDIT: Load scaler successfully")
      except:
         app.logger.warning(f"CREDIT: Failed to load scaler in {path}")

   def load_model_info(self, db_session: object):
      return super().load_model_info(db_session, feature='credit_card')
   
   def transform(self, test: dict) -> pd.DataFrame:
      right_order_colums_with_types = self.model_info.get_test_columns()

      X_test = pd.DataFrame(test, [0])

      for column in X_test.columns:
         if column not in right_order_colums_with_types.keys():
            X_test = X_test.drop([column], axis=1)

      print(X_test)
      X_test = X_test.astype(right_order_colums_with_types)

      X_test = np.array(X_test)
      X_test = self.scaler.transform(X_test) 

      return X_test