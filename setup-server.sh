#!/bin/bash -ex

# this script should be run as root

# Install Docker (via https://docs.docker.com/engine/installation/linux/ubuntulinux/)
apt-get install -y apt-transport-https ca-certificates
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

# for ubuntu 16.04
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | tee /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y linux-image-extra-$(uname -r) linux-image-extra-virtual
apt-get install -y docker-engine

# Add user to `docker` group
usermod -aG docker ubuntu

service docker start

# Install Docker Compose
curl -L https://github.com/docker/compose/releases/download/1.9.0-rc2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Point Docker Compose at the production configuration
rm docker-compose.yml
ln -s deploy/docker-compose-prod.yml docker-compose.yml

# Install MySQL client
apt-get install -y mysql-client-core-5.7

# Setup logging directory, and grant ownership of logs and credentials
mkdir /var/log/stt
chmod 640 /etc/stt_creds
chown -R ubuntu:docker /etc/stt_creds
chown -R ubuntu:docker /var/log/stt

# Configure logrotate for the STT application
echo "/var/log/stt/*.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/stt

apt-get upgrade -y

echo "REBOOTING"
reboot
