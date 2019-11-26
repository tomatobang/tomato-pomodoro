#基于基础镜像
FROM node:12.13.0-alpine

RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

RUN mkdir -p /home/tomato-pomodoro
#应用部署目录
WORKDIR /home/tomato-pomodoro
COPY package.json /home/tomato-pomodoro/package.json
RUN npm install --registry=https://registry.npm.taobao.org
#部署后台应用代码
COPY . /home/tomato-pomodoro
RUN npm run tsc
# 暴露端口给宿主机
EXPOSE 10005
# 容器启动时执行的命令，启动应用
CMD npm start
