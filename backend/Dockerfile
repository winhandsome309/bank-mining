FROM python:3.11-slim
WORKDIR /opt/services/flask-hsbanking
COPY requirements.txt requirements.txt
ENV TZ="Asia/Ho_Chi_Minh"
RUN date
RUN python3 --version
RUN pip3 --version
RUN pip3 install -r requirements.txt

COPY ./flask_app flask_app
COPY ./flask_run.py flask_run.py
COPY ./build html
COPY ./analysis analysis
COPY ./gunicorn_starter.sh ./start.sh
RUN chmod +x start.sh
EXPOSE 8000
ENTRYPOINT ["./start.sh"]