#!/bin/bash -ex

FINISHED_MARKER=/home/stt/fin

if [ ! -f "$FINISHED_MARKER" ]; then
  gulp build # Compile/build app
  build_exit_code=$?

  if [ $build_exit_code -eq 0 ]
  then
    touch $FINISHED_MARKER
  else
    exit $build_exit_code
  fi

fi

npm start # Start the server
