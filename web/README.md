# textfsm_online_frontend

http://textfsm.xdai.vip/


## 本地部署

开发版本软件依赖：
```
node==16
npm==8
```
安装方法请参考 [Download Node.js®](https://nodejs.org/en/download/package-manager).

### 克隆代码

克隆代码到部署目录，例如 `/opt/textfsm_online`:
```
git clone --depth 1 https://github.com/xdai555/textfsm_online.git /opt/textfsm_online
cd /opt/textfsm_online/web
```

### 安装依赖

```
npm install
```

### 调试项目

```
npm run serve
```

### 编译项目

```
npm run build
```

运行完成后，生成 `dist` 目录，将该目录下的文件发布到网站根目录（例如 nginx）即可访问。