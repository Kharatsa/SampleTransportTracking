#!/bin/bash

set -x

REMOTE_USER=$1
REMOTE_HOST=$2
PRIVATE_KEY_PATH=$3

# Copy the secrets.js file to the server
rsync -avz -e "ssh -i $PRIVATE_KEY_PATH" --progress app/secrets.js \
$REMOTE_USER@$REMOTE_HOST:~;

# Bootstrap logic
ssh -i $PRIVATE_KEY_PATH $REMOTE_USER@$REMOTE_HOST \
'bash -s' <<'ENDSSH'
  set -x

  TRACKER_REPO="https://github.com/Kharatsa/sample-tracking.git"
  SAMPLE_TRACKING_BASEDIR="/srv/www"
  SAMPLE_TRACKING_DIR="sample-tracking"
  SAMPLE_TRACKING_PATH="$SAMPLE_TRACKING_BASEDIR/$SAMPLE_TRACKING_DIR"
  CURRENT_USER_GROUP="$(whoami):$(whoami)"
  SECRET_DEST="/srv/www/$SAMPLE_TRACKING_DIR/app"
  NVM_DIR="/opt/nvm"
  NODE_VERSION="4.2"

  echo "----------------------------------------------"
  echo "----------------------------------------------"
  echo "---- BOOTSTRAP SAMPLE TRACKING WEB SERVER ----"
  echo "----------------------------------------------"
  echo "----------------------------------------------"


  echo "----------------------------------------------"
  echo "--------- Update system software -------------"
  echo "----------------------------------------------"
  sudo apt-get update && sudo apt-get upgrade --yes


  echo "----------------------------------------------"
  echo "---- Install build tools, curl, git, vim -----"
  echo "----------------------------------------------"
  sudo apt-get install --yes build-essential curl git vim

  echo "----------------------------------------------"
  echo "------------- Install NVM --------------------"
  echo "----------------------------------------------"
  sudo mkdir -p $NVM_DIR
  sudo chown -R $(whoami):$(whoami) $NVM_DIR
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh \
  | NVM_DIR=$NVM_DIR bash
  # Execute nvm.sh to get NVM working in this shell session
  . $NVM_DIR/nvm.sh

  echo "----------------------------------------------"
  echo "------------- Install Node.js  ---------------"
  echo "----------------------------------------------"
  echo "Using Node.js version $NODE_VERSION"
  nvm install $NODE_VERSION
  nvm use $NODE_VERSION
  # Make NVM's Node.js accessible to all users as just "node"
  sudo ln -s $(which node) /usr/local/bin/node

  echo "----------------------------------------------"
  echo "-------- Install gulp, pm2, node-gyp ---------"
  echo "----------------------------------------------"
  npm install -g pm2 gulp


  # Update .profile to load NVM on boot and use the specified version of Node.js
  echo ". $NVM_DIR/nvm.sh >/dev/null 2>&1" >> ~/.profile
  echo "nvm use $NODE_VERSION >/dev/null 2>&1" >> ~/.profile


  echo "----------------------------------------------"
  echo "--------- Configure pm2 for startup ----------"
  echo "----------------------------------------------"
  NVM_PM2=$(which pm2)
  PM2_HOME=/home/$(whoami)/.pm2
  # pm2 startup requires sudo to successfully update startup scripts
  sudo PM2_HOME=$PM2_HOME $NVM_PM2 startup -u $(whoami)
  sudo chown -R $(whoami) $PM2_HOME


  echo "----------------------------------------------"
  echo "-------- Scaffold Sample Tracker app ---------"
  echo "----------------------------------------------"

  # Establish scaffold for the Sample Tracking app
  # Create app directories
  sudo mkdir -p $SAMPLE_TRACKING_PATH
  sudo chown -R $CURRENT_USER_GROUP $SAMPLE_TRACKING_BASEDIR

  # Drop the Sample Tracking application in place
  git clone $TRACKER_REPO $SAMPLE_TRACKING_PATH
  cd $SAMPLE_TRACKING_PATH
  # Place the secret file
  mv ~/secrets.js $SAMPLE_TRACKING_PATH/app/
  npm install
  cd node_modules
  # Add a symbolic link to the app so require statements resolve properly
  sudo ln -s $SAMPLE_TRACKING_PATH/app $SAMPLE_TRACKING_PATH/node_modules/app

  echo "----------------------------------------------"
  echo "-------- Launch Sample Tracking app ----------"
  echo "----------------------------------------------"
  PM2_HOME=$PM2_HOME pm2 start -n "stracker" /srv/www/$SAMPLE_TRACKING_DIR/app/server/server.js

  echo "----------------------------------------------"
  echo "-------- Configure app for startup -----------"
  echo "----------------------------------------------"
  pm2 dump

  sudo reboot
ENDSSH