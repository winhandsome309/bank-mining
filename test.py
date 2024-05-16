# You'll need to install PyJWT via pip 'pip install PyJWT' or your project packages file

import jwt
import time

METABASE_SITE_URL = "http://localhost:3002"
METABASE_SECRET_KEY = "6d5bc8d158ffd9cd13c4cc4c503ce582f92eb7aa6b62ed08034c8f4b97b0b884"

payload = {
  "resource": {"dashboard": 46},
  "params": {
    
  },
  "exp": round(time.time()) + (60 * 10) # 10 minute expiration
}
token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")

iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true"
print(iframeUrl)