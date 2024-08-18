# textfsm_online

TextFSM 在线解析
https://textfsm.xdai.vip/


## 本地部署

1. 安装 docker

    ```
    sudo apt-get install docker.io
    sudo apt-get install docker-compose
    ```

2. 克隆本仓库

    ```
    git clone https://github.com/xdai555/textfsm_online.git
    ```

3. 构建并启动容器

    ```
    sudo docker-compose up -d --build
    ```

4. 容器构建完成并启动之后，textfsm_online 会在 `8080` 端口提供服务，可以通过本机地址直接访问

    ```
    http://$(yourdockerhost):8080
    ```
