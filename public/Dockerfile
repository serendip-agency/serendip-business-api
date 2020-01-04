FROM node:alpine
WORKDIR /app
COPY . .
RUN npm i serendip-web@latest
EXPOSE 2080
USER root
CMD [ "node", "node_modules/serendip-web/bin/server.js", " -p 2080" ]