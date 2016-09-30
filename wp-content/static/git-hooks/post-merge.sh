#!/usr/bin/env bash

sudo service nginx reload

echo $(date) "post-merge hook - nginx reloaded." >> /home/core/post-merge.log

rm -rf /var/www/wp-content/uploads/minit/asset-header-*
rm -rf /var/www/wp-content/uploads/minit/asset-footer-*

echo $(date) "post-merge hook - minit flushed." >> /home/core/post-merge.log

## Make request to self to get the assets to regenerate
curl https://localhost/ -H "host:www.reddoorcompany.com" -H "x-forwarded-for:https" -k 
echo $(date) "post-merge hook - cache primed." >> /home/core/post-merge.log
