#!/bin/bash -ex

git submodule update --init

# export our db credentials
export $(cat ./docker/env-prod.env | xargs)

# create the sst db
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./create_db.sql

sudo docker-compose up -d

sudo docker exec -it app_stt ./app/maintenance/data.js sync
sudo docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
sudo docker exec -it app_stt ./app/maintenance/users.js add -a test test

