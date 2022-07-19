FROM node:12.22.5  
WORKDIR /usr/src/app
COPY . .
RUN npm install

CMD ["bin/hubot","-a","telegram"]
