if [[ ! -z "$GIT_BRANCH" ]]
then
	if [ "$GIT_BRANCH" != "production" ] && [ "$GIT_BRANCH" != "latest-v3" ];
	then
	NODE_ENV=development npm --prefix=/var/www/wp-content/themes/wp-property-pro/static/scripts/src install
	fi
fi

#
npm install;

# CRON JOBS
pm2 start /var/www/wp-content/static/bin/cron.js \
    --name "cron" \
    --silent \
    --force \
    --merge-logs \
    --log-date-format="YYYY-MM-DD HH:mm:ss"