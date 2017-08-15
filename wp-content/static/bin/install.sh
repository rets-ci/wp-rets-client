if [[ ! -z "$GIT_BRANCH" ]]
then
	if [ "$GIT_BRANCH" != "production" ] && [ "$GIT_BRANCH" != "latest-v3" ];
	then
	NODE_ENV=development npm --prefix=/var/www/wp-content/themes/wp-property-pro/static/scripts/src install
	fi
fi

