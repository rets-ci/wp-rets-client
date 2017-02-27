Create new database with standard username:

```
create database `www.reddoorcompany.com.v2`;
GRANT USAGE on `www.reddoorcompany.com.v2`.* to `rdc`@`%` IDENTIFIED BY "wpcvdvwyocbhnrfj";
GRANT ALL PRIVILEGES on `www.reddoorcompany.com.v2`.* to `rdc`@`%`;
FLUSH PRIVILEGES;
```

For production-hotfix branch:
```
create database `www.reddoorcompany.com.production-hotfix`;
GRANT USAGE on `www.reddoorcompany.com.production-hotfix`.* to `rdc`@`%` IDENTIFIED BY "wpcvdvwyocbhnrfj";
GRANT ALL PRIVILEGES on `www.reddoorcompany.com.production-hotfix`.* to `rdc`@`%`;
FLUSH PRIVILEGES;
```
