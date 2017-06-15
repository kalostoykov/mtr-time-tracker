import multiprocessing
import os

# Some global variables
HOMEDIR = os.path.expanduser("~")
CONFDIR = os.path.join(HOMEDIR, 'code/rest')

# os.environ['DJANGO_SETTINGS_MODULE'] = 'webapp.settings'

# timeouts
timeout = 120
graceful_timeout = 120

# Bind address
bind = "0.0.0.0:8000"

# Python path
pythonpath = os.path.join(HOMEDIR, 'rest')

# Number of workers
workers = multiprocessing.cpu_count() * 2 + 1

# Daemon settings
daemon = False

# Reload APP
reload = True
