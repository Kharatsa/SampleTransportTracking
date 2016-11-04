#!/bin/bash -ex

# this script should be run as root

# install docker
# these instructions come from this document: https://docs.docker.com/engine/installation/linux/ubuntulinux/

apt-get update
apt-get install -y apt-transport-https ca-certificates

apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

# for ubuntu 16.04
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | tee /etc/apt/sources.list.d/docker.list

sudo apt-get update
apt-get install -y linux-image-extra-$(uname -r) linux-image-extra-virtual

apt-get install -y docker-engine
service docker start

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.9.0-rc2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# create link for docker-compose.yml
rm docker-compose.yml
ln -s docker-compose-prod.yml docker-compose.yml

# install mysql client
apt-get install -y mysql-client-core-5.7

# add docker group
usermod -aG docker ubuntu

# change permissions for creds file
chmod 640 /etc/stt_creds
chown ubuntu:docker /etc/stt_creds

# create logging directory
mkdir /var/log/stt

# setup log rotate for stt
echo "/var/log/stt/*.log {
	weekly
	rotate 10
	compress
	delaycompress
	missingok
	notifempty
}" > /etc/logrotate.d/stt