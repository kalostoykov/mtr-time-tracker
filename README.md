# Time Tracking Application #

## About ##

## Requirements ##

## Getting started ##

## Installation ##

1. You need to let Vagrant to create and configure the guest machine according to Vagrant file.
This is done by running the following command.

```
vagrant up
```

2. Now you need to SSH into the running Vagrant guest machine.

```
vagrant ssh
```

3. After loggin into the guest machine you must install the dos2unix text file format converter
**Note:** If you are using unix like operating system you can skip this step. 

```
vagrant@mtr-time-tracker:~$ sudo apt-get install dos2unix
```

4. Now you should navigate to the /srv/project/vmachines/vagrant folder where the bootstrap.sh file is located and run the doc2unix command. 

```
vagrant@mtr-time-tracker:~$ cd /srv/project/vmachines/vagrant
vagrant@mtr-time-tracker:/srv/project/vmachines/vagrant$ dos2unix bootstrap.sh
```

5. The next step is to execute the bootstrap.sh script to configure everything on the new machine 

```
vagrant@mtr-time-tracker:/srv/project/vmachines/vagrant$ ./bootstrap.sh all
```

6. Now exit from the guest machine by using the exit command:

```
vagrant@mtr-time-tracker:/srv/project/vmachines/vagrant$ exit
```

8. The next this you should to do is navigating to the env folder in the repository and creating local.py file.

```
cd rest/rest/env
```

Before writing your local setting in the local.py file you should first import the settings from the settings.py file.
This can be done by adding this line of code to the local.py file.

```
from ..settings import *
```

9. The default database engine is sqlite3, but because we want to use the mysql database engine we must override the database settings.
Put this lines of code in the local.py file.

```
DATABASES = {    
	'default': {        
		'ENGINE': 'django.db.backends.mysql',
		'NAME': 'mtr-time-tracker',
		'USER': 'root',
		'PASSWORD': 'parola',
		'HOST': '',
		'PORT': '',
	} 
}
```

10. Now let's SHH to the vagrant machine again and navigate to the /srv/project folder.

```
vagrant ssh
vagrant@mtr-time-tracker:~/$ cd /srv/project
```

11. You need to install the Python packages that are listed in the the requirements.txt file.

```
vagrant@mtr-time-tracker:/srv/project/$ pip install -r requirements.txt
```

11. Next you want to create your mysql database. To do that you must do the following things:
First login to the mysql command-line client 

```
vagrant@mtr-time-tracker:/srv/project/$ mysql -u root -p
```

Then create the database with name mtr-time-tracker.

```
mysql > create database `mtr-time-tracker`;
```

Then you can exit the mysql client by executing the exit command.

```
mysql > exit;
```

12. then navigate to the /srv/project/rest/rest folder 

```
vagrant@mtr-time-tracker:~/$ cd /srv/project/rest
```

13. Now you want to tell Django to use our local settings instead of the default ones in the settings.py file.
To do this you must migrate to the local settings.

```
vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py migrate --settings=rest.env.local
```

14. The next step is to create a super user by executing:

```
vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py createsuperuser --settings=rest.env.local
```

15. Now you can run the Django server:

```
vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py runserver 0:8000 --settings=rest.env.local
```

You should get responce like this:

```
Performing system checks...

System check identified no issues (0 silenced).
May 23, 2017 - 13:07:46
Django version 1.9.8, using settings 'rest.env.local'
Starting development server at http://0:8000/
Quit the server with CONTROL-C.
```

Now the server is running.

16. Leave the server running and open new tab logging into vagrant again.
You need to download the npm and bower packages.
To do that you must navigate to the webapp folder and run the following commands:

```
vagrant@mtr-time-tracker:~$ cd /srv/project/webapp/
vagrant@mtr-time-tracker:/srv/project/webapp$ npm install
vagrant@mtr-time-tracker:/srv/project/webapp$ bower install
```

17. In order to generate typescript definitions run tsd install from `webapp` folder
```
vagrant@mtr-time-tracker:/srv/project/webapp$ ./node_modules/tsd/build/cli.js install
```

18. Now compile the typescript files by running:

```
vagrant@mtr-time-tracker:/srv/project/webapp$ ./node_modules/typescript/bin/tsc
```

**Note:** This will compile the project files just one time. If you are going to develop use `-w` flag so that project's files are watch for changes and compiled on the fly.

19. To run everything now you need to start the Django server and the webpack server.
To do that you can use two terminals and SSH to the Vagrant machine. The first terminal will run the Django server and the second one will run the webpack server.

**Note:** If you watch for typescript changes you will need 3 terminals for - server and client serving and client file changes

1. Command to run in the first terminal(If you left the terminal at step 15 open skip this step):

```
vagrant ssh
vagrant@mtr-time-tracker:~$ cd /srv/project/rest
vagrant@mtr-time-tracker:/srv/project/rest$ python manage.py runserver 0:8000 --settings=rest.env.local
```

2. Command to run in the second terminal:

```
vagrant ssh
vagrant@mtr-time-tracker:~$ cd /srv/project/webapp
vagrant@mtr-time-tracker:/srv/project/webapp$ npm start
```

