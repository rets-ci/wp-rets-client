### API Keys

* 462410d704f694edb7422745387c6b12 - admin searchly, used to be 1d5f77cffa8e5bbc062dab552a3c2093
* quw42xelwvbp5gbcdgcqqgtx4vz5txeb - public searchly

* AIzaSyAry82nr4I2Z57zobDmCkSqAM-vhPmCWss - Google Maps API key for browser. (client-rdc)
 
### Test URLs

* https://www.reddoorcompany.com/
* https://www.reddoorcompany.com/listing/506-n-mangum-street-407
* https://www.reddoorcompany.com/buy
* https://www.reddoorcompany.com/listing/3329-granville-drive
* https://www.reddoorcompany.com/buy/buy-with-red-door-company
* https://www.reddoorcompany.com/about/careers
* https://www.reddoorcompany.com/blog
* https://www.reddoorcompany.com/blog/category/home-renting
* https://www.reddoorcompany.com/blog/5-questions-tenants-often-ask-property-managers-prior-to-signing-a-lease
* https://www.reddoorcompany.com/guides
* https://www.reddoorcompany.com/guide/assembling-your-real-estate-team/tips-for-choosing-a-mortgage-lender-for-your-home-loan
* https://www.reddoorcompany.com/guide/home-buyers/protect-yourself-with-buyer-contingencies-in-your-purchase-contract - Last guide in category.
 

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
git subtree add --prefix=wp-content/plugins/wp-property git@github.com:wp-property/wp-property latest --squash
git subtree add --prefix=wp-content/plugins/wp-rets-client git@github.com:usabilitydynamics/wp-rets-client latest --squash
```

### Google Cloud Storage

* Project: client-rdc
* Service Account: media.reddoorcompany.com
* Service Email: media-reddoorcompany-com@client-rdc.iam.gserviceaccount.com


### Memcached
wpCloud has a provisioned shared Memcached instance at sql.wpcloud.io:23038.

### MySQL Setup

Connect to MySQL cluster:
```
mysql --host=api.wpcloud.io --port=13038 --user=rdc --password=wpcvdvwyocbhnrfj
```

Setup database tables tables:
```mysql
create database `latest-v3`;
GRANT USAGE on `latest-v3`.* to `rdc`@`%` IDENTIFIED BY "wpcvdvwyocbhnrfj";  
GRANT ALL PRIVILEGES on `latest-v3`.* to `rdc`@`%`;
create database `production-v2`;
GRANT USAGE on `production-v2`.* to `rdc`@`%` IDENTIFIED BY "wpcvdvwyocbhnrfj";  
GRANT ALL PRIVILEGES on `production-v2`.* to `rdc`@`%`;
create database `production-v3`;
GRANT USAGE on `production-v3`.* to `rdc`@`%` IDENTIFIED BY "wpcvdvwyocbhnrfj";  
GRANT ALL PRIVILEGES on `production-v3`.* to `rdc`@`%`;
```

### Update MySQL Data on Staging/Latest

```
wget https://storage.googleapis.com/snapshots.wpcloud.io/www.reddoorcompany.com/www.reddoorcompany.com.production/www.reddoorcompany.com.production-2016-08-20.sql.gz
gunzip www.reddoorcompany.com.production-2016-08-20.sql.gz
wp db import www.reddoorcompany.com.production-2016-08-20.sql 
```


### Grunt
The new theme uses grunt to build files. 
```
cd /var/www/wp-content/themes/wp-reddoor
nohup grunt watch &
```



### Useful Commands

SSH into container:
```
ssh usabilitydynamics.www.reddoorcompany.com.latest-v3@ssh.wpcloud.io -i ~/.ssh/github.pem -v
ssh usabilitydynamics.www.reddoorcompany.com.production@ssh.wpcloud.io -i ~/.ssh/github.pem -v
```

Purge Cache:
```
curl -XPURGE https://c.rabbitci.com/products -H "host:www.reddoorcompany.com"
```

Show Database Tables:
```
wp db size --tables --all-tables --size_format=mb
```
