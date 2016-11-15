#!/bin/bash -ex

git submodule update --init

rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

# export our db credentials
export $(cat /etc/stt_creds | xargs)

# create the sst db
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./deploy/create_db.sql

sudo docker-compose up -d

sudo docker exec -it app_stt ./app/maintenance/data.js sync
sudo docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
sudo docker exec -it app_stt ./app/maintenance/users.js add -a $STT_USER $STT_PASSWORD

