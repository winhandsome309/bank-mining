from hashlib import sha256
import json

def parse_output(result: list[tuple]) -> list:
   output = []
   for row in result:
      output.append(row[0].as_dict())
   return output

def get_new_applicaion_id(datetime: str)-> str:
   return sha256(datetime.encode()).hexdigest()

def load_from_json(path):
   with open(path) as f:
      return json.load(f)