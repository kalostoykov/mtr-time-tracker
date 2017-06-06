#!/bin/sh
python3 rest/manage.py migrate --settings=rest.env.local >> /dev/stdout
python3 rest/manage.py runserver 0:8000 --settings=rest.env.local >> /dev/stdout
