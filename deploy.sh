#!/usr/bin/env bash
set -x

TRACKER_REPO="https://github.com/Kharatsa/sample-tracking.git"
SAMPLE_TRACK_DAEMON="strack"
SAMPLE_TRACK_BASEDIR="/srv/www"
SAMPLE_TRACK_DIR="strack"
SAMPLE_TRACK_PATH="$SAMPLE_TRACK_BASEDIR/$SAMPLE_TRACK_DIR"
SAMPLE_TRACK_USER="strack"
SAMPLE_TRACK_USER_GROUP="$SAMPLE_TRACK_USER:$SAMPLE_TRACK_USER"

echo "----------------------------------------------"
echo "------------ Pull repo updates ---------------"
echo "----------------------------------------------"
cd $SAMPLE_TRACK_PATH
sudo bash -c "git pull origin master"
sudo bash -c "npm install"
sudo chown -R $SAMPLE_TRACK_USER_GROUP $SAMPLE_TRACK_BASEDIR

echo "----------------------------------------------"
echo "----------- Restart the server ---------------"
echo "----------------------------------------------"
sudo supervisorctl restart $SAMPLE_TRACK_DAEMON
sudo supervisorctl status $SAMPLE_TRACK_DAEMON
