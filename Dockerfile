FROM node:4.2-slim
MAINTAINER Sean Herman <sjh293@cornell.edu>

ENV BUILD_DEPS='sqlite3 git' \
    NODE_DEPS='gulp bower mocha jsdoc'

RUN apt-get -q update && apt-get -q -y install \
    ${BUILD_DEPS} --no-install-recommends \
    && apt-get -q clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -q -g ${NODE_DEPS}

ENV STT_DATA_PATH='/var/lib/strack' \
    STT_APP_PATH='/var/www/strack' \
    STT_LISTEN_PORT='8081' \
    STT_LISTEN_HOST='0.0.0.0'

RUN mkdir -p ${STT_DATA_PATH}
RUN mkdir -p ${STT_APP_PATH}

COPY . ${STT_APP_PATH}

WORKDIR ${STT_APP_PATH}

# Install node packages
RUN npm install -q \
    && npm prune -q \
    && npm cache clean -q

# Install bower packages
RUN bower install --allow-root \
    && bower cache clean --allow-root

# Create a symlink in node modules for easier require()s
WORKDIR node_modules
RUN ln -s ../app app
WORKDIR ${STT_APP_PATH}

# Run the build & database sync scripts
RUN npm run build
RUN node app/maintenance/data.js sync
RUN npm prune -q --production

VOLUME ${STT_DATA_PATH}
EXPOSE ${STT_LISTEN_PORT}

CMD npm start