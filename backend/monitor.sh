#!/bin/bash
# 检查本地服务状态，如果异常，重启服务
URL="https://localhost:9999/api/getSourceList"
URL="http://localhost:8080/api/getSourceList"
LOG_FILE="/opt/textfsm_online/log/monitor.log"

# 获取当前时间戳
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

# 发送HEAD请求，获取HTTP状态码
status_code=$(curl -k -s -X GET -o /dev/null -w "%{http_code}" -I "$URL")

# 判断状态码是否为200
if [ "$status_code" -eq 200 ]; then
    echo "$timestamp - OK" >> "$LOG_FILE"
else
    echo $timestamp - HTTP Status Code: $status_code >> "$LOG_FILE"
    # bash /opt/textfsm_online/send_to_feishu.sh textfsm_online $status_code
    echo "$timestamp - Restart Server......" >> "$LOG_FILE"
    bash /opt/textfsm_online/stop_server.sh &&  bash /opt/textfsm_online/start_server.sh
    echo "$timestamp - EXEC Start Server Done" >> "$LOG_FILE"
fi
