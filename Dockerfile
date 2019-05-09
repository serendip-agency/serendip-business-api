FROM node:alpine
WORKDIR /app
COPY . .
RUN npm i 
EXPOSE 80
USER root

# Serendip core options
ENV core.logging=info 
ENV core.cpuCores=1 
ENV core.httpPort=80 

# Db service options
ENV db.mongoDb=serendip_business_api 
ENV db.mongoUrl=mongodb://localhost:27017 
ENV db.authSource=
ENV db.user=
ENV db.password=

# Email service options
ENV email.host=test.cloud 
ENV email.username=system@test.cloud 
ENV email.password=  
ENV email.port=587 
ENV email.ssl=false 

ENV smsIr.lineNumber=  
ENV smsIr.apiKey=  
ENV smsIr.secretKey=
ENV smsIr.verifyTemplate=5405 
ENV smsIr.verifyTemplateWithIpAndUseragent=5406 

CMD [ "node", "dist/app.js" ]