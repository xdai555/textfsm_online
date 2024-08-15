gunicorn server:app -c gunicorn_conf.py
if [ $? -eq 0 ]; then
    bind_info=$(cat gunicorn_conf.py | grep bind | awk '{print $NF}')
    echo "Server running on $bind_info successfully."
elif [ $? -eq 1 ]; then
    echo "Failed to start server, please check log file."
    exit 1
fi