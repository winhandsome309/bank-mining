from hashlib import sha1
import json
import sqlalchemy
from functools import reduce
from flask_app.models import Base

class Utils:

   @staticmethod
   def parse_output(result: sqlalchemy.engine.result.ChunkedIteratorResult) -> list:
      row_lst = list()
      for row in result:
         row = row._asdict()
         print(row)
         for key, value in row.items():
            if isinstance(value, Base):
               row_item_dict = value.as_dict()
               row.update({key: row_item_dict})
         print(row)
         row_lst.append(row)
      return row_lst

def parse_output(result: list[tuple]) -> list:
   output = []
   for row in result:
      output.append(row[0].as_dict())
   return output

def create_response_body(status_code: int, error: bool, action: str, data: list = None):

   if error:
      return {
         'meta': {
            'status_code': status_code,
            'status': f"An error occured when trying to {action}"
         },
         'error': error,
         'data': data
      }

   return {
      'meta': {
         'status_code': status_code,
      },
      'error': error,
      'data': data
   }

def get_new_applicaion_id(datetime: str)-> str:
   return sha1(datetime.encode()).hexdigest()

def load_from_json(path):
   with open(path) as f:
      return json.load(f)