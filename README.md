# HS Banking

## Application of Data Minining in Banking

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

HS Banking is a web platform for admin in banking which is used for predicting loan application.

Techstack:

- Frontend: ReactJS
- Backend: Python (Flask)
- Database: PostgreSQL
- Visualize: Metabase (docker image: https://hub.docker.com/r/metabase/metabase-enterprise)

## Set up database:

Download **DBeaver** application

## Installation:

Backend is located at **localhost:5000**. To run Backend server:
*Setup*

`Set these value to .env file`

```
FLASK_ENV='development'
FLASK_APP='backend/routes.py'
DEBUG='True'
FLASK_DEBUG=1

SQLALCHEMY_DATABASE_URI=''
POSTGRE_HOST = "dpg-co4o7bcf7o1s738upj3g-a.singapore-postgres.render.com"
POSTGRE_USER = "banking_db_4ebh_user"
POSTGRE_PASSWORD = "h8cggpsHBl0E6KRdCuOxNnuL7OkX4BgV"
POSTGRE_DB = "banking_db_4ebh"

METABASE_SITE_URL = "http://localhost:3002"
METABASE_SECRET_KEY = "6d5bc8d158ffd9cd13c4cc4c503ce582f92eb7aa6b62ed08034c8f4b97b0b884"
```

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

To run web project (at root):

```
npm start
```
