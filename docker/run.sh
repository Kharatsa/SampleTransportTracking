#!/bin/bash

set -eu

if [ ! -f $HOME/finished-setup ]; then
  gulp build

  node $STT_APP_PATH/app/maintenance/data.js sync
  node $STT_APP_PATH/app/maintenance/metadata.js reloadcsv
  node $STT_APP_PATH/app/maintenance/users.js add admin unsafepassword

  touch $HOME/finished-setup

fi

exec npm start
