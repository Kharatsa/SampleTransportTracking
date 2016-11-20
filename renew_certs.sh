#!/bin/bash -e

umask 002 # new files should have group write access

letsencrypt certonly -vvvv --config /etc/letsencrypt/configs/$TL_HOSTNAME.conf

if [ $? -ne 0 ]; then
  ERRORLOG=`tail /var/log/letsencrypt/letsencrypt.log`
  echo -e "The Let's Encrypt cert has not been renewed! \n \n" \
           $ERRORLOG
else
  sudo nginx -s reload
fi

exit 0
