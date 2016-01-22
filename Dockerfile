FROM node:4.2
MAINTAINER Sean Herman <sjh293@cornell.edu>

ENV BUILD_DEPS='git' \
    NODE_DEPS='gulp mocha jsdoc'

RUN apt-get update && apt-get install -y \
    ${BUILD_DEPS} --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g ${NODE_DEPS}

ENV STT_DATA_PATH='/var/lib/strack' \
    STT_BASE_PATH='/var/www/strack' \
    STT_PORT='8080'

RUN mkdir -p ${STT_DATA_PATH}
RUN mkdir -p ${STT_BASE_PATH}
WORKDIR ${STT_BASE_PATH}

COPY . ${STT_BASE_PATH}
# RUN git clone https://github.com/Kharatsa/sample-tracking.git ${STT_BASE_PATH}

RUN npm install \
    && npm prune \
    && npm cache clean
WORKDIR node_modules
RUN ln -s ../app app
WORKDIR ${STT_BASE_PATH}
RUN gulp build

RUN adduser --system --no-create-home --group strack
RUN chown -R strack:strack ${STT_BASE_PATH}
USER strack

EXPOSE ${STT_PORT}

CMD ['npm', 'start']