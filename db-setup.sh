#!/bin/bash -ex

git submodule update --init

rm docker-compose.yml
ln -s docker-compose-prod.yml docker-compose.yml

# export our db credentials
export $(cat /etc/stt_creds | xargs)

# create the sst db
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./create_db.sql

sudo docker-compose up -d

password=$(openssl rand -base64 16)

sudo docker exec -it app_stt ./app/maintenance/data.js sync
sudo docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
sudo docker exec -it app_stt ./app/maintenance/users.js add -a admin $password

echo "ODK_PASSWORD=$password
ODK_USERNAME=admin" >> /etc/stt_creds

