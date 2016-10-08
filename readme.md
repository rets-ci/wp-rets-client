This is the general rabbit.ci management plugin, it should be installed on client sites.
Importnat note, this plugin updates itself automatically when changes are made to the `latest` branch on GitHub.

* Purges Varnish when a post/page is updated, for the particular page.
* Purges all Varnish cache for entire domain when permalinks are updated/changes.


### Settings
For now settings will be constant-based, in future can add options.
 
* `RABBITCI_AUTO_UPDATE` - If enabled, will update from latest branch and automatically install.


### Functions
Few useful functions.

* `rabbit_write_log` - Writes details to /var/log/wpcloud.site/deployment.log.

### Development
To setup wp-rabbit within a site for contextual development:

```
git clone git@github.com:RabbitCI/wp-rabbit.git wp-content/plugins/wp-rabbit
```

Add `wp-content/plugins/wp-rabbit/.git` to .gitignores on the main project while developing locally. 

Be advised, once you push to GitHub the site you are working on will update the plugin almost immediatly.