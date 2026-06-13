#!/bin/sh
if [ ! -f /app/db/textfsm_template.sqlite ]; then
  echo "Initializing database..."
  python init_db.py
  python init_db.py --source Elinpf --path Elinpf/ntc_templates/templates
fi
exec python server.py
