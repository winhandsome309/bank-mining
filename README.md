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

- Download [Docker Compose File](./docker-compose.yml).
- `docker compose up`
*NOTE:* 
  - Admin Account: email `admin@banking.com` - password: `admin`
  - You required to create Metabase Dashboard and change environment variables in [Docker Compose File](./docker-compose.yml)

