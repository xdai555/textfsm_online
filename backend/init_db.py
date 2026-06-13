import os
import sqlite3
import argparse
from importlib.resources import path as importresources_path
from config import DB_PATH


def get_ntc_path(package="ntc_templates"):
    """get default ntc-templates package path"""
    with importresources_path(package=package, resource="templates") as posix_path:
        template_dir = str(posix_path)

    index = os.path.join(template_dir, "index")
    if not os.path.isdir(template_dir) or not os.path.isfile(index):
        raise ValueError(f"Using `pip install {package}` to install.")
    return os.path.abspath(template_dir)


def parse_index_file(file_path):
    """Parse index file and extract "Template, Platform" data"""
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
    """Read template context from file"""
    template_file = os.path.join(file_path, f"{template_filename}")
    with open(template_file, "r") as file:
        context = file.read()
    return context


def create_database(data, template_path, source="ntc-templates"):
    """Create database from template data"""
    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    # create templates table
    cursor.execute(
        """CREATE TABLE IF NOT EXISTS templates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Template TEXT NOT NULL,
                    Platform TEXT NOT NULL,
                    Context TEXT NOT NULL,
                    Source TEXT DEFAULT '%s',
                    Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    Modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE (Source, Template)
                )"""
        % source
    )

    # create shares table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shares (
            id TEXT PRIMARY KEY,
            raw_text TEXT NOT NULL,
            template_text TEXT NOT NULL,
            source_value TEXT,
            platform_value TEXT,
            template_value TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME
        )
    """)

    # write data to database
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
        help="The source name for the templates (e.g., 'ntc-templates', 'my-templates', etc.)"
    )
    parser.add_argument(
        "--path",
        type=str,
        default=get_ntc_path(),
        help="The path where the 'index' file is located"
    )
    args = parser.parse_args()
    source = args.source
    index_path = args.path
    index_filename = "index"
    file_path = os.path.join(index_path, index_filename)
    data = parse_index_file(file_path)
    create_database(data, index_path, source=source)
    print("Created %s data(s) to 'textfsm_template.sqlite'." % len(data))
