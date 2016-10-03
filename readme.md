This is the general rabbit.ci management plugin, it should be installed on client sites.
Importnat note, this plugin updates itself automatically when changes are made to the `latest` branch on GitHub.

* Purges Varnish when a post/page is updated, for the particular page.
* Purges all Varnish cache for entire domain when permalinks are updated/changes.


### Development
To setup wp-rabbit within a site for contextual development:

```
git clone git@github.com:RabbitCI/wp-rabbit.git wp-content/plugins/wp-rabbit
```

Add `wp-content/plugins/wp-rabbit/.git` to .gitignores on the main project while developing locally. 

Be advised, once you push to GitHub the site you are working on will update the plugin almost immediatly.