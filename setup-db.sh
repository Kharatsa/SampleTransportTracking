#!/bin/bash -ex

git submodule update --init

rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

# export our db credentials
export $(cat /etc/stt_creds | xargs)

docker-compose up -d

# create the sst db
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./deploy/create_db.sql

docker exec -it app_stt ./app/maintenance/data.js sync
docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
docker exec -it app_stt ./app/maintenance/users.js add -a $STT_USER $STT_PASSWORD
