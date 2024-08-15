# textfsm_online_backend

https://textfsm.xdai.vip/


```
# 下载后端代码到 /opt/textfsm_online 目录下
git clone --depth 1 --branch backend https://github.com/xdai555/textfsm_online.git /opt/textfsm_online
cd /opt/textfsm_online

# 创建 python3 虚拟环境（>= 3.7）
python3 -m venv ./venv
source ./venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 初始化数据库，执行后会在本地目录生成 textfsm_template.sqlite，服务端会读取该文件
python init_db.py

# 启动服务，监听端口可以在 gunicorn_conf.py 中修改
./start_server.sh
```