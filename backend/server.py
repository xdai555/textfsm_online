# encoding: utf-8
import tempfile
# import logging
# import os
import textfsm
import sqlite3
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gunicorn_conf import DB_PATH


# log_dir = "/var/log/gunicorn/"
# if not os.path.exists(log_dir):
#     os.makedirs(log_dir)

# logging.basicConfig(
#     level=logging.DEBUG,
#     format="%(asctime)s %(filename)s[line:%(lineno)d ] %(levelname)s %(message)s",
#      # 日 月 年 ，星期 时 分 秒
#     datefmt="%d %b %Y,%a %H:%M:%S",
#     filename=log_dir + "server.log",
#     filemode="a+",
# )


def str_to_file_obj(text, mode="wb+"):
    with tempfile.NamedTemporaryFile(mode=mode, delete=True) as f_obj:
        f_obj = tempfile.NamedTemporaryFile(mode=mode)
        f_obj.write(text)
        # 确保 string 立即写入文件
        f_obj.flush()
        # 将文件读取指针返回到文件开头位置
        f_obj.seek(0)
    return f_obj


def textfsm_parser(raw_text: str, template_text: str) -> str:
    textfsm_data = []
    fsm_handler = None
    try:
        # 字符串转为 bytes
        with str_to_file_obj(template_text.encode("utf-8")) as f_obj:
            fsm_handler = textfsm.TextFSM(f_obj)
            for obj in fsm_handler.ParseText(raw_text):
                entry = {}
                for index, entry_value in enumerate(obj):
                    entry[fsm_handler.header[index]] = entry_value
                textfsm_data.append(entry)
        return textfsm_data

    except textfsm.parser.Error as tfte:
        return {"msg": "TextFSM parsing error: " + str(tfte)}


def connect_to_database(db_path=DB_PATH):
    """连接数据库，返回连接句柄"""
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    return connection, cursor


def execute_query(query, parameters=None):
    """执行数据库查询并返回结果列表"""
    connection, cursor = connect_to_database()
    if parameters:
        cursor.execute(query, parameters)
    else:
        cursor.execute(query)
    result = cursor.fetchall()
    connection.close()
    return result


app = FastAPI()


# 可以发起请求的源
origins = [
    "http://localhost:8080",
    "http://textfsm.xdai.vip",
    "https://textfsm.xdai.vip",
    "https://textfsm-online.pages.dev",
    "http://textfsm-online.pages.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()


class TextFSMBody(BaseModel):
    raw_text: str
    template_text: str


@router.post("/parser")
async def parse_textfsm(textfsm_body: TextFSMBody):
    textfsm_body = dict(textfsm_body)
    result = textfsm_parser(**textfsm_body)
    if isinstance(result, list) and len(result) > 0:
        textfsm_body["result"] = result
        # logging.info(textfsm_body)
    return result


@router.get("/getSourceList")
def get_source_list():
    query = "SELECT DISTINCT Source FROM templates"
    source_list = [row[0] for row in execute_query(query)]
    return {"data": {"source_list": source_list}}


@router.get("/getPlatformList")
def get_platform_list(source: str):
    query = "SELECT DISTINCT Platform FROM templates where Source = ?"
    parameters = (source,)
    platform_list = [row[0] for row in execute_query(query, parameters)]
    return {"data": {"platform_list": platform_list}}


@router.get("/getTemplateList")
def get_template_list(platform: str, source: str):
    query = "SELECT DISTINCT Template FROM templates WHERE Platform = ? and Source = ?"
    parameters = (
        platform,
        source,
    )
    tmpl_list = [row[0] for row in execute_query(query, parameters)]
    return {"data": {"platform": platform, "template_list": tmpl_list}}


@router.get("/loadTemplate")
def load_tmpl(template: str, source: str):
    query = "SELECT Context FROM templates WHERE Template = ? and Source = ?"
    parameters = (
        template,
        source,
    )
    result = execute_query(query, parameters)

    if not result:
        content = "Template not found"
    else:
        content = result[0][0]
    return {"data": {"template": template, "content": content}}


app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn

    # uvicorn.run(app, host="127.0.0.1", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=9999)
