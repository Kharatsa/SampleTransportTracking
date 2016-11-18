#!/bin/sh

# Delete old directorires?

letsencrypt certonly --config /etc/letsencrypt/configs/$TL_HOSTNAME.conf

if [ $? -ne 0 ]
 then
        ERRORLOG=`tail /var/log/letsencrypt/letsencrypt.log`
        echo -e "The Let's Encrypt cert has not been renewed! \n \n" \
                 $ERRORLOG
 else
        nginx -s reload
fi

exit 0
