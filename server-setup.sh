#!/bin/bash -ex

# this script should be run as root

# these instructions come from this document: https://docs.docker.com/engine/installation/linux/ubuntulinux/

apt-get update
apt-get install apt-transport-https ca-certificates

apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

# for ubuntu 16.04
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | tee /etc/apt/sources.list.d/docker.list

sudo apt-get update
apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual

apt-get install docker-engine
service docker start


