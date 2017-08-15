if [[ ! -z "$GIT_BRANCH" ]]
then
	if [ "$GIT_BRANCH" != "production" ] && [ "$GIT_BRANCH" != "latest-v3" ];
	then
    cd /var/www/wp-content/themes/wp-property-pro/static/scripts/src
    NODE_ENV=development npm install
	fi
fi

