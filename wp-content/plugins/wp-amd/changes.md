#### 1.2.1
* Updated vendor libraries. Old versions occurred conflicts when other UD plugins were activated.
* Fixed Content-Type response headers.
* Fixed typos.
* Fixed PHP Warnings and Notices.
* Fixed dependency saving/updating, which did not work when forms were saved via AJAX.
* Fixed incorrect plugin_url usage.
* Fixed WPML translation issue with js and css not being properly included.
* Other improvements and fixes.

#### 1.1.0
* Added disk caching, with location configurable via "wp-amd:script:disk_cache" filter.
* Added Metaboxes, Screen Options and Screen Help. (WIP)
* Added filters that allow override of default asset locations. e.g. /assets/scripts/app.js instead of /assets/wp-amd.js
* Added Twitter Bootstrap CSS and JS as available dependencies.
* Added Font Awesome as an available CSS dependency.
* Added Normalize as an available CSS dependency.
* Added support for dependency-dependencies.
* Fixed bug with Style and Script post types not properly registering their titles.
* Forces third-party JavaScript libraries to be loaded in footer by default.
* Added Knockout.js and UDX Requires
* Several minor documentation fixes.

#### 1.2.0
* Added bundled vendor dependencies.
* Added changes.md file.