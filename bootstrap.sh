#!/bin/bash
set -x

TRACKER_REPO="https://github.com/Kharatsa/sample-tracking.git"
SAMPLE_TRACK_BASEDIR="/srv/www"
SAMPLE_TRACK_DIR="sample-tracking"
SAMPLE_TRACK_PATH="$SAMPLE_TRACK_BASEDIR/$SAMPLE_TRACK_DIR"
SAMPLE_TRACK_LOG_PATH="/var/log/$SAMPLE_TRACK_DIR"
SAMPLE_TRACK_USER="strack"
SAMPLE_TRACK_USER_GROUP="$SAMPLE_TRACK_USER:$SAMPLE_TRACK_USER"
CURRENT_USER_GROUP="$(whoami):$(whoami)"
SECRET_DEST="/srv/www/$SAMPLE_TRACK_DIR/app"
NVM_DIR="/opt/nvm"
NODE_VERSION="4.2"


echo "----------------------------------------------"
echo "----------------------------------------------"
echo "---- BOOTSTRAP SAMPLE TRACK WEB SERVER -------"
echo "----------------------------------------------"
echo "----------------------------------------------"


echo "----------------------------------------------"
echo "--------- Update system software -------------"
echo "----------------------------------------------"
sudo apt-get update && sudo apt-get upgrade --yes


echo "----------------------------------------------"
echo "-------- Install system utilities ------------"
echo "----------------------------------------------"
sudo apt-get install --yes build-essential curl git vim supervisor


echo "----------------------------------------------"
echo "------------- Install NVM --------------------"
echo "----------------------------------------------"
sudo mkdir -p $NVM_DIR
sudo chown -R $CURRENT_USER_GROUP $NVM_DIR
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh \
| NVM_DIR=$NVM_DIR bash

# Run nvm.sh to get NVM working in this shell session
. $NVM_DIR/nvm.sh


echo "----------------------------------------------"
echo "--------- Install Node.js $NODE_VERSION -------------"
echo "----------------------------------------------"
nvm install $NODE_VERSION
nvm use $NODE_VERSION
NVM_NODE=$(which node)
NVM_NPM=$(which npm)

# Make this node and npm version accessible to all users
sudo ln -s $NVM_NODE /usr/local/bin/node
sudo ln -s $NVM_NPM /usr/local/bin/npm

# Update .profile to load NVM on boot and use the specified version of Node.js
echo ". $NVM_DIR/nvm.sh >/dev/null 2>&1" >> ~/.profile
echo "nvm use $NODE_VERSION >/dev/null 2>&1" >> ~/.profile


echo "----------------------------------------------"
echo "----------- Configure Supervisor -------------"
echo "----------------------------------------------"
sudo adduser --system --no-create-home --group $SAMPLE_TRACK_USER
sudo mkdir -p $SAMPLE_TRACK_LOG_PATH
sudo chown -R $SAMPLE_TRACK_USER_GROUP $SAMPLE_TRACK_LOG_PATH
sudo chmod -R 770 $SAMPLE_TRACK_LOG_PATH

# Create the supervisor configuration file
sudo sh -c "echo '[program:strack]
command=$NVM_NODE $SAMPLE_TRACK_PATH/app/server/server.js
autostart=true
autorestart=true
environment=NODE_ENV=production
stderr_logfile=$SAMPLE_TRACK_LOG_PATH/stracker.err.log
stdout_logfile=$SAMPLE_TRACK_LOG_PATH/stracker.out.log
user=$SAMPLE_TRACK_USER' >> /etc/supervisor/conf.d/strack.conf"


echo "----------------------------------------------"
echo "------------- Install gulp -------------------"
echo "----------------------------------------------"
npm install -g gulp


echo "----------------------------------------------"
echo "-------- Scaffold Sample Tracker app ---------"
echo "----------------------------------------------"
# Create app directories
sudo mkdir -p $SAMPLE_TRACK_PATH
sudo chown -R $CURRENT_USER_GROUP $SAMPLE_TRACK_BASEDIR

# Drop the Sample Tracking application in place
git clone $TRACKER_REPO $SAMPLE_TRACK_PATH
cd $SAMPLE_TRACK_PATH

# Place the secret file
mv ~/secrets.js $SAMPLE_TRACK_PATH/app/
npm install
cd node_modules

# Add a symbolic link to the app so require statements resolve properly
sudo ln -s $SAMPLE_TRACK_PATH/app $SAMPLE_TRACK_PATH/node_modules/app


echo "----------------------------------------------"
echo "-------- Launch Sample Tracking app ----------"
echo "----------------------------------------------"
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start strack

sudo reboot
