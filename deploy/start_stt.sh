#!/bin/bash -ex

FINISHED_MARKER=/home/stt/fin

if [ ! -f "$FINISHED_MARKER" ]; then
  echo "Building STT app"
  gulp build # Compile/build app
  touch $FINISHED_MARKER
fi

npm start # Start the server
