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

### Docker Image
Docker image available at: https://hub.docker.com/r/thanhdxuan/hsbanking.com

### Using Docker Compose

- Download [Docker Compose File](./docker-compose.yml) and (database folder)[./db] to a directory.
- `docker compose up`


**NOTE:**
  - Admin Account: email `admin@banking.com` - password: `admin`
  - Metabase config for data visualization:
    - Create a dashboard for each function - [Instructions](https://www.metabase.com/docs/latest/dashboards/introduction#how-to-create-a-dashboard)
    - Publish the dashboard - [Instructions](https://www.metabase.com/learn/customer-facing-analytics/embedding-charts-and-dashboards)
  - Collects the dashboard id and changes it in [Docker Compose File](./docker-compose.yml)

