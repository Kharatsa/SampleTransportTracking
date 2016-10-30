FROM node:6-slim
MAINTAINER Sean Herman <sjh293@cornell.edu>

RUN useradd --user-group --create-home --shell /bin/false stt

ENV BUILD_DEPS='sqlite3 git' \
    HOME=/home/stt \
    NODE_DEPS='gulp bower' \
    STT_APP_PATH='/var/www/stt/' \
    STT_DATA_PATH='/var/lib/stt/' \
    STT_LISTEN_PORT='8081' \
    STT_LISTEN_HOST='0.0.0.0' \
    STT_LOG_PATH='/var/log/stt/'

RUN apt-get -q update >/dev/null \
    && apt-get -q -y install ${BUILD_DEPS} --no-install-recommends >/dev/null \
    && apt-get -q clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -q -g ${NODE_DEPS} >/dev/null \
    && npm link ${NODE_DEPS} >/dev/null \
    && mkdir -p ${STT_APP_PATH} \
    && mkdir -p ${STT_DATA_PATH} \
    && mkdir -p ${STT_LOG_PATH}

USER root
WORKDIR ${STT_APP_PATH}

# Install dependencies
COPY bower.json package.json npm-shrinkwrap.json ${STT_APP_PATH}
RUN npm install -q >/dev/null && npm cache clean -q >/dev/null \
    && bower install --allow-root >/dev/null \
    && bower cache clean --allow-root >/dev/null

COPY . ${STT_APP_PATH}
ENV NODE_ENV=${NODE_ENV:-production}
RUN gulp build && npm prune -q >/dev/null

RUN chown -R stt:stt $(npm config get prefix)/lib/node_modules \
    && chown -R stt:stt ${STT_APP_PATH} \
    && chown -R stt:stt ${STT_DATA_PATH} \
    && chown -R stt:stt ${STT_LOG_PATH}

VOLUME ${STT_DATA_PATH}
VOLUME ${STT_LOG_PATH}
EXPOSE ${STT_LISTEN_PORT}

USER stt
CMD npm start
