FROM node:6-slim
MAINTAINER Sean Herman <sjh293@cornell.edu>

ENV BUILD_DEPS='sqlite3 git' \
    NODE_DEPS='gulp bower mocha jsdoc sqlite3'

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

WORKDIR ${STT_APP_PATH}

# Copy in the dependencies
COPY ./package.json .
COPY ./npm-shrinkwrap.json .
COPY ./bower.json .
COPY ./docker/run.sh /

# Install node packages
RUN npm install -q \
    && npm cache clean -q

# Install bower packages
RUN bower install --allow-root \
    && bower cache clean --allow-root

# Set this to production here, because devDependencies won't be installed
# otherwise, and they are required to complete the build.
ENV NODE_ENV=${NODE_ENV:-production}

# Run the build & database sync scripts
COPY . .

VOLUME ${STT_DATA_PATH}
VOLUME ${STT_PUBLIC_PATH}
EXPOSE ${STT_LISTEN_PORT}

# One time bootstrap
ENTRYPOINT ["/run.sh"]
CMD npm start
