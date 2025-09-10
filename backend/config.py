import os

BASE_DIR = os.path.dirname(__file__)

DB_DIR = os.path.join(BASE_DIR, 'db')
DB_PATH = os.path.join(DB_DIR, 'textfsm_template.sqlite')

LOG_DIR = os.path.join(BASE_DIR, 'var', 'log')

PID_DIR = os.path.join(BASE_DIR, 'var', 'run')
PID_PATH = os.path.join(PID_DIR, 'gunicorn.pid')

os.makedirs(DB_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(PID_DIR, exist_ok=True)