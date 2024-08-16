# textfsm_online_backend

https://textfsm.xdai.vip/


## 本地部署方式

### 克隆代码

克隆代码到部署目录，例如 `/opt/textfsm_online`:
```
git clone --depth 1 https://github.com/xdai555/textfsm_online.git /opt/textfsm_online
cd /opt/textfsm_online/backend
```

### 创建 python3 虚拟环境（>= 3.7）

```
python3 -m venv ./venv
source ./venv/bin/activate
```

### 安装依赖

```
pip install -r requirements.txt
```

### 初始化数据库
运行 `python init_db.py` 初始化数据库，运行完成后会在本地目录生成 textfsm_template.sqlite，服务端时会读取该文件。

初始化脚本不加任何参数运行时，默认写入 pip 安装好的 ntc-templates 模板。

```
python3 init_db.py --help
usage: init_db.py [-h] [--source SOURCE] [--path PATH]

Generate database from 'TextFSM Online'.

optional arguments:
  -h, --help       show this help message and exit
  --source SOURCE  The source of the templates (e.g., 'ntc-templates').
  --path PATH      The path where the `index` file is located.
```

如果需要把其他分支的 ntc-templates 模板写入数据库，需要确保该分支的模板内容及格式符合 ntc-templates 的开发标准；运行初始化脚本时添加指 `source` 和 `path` 参数。

> 请务必要指定 `source` 参数，否则当模板名称相同时，会覆盖更新已有的模板内容。

例如，添加 [@Elinpf](https://github.com/Elinpf/ntc-templates.git) 维护的国内厂商模板到数据库：

```
git clone --depth=1  https://github.com/Elinpf/ntc-templates.git Elinpf
python3 init_db.py  --source Elinpf --path Elinpf/ntc_templates/templates
```

运行后回显：`Created 627 data(s) to 'textfsm_template.sqlite'.` 表示成功写入 627 条模板内容。

### 启动服务

后端服务默认监听在本地 9999 端口。编辑 `gunicorn_conf.py` 中的 `bind = "127.0.0.1:9999"` 配置项进行修改。

```
./start_server.sh
```

如果服务未能成功启动，请检查 `/var/log/gunicorn/gunicorn_error.log`。

### 停止服务

停止服务使用的是 `pkill gunicorn` ，如果本地存在其他通过 gunicorn 启动的服务，请不要直接运行，否则会杀死其它同名服务 :)。

```
./stop_server.sh
```
