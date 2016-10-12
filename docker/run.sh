#!/bin/bash

set -eu

if [ ! -f /finished-setup ]; then
  gulp build

  node $STT_APP_PATH/app/maintenance/data.js sync
  node $STT_APP_PATH/app/maintenance/metadata.js reloadcsv
  node $STT_APP_PATH/app/maintenance/users.js add admin unsafepassword

  npm prune -q

  touch /finished-setup
fi

exec "$@"
