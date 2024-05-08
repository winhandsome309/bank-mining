from flask_app import app
import logging

if __name__ == '__main__':
   app.run()

# Logging in Gunicorn server
if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)