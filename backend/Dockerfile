FROM python:3.8-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple && \
    python init_db.py && \
    python init_db.py  --source Elinpf --path Elinpf/ntc_templates/templates

EXPOSE 9999

CMD ["python", "server.py"]
