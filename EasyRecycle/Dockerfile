# pull official base image
# https://hub.docker.com/_/python
FROM python:3.7-buster

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# set work directory
WORKDIR /app

COPY ./requirements.txt .
COPY ./requirements.prod.txt .

# install dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt && \
    pip install -r requirements.prod.txt

# copy project
COPY . .

# collect static files
RUN python manage.py collectstatic --noinput

# add and run as non-root user
RUN adduser -D backenduser
USER backenduser

# run gunicorn
CMD gunicorn EasyRecycle.wsgi:application --bind 0.0.0.0:$PORT --timeout=300
