import os
import sys
import multiprocessing

# 作为守护进程启动
daemon = True
pidfile = "/var/run/gunicorn.pid"
# 工作模式
worker_class = "uvicorn.workers.UvicornWorker"
# 并行工作进程数，核心数 * 2 + 1 个（可以按照实际使用需求更改）
workers = multiprocessing.cpu_count() + 1
# 每个 worker 的线程数
threads = 2
# 设置最大并发量
worker_connections = 2000
loglevel = "debug"  # 错误日志的日志级别
access_log_format = '%(t)s %(p)s %(h)s "%(r)s" %(s)s %(L)s %(b)s %(f)s" "%(a)s"'
# 设置访问日志和错误信息日志路径
log_dir = "/var/log/gunicorn/"
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
accesslog = log_dir + "gunicorn_access.log"
errorlog = log_dir + "gunicorn_error.log"

# 监听地址:监听端口
bind = "0.0.0.0:9999"

DB_PATH = "textfsm_template.sqlite"
if not os.path.exists(DB_PATH):
    print("Database file '%s' does not exist, please run 'python init_db.py' to create database first." % DB_PATH)
    sys.exit(1)
