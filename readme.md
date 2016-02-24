### Licenses
Order #213613 has most of the licenses, terms is in order #228849. 

* terms - `order_56ba320e5efb2_am_QXuPpFhNvVdL`
* madison - ``ud_order_55bf9b4d2ab42_am_tUyt8Tomoy2H`
* supermap - `ud_order_55bf9a433765d_am_3PkactV1159x`
* pdf - `ud_order_55bf9a433765d_am_MtgfX3hXrBwX`
* feps - `ud_order_55bf9a433765d_am_QZzs15HNF97V`
* importer - `ud_order_55bf9a433765d_am_UbBGbd86UsSA`
* slideshow - `ud_order_55bf9a433765d_am_V6YTyfqUcrLR`
* power tools - `ud_order_55bf9a433765d_am_ebipEBJFCZZj`
* agents - `ud_order_55bf9a433765d_am_hu26MxeYZCai`

### GIT subtrees

```
git subtree add --prefix=wp-content/plugins/wp-property-supermap git@github.com:wp-property/wp-property-supermap develop-advanced-template --squash
git subtree add --prefix=wp-content/plugins/wp-property-importer git@github.com:wp-property/wp-property-importer latest --squash
git subtree add --prefix=wp-content/plugins/wp-property-terms git@github.com:wp-property/wp-property-terms latest --squash
git subtree add --prefix=wp-content/plugins/wp-property git@github.com:wp-property/wp-property develop-advanced-supermap --squash
```

### Google Cloud Storage

* Project: client-rdc
* Service Account: media.reddoorcompany.com
* Service Email: media-reddoorcompany-com@client-rdc.iam.gserviceaccount.com


### MySQL Setup

Connect to MySQL cluster:
```
mysql --host=api.wpcloud.io --port=13038 --user=rdc --password=wpcvdvwyocbhnrfj
```

Setup development tables:
```mysql
create database `www.reddoorcompany.com.develop`;
GRANT USAGE on `www.reddoorcompany.com.develop`.* to `rdc`@`%` IDENTIFIED BY "wpcvdvwyocbhnrfj";  
GRANT ALL PRIVILEGES on `www.reddoorcompany.com.develop`.* to `rdc`@`%`;
```


### Grunt
The new theme uses grunt to build files. 
```
cd /var/www/wp-content/themes/wp-reddoor
nohup grunt watch &
```