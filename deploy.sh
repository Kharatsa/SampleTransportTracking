#!/bin/bash
set -x

TRACKER_REPO="https://github.com/Kharatsa/sample-tracking.git"
SAMPLE_TRACK_DAEMON="strack"
SAMPLE_TRACK_BASEDIR="/srv/www"
SAMPLE_TRACK_DIR="sample-tracking"
SAMPLE_TRACK_PATH="$SAMPLE_TRACK_BASEDIR/$SAMPLE_TRACK_DIR"
SAMPLE_TRACK_USER="strack"

echo "----------------------------------------------"
echo "------------ Pull repo updates ---------------"
echo "----------------------------------------------"
cd $SAMPLE_TRACK_PATH
sudo -u $SAMPLE_TRACK_USER bash -c "git pull"

echo "----------------------------------------------"
echo "----------- Restart the server ---------------"
echo "----------------------------------------------"
sudo supervisorctl restart $SAMPLE_TRACK_DAEMON
sudo supervisorctl status $SAMPLE_TRACK_DAEMON
