FROM node:4.2-slim
MAINTAINER Sean Herman <sjh293@cornell.edu>

ENV BUILD_DEPS='git' \
    NODE_DEPS='gulp mocha jsdoc'

RUN apt-get update && apt-get install -y \
    ${BUILD_DEPS} --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g ${NODE_DEPS}

ENV STT_DATA_PATH='/var/lib/strack' \
    STT_APP_PATH='/var/www/strack' \
    STT_LISTEN_PORT='8081' \
    STT_LISTEN_HOST='0.0.0.0'

RUN mkdir -p ${STT_DATA_PATH}
RUN mkdir -p ${STT_APP_PATH}

COPY . ${STT_APP_PATH}

WORKDIR ${STT_APP_PATH}
RUN npm install \
    && npm prune \
    && npm cache clean
WORKDIR node_modules
RUN ln -s ../app app
WORKDIR ${STT_APP_PATH}
RUN gulp build

RUN adduser --system --no-create-home --group strack

VOLUME ${STT_DATA_PATH}
EXPOSE ${STT_LISTEN_PORT}

CMD chown -R strack:strack ${STT_APP_PATH} && npm start