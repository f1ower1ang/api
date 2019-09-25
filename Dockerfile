# 制定node镜像的版本
FROM node:8.9-alpine
# 声明作者
MAINTAINER flowerlang
# 移动当前目录下面的文件到app目录下
ADD . /app/
# 进入到app目录下面，类似cd
WORKDIR /app
# 安装依赖
RUN rm -f package-lock.json \
    ; rm -rf .idea \
    ; rm -rf node_modules \
    ; npm config set registry "https://registry.npm.taobao.org/" \
    && npm install
# 对外暴露的端口
EXPOSE 3000
# 程序启动脚本
CMD ["node", "./bin/www"]