FROM node:argon-slim
MAINTAINER Sean Herman <sjh293@cornell.edu>

ENV BUILD_DEPS='sqlite3 git' \
    NODE_DEPS='gulp bower mocha jsdoc'

RUN apt-get -q update && apt-get -q -y install \
    ${BUILD_DEPS} --no-install-recommends \
    && apt-get -q clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -q -g ${NODE_DEPS} \
    && npm link ${NODE_DEPS}

ENV STT_DATA_PATH='/var/lib/strack' \
    STT_APP_PATH='/var/www/strack' \
    STT_LOG_PATH='/var/log/strack' \
    STT_PUBLIC_PATH='/var/www/strack/app/public' \
    STT_LISTEN_PORT='8081' \
    STT_LISTEN_HOST='0.0.0.0'

RUN mkdir -p ${STT_DATA_PATH} \
    && mkdir -p ${STT_APP_PATH} \
    && mkdir -p ${STT_LOG_PATH}

COPY . ${STT_APP_PATH}

WORKDIR ${STT_APP_PATH}

# Install node packages
RUN npm install -q \
    && npm cache clean -q

# Install bower packages
RUN bower install --allow-root \
    && bower cache clean --allow-root

ENV NODE_ENV='production'

# Run the build & database sync scripts
RUN gulp build
RUN node app/maintenance/data.js sync
RUN node app/maintenance/metadata.js reloadcsv
RUN node app/maintenance/users.js add admin unsafepassword
RUN npm prune -q

VOLUME ${STT_DATA_PATH}
VOLUME ${STT_PUBLIC_PATH}
EXPOSE ${STT_LISTEN_PORT}

CMD npm start