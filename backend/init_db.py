import os
import argparse
import sqlite3
from importlib.resources import path as importresources_path


def get_ntc_path(package="ntc_templates"):
    """获取通过 pip 安装的 ntc-templates 包路径"""
    with importresources_path(package=package, resource="templates") as posix_path:
        # Example: /opt/venv/netmiko/lib/python3.8/site-packages/ntc_templates/templates
        template_dir = str(posix_path)

    index = os.path.join(template_dir, "index")
    if not os.path.isdir(template_dir) or not os.path.isfile(index):
        raise ValueError(f"Using `pip install {package}` to install.")
    return os.path.abspath(template_dir)


def parse_index_file(file_path):
    """解析索引文件并提取每一行的 "Template, Platform" 数据"""
    data = []
    with open(file_path, "r") as file:
        lines = file.readlines()
        for line in lines[13:]:
            if line.strip() and not line.startswith("#"):
                template, _, platform, _ = line.strip().split(",")
                if ":" in template:
                    for tmpl in template.split(":"):
                        data.append((tmpl.strip(), platform.strip()))
                else:
                    data.append((template.strip(), platform.strip()))
    return data


def _read_context(file_path, template_filename):
    """根据给定的文件路径读取模版文本内容"""
    template_file = os.path.join(file_path, f"{template_filename}")
    with open(template_file, "r") as file:
        context = file.read()
    return context


def create_database(data, template_path, source="ntc-templates"):
    """从给定模版路径中读取模版文本内容并写入本地数据库"""
    db_filename = "textfsm_template.sqlite"
    db_path = os.path.join("./", db_filename)

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    # 初始化数据库
    cursor.execute(
        """CREATE TABLE IF NOT EXISTS templates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Template TEXT NOT NULL,
                    Platform TEXT NOT NULL,
                    Context TEXT NOT NULL,
                    Source TEXT DEFAULT '%s',
                    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    Modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE (Source, Template)
                )"""
        % source
    )

    # 写入数据
    for template, platform in data:
        context = _read_context(template_path, template)
        cursor.execute(
            "INSERT OR REPLACE INTO templates (Template, Platform, Context, Source) VALUES (?, ?, ?, ?)",
            (template, platform, context, source),
        )
    connection.commit()
    connection.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate database from 'TextFSM Online'.")
    parser.add_argument(
        "--source",
        type=str,
        default="ntc-templates",
        help="The source of the templates  (e.g., 'ntc-templates')."
    )
    parser.add_argument(
        "--path",
        type=str,
        # 默认使用 pip 安装的 ntc-templates 的包路径生成数据
        default=get_ntc_path(),
        help="The path where the `index` file is located."
    )
    args = parser.parse_args()
    source = args.source
    index_path = args.path
    # ntc-templates 索引文件名称
    index_filename = "index"
    file_path = os.path.join(index_path, index_filename)
    data = parse_index_file(file_path)
    create_database(data, index_path, source=source)
    print("Created %s data(s) to 'textfsm_template.sqlite'." % len(data))