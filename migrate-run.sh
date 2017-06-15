#!/bin/sh
python3 rest/manage.py migrate --settings=rest.env.local
cd rest
gunicorn -c gunicornconf.py rest.wsgi:application --env DJANGO_SETTINGS_MODULE="rest.env.local"
