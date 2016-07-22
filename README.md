# Time Tracking Application #

## About ##

## Requirements ##

## Getting started ##

## Installation ##

1. vagrant up
2. vagrant ssh
3. vagrant@mtr-time-tracker:/srv/project/vmachines/vagrant$ sudo apt-get install dos2unix
4. vagrant@mtr-time-tracker:/srv/project/vmachines/vagrant$ dos2unix bootstrap.sh
5. vagrant@mtr-time-tracker:/srv/project/vmachines/vagrant$ ./bootstrap.sh all
6. exit
7. creating rest/env/local.php file
8. vagrant ssh
9. vagrant@mtr-time-tracker:/srv/project/$ pip install -r requirements.txt
10. mysql -u root -p
11. create database `mtr-time-tracker`;
12. vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py migrate --settings=rest.env.local
13. vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py createsuperuser --settings=rest.env.local
14. vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py runserver 0:8000 --settings=rest.env.local

