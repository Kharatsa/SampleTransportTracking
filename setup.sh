#!/bin/bash -ex

SOURCE_PATH=/home/ubuntu/stt
APP_LOG_PATH=/var/log/stt
ENV_VARS_FILE=/etc/stt_creds
NGINX_CONF_PATH=/etc/nginx/conf.d
NGINX_WEBROOT_PATH=/usr/share/nginx/html
LETS_ENCRYPT_PATH=/var/www/letsencrypt

# Load environment variables in bashrc
cat /etc/stt_creds | \
  while read line; do
    echo "export $line"
  done >> /home/ubuntu/.bashrc


# Create the required log directories and set permissions
mkdir -p $APP_LOG_PATH
chmod 640 $ENV_VARS_FILE
chown -R ubuntu:docker $ENV_VARS_FILE $APP_LOG_PATH
echo "$APP_LOG_PATH/*.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/stt

# The STT container shares the NGINX static directory, so our user
# must have ownership
chown -R ubuntu:www-data /usr/share/nginx/html/

# Point Docker Compose at the production configuration
rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

# Pull the metadata repository
git submodule update --init

# Export application and database credentials
export $(cat /etc/stt_creds | xargs)

# Start the Docker services
docker-compose up -d

# Bootstrap the application database
mysql -h $STT_DB_HOST -u $STT_DB_USER --password=$MYSQL_PASSWORD < ./deploy/create_db.sql
docker exec -it app_stt ./app/maintenance/data.js sync
docker exec -it app_stt ./app/maintenance/metadata.js reloadcsv
docker exec -it app_stt ./app/maintenance/users.js add -a $STT_USER $STT_PASSWORD

# Setup NGINX
envsubst < ./deploy/nginx/temp.template > $NGINX_CONF_PATH/temp.conf
chown -R www-data /etc/nginx
nginx -t && nginx -s reload

# Setup LetsEncrypt
mkdir -p $LETS_ENCRYPT_PATH /etc/letsencrypt/configs /var/lib/letsencrypt /var/log/letsencrypt
envsubst < ./deploy/certbot/certbot_conf.template > /etc/letsencrypt/configs/$TL_HOSTNAME.conf
chown -R ubuntu:www-data $LETS_ENCRYPT_PATH /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt

# Retrieve LetsEncrypt certificates
chmod +x renew_certs.sh
./renew_certs.sh
letsencrypt certonly --config /etc/letsencrypt/configs/$TL_HOSTNAME.conf

# Setup LetsEncrypt certificate renewal
# TODO(sean)

# Load final NGINX config
rm $NGINX_CONF_PATH/temp.conf
envsubst '$TL_HOSTNAME' < ./deploy/nginx/letsencrypt.template > $NGINX_CONF_PATH/letsencrypt.conf
envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/stt.template > $NGINX_CONF_PATH/stt.conf
envsubst '$TL_HOSTNAME $LETS_ENCRYPT_PATH' < ./deploy/nginx/odk.template > $NGINX_CONF_PATH/odk.conf
chown -R www-data /etc/nginx
nginx -t && nginx -s reload
