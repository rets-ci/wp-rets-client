[![Stories](https://badge.waffle.io/usabilitydynamics/wp-amd.png?label=ready&title=Ready)](https://waffle.io/usabilitydynamics/wp-amd)
[![Dependency](https://gemnasium.com/UsabilityDynamics/wp-amd.svg)](https://gemnasium.com/UsabilityDynamics/wp-amd)
[![Scrutinizer](http://img.shields.io/scrutinizer/g/UsabilityDynamics/wp-amd.svg)](httpshttps://scrutinizer-ci.com/g/UsabilityDynamics/wp-amd)
[![Scrutinizer Coverage](http://img.shields.io/scrutinizer/coverage/g/UsabilityDynamics/wp-amd.svg)](https://scrutinizer-ci.com/g/UsabilityDynamics/wp-amd)

This WordPress plugin allows you to:

* Edit global CSS on the back-end or fron-end (in real-time).
* Edit global JavaScript file using the back-end.
* JavaScript and CSS assets both utilize post-type revisions for version control.
* Both asset types may be exported/imported using the native WordPress tools.
* Dependencies can be included ( jQuery, Backbone, etc ).

Visit on WordPress.org: http://wordpress.org/plugins/wp-amd/

## Screenshots

![Script Editor](http://content.screencast.com/users/TwinCitiesTech.com/folders/Jing/media/1e02790f-83f4-418d-9e2e-218e1bae8686/00000685.png)
![Permalnk Settings](http://content.screencast.com/users/TwinCitiesTech.com/folders/Jing/media/ac1ff2ce-a50e-4c0d-a160-764e0884998c/00000683.png)
![Live CSS Editor](http://content.screencast.com/users/TwinCitiesTech.com/folders/Jing/media/1e02790f-83f4-418d-9e2e-218e1bae8686/00000685.png)

## Advanced Features
* Create static cached versions of assets.
* Configure custom rewrite URLs at which the assets will be served.
* Plugin can be loaded as a WordPress plugin or as a Composer module (dependency).

## To Do
* Add Screen Options to Script Editor page.
* Add Settings -> Assets options page.
* ...

## PHPUnit Tests

To run tests:
* Copy test/php/wp-test-config-sample.php to root directory.
* Rename file to wp-test-config.php
* Setup required constants in config file.
* Run 'npm install' in command line ( be sure node.js is installed, more details: http://nodejs.org/ )
* Run 'grunt test' or 'grunt phpunit' in command line.
