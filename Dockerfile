FROM node:6-slim
MAINTAINER Sean Herman <sjh293@cornell.edu>

RUN useradd --user-group --create-home --shell /bin/false stt

ENV SYSTEM_DEPS='openssl' \
    BUILD_DEPS='git python make openssl build-essential' \
    HOME=/home/stt \
    NODE_DEPS='gulp bower' \
    STT_APP_PATH=/var/www/stt/ \
    STT_DATA_PATH=/var/lib/stt/ \
    STT_LISTEN_PORT=8081 \
    STT_LISTEN_HOST=0.0.0.0 \
    STT_LOG_PATH=/var/log/stt/ \
    STT_HOME=/home/stt/

RUN apt-get -q update >/dev/null \
    && apt-get -q -y install ${SYSTEM_DEPS} ${BUILD_DEPS} --no-install-recommends >/dev/null \
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
COPY deploy/start_stt.sh ${STT_HOME}

COPY . ${STT_APP_PATH}
ENV NODE_ENV=${NODE_ENV:-production}

RUN apt-get purge --auto-remove -y ${BUILD_DEPS} >/dev/null \
    && chown -R stt:stt $(npm config get prefix)/lib/node_modules \
    && chown -R stt:stt ${STT_APP_PATH} \
    && chown -R stt:stt ${STT_DATA_PATH} \
    && chown -R stt:stt ${STT_LOG_PATH} \
    && chown -R stt:stt ${STT_HOME} \
    && chmod +x /home/stt/start_stt.sh

VOLUME ${STT_DATA_PATH}
VOLUME ${STT_LOG_PATH}
EXPOSE ${STT_LISTEN_PORT}

USER stt
CMD ${STT_HOME}start_stt.sh
