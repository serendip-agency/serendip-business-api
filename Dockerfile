FROM node:current-alpine

WORKDIR /app


COPY package*.json ./
COPY files files
COPY dist dist
COPY node_modules node_modules


# RUN npm i npm@latest -g

# RUN npm install --no-optional && npm cache clean --force

# HEALTHCHECK --interval=30s CMD node healthcheck.js


# the official node image provides an unprivileged user as a security best practice
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user

USER node

EXPOSE 2040

CMD [ "node", "./dist/app.js" ]