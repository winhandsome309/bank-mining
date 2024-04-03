def parse_output(result: list[tuple]) -> list:
   output = []
   for row in result:
      output.append(row[0].as_dict())
   return output