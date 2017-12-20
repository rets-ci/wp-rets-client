[![Latest Stable Version](https://poser.pugx.org/felixarntz/leavesandlove-wp-plugin-util/version)](https://packagist.org/packages/felixarntz/leavesandlove-wp-plugin-util)
[![License](https://poser.pugx.org/felixarntz/leavesandlove-wp-plugin-util/license)](https://packagist.org/packages/felixarntz/leavesandlove-wp-plugin-util)

LaL WP Plugin Util
==================

This is a library to initialize WordPress plugins in a proper fashion, making usual processes a lot easier to handle and adding a few useful features, for example plugin dependency management or automatic multisite-compatibility. I originally developed this library to use it in my own plugins, but version 2.0.0 marks its initial public release.

Features
--------

* use WordPress plugin initialization best practices
* provide minimum required PHP and WordPress version
* provide other plugins (including minimum versions) as dependencies (optional)
* fail gracefully if any of the required dependencies are not met and show a helpful admin notice
* show plugin installation / activation / update links for plugin dependencies that are not met
* easily handle plugin installation, uninstallation, activation and deactivation by simply providing one method for each (optional) - it is automatically multisite-compatible
* allow the plugin to be used as a regular plugin, a must-use plugin or (if you provide an `is_library` argument with value `true`) even bundled as a library inside another plugin, must-use plugin or theme
* automatically handle textdomain loading, whether you use local .po files or wordpress.org language packs
* show a (permanently dismissible) status message in the admin when the plugin is activated (optional)
* easily add custom links to the plugin's row in the plugins list table (optional)
* have useful utility functions of your plugin already available, like getting absolute paths and URLs, the current plugin version or PHP notice generators (in case someone messes with your plugin)

This library uses WordPress best practices to initialize plugins and enhances the default behavior only where necessary - it does not reinvent the wheel or bloat the admin with dozens of internal settings.

Requirements
------------

Your plugin itself must:

* require at least PHP 5.3 and WordPress 3.5 (don't worry, the plugin loader will fail gracefully if a user with a lower version tries to run the plugin)
* use namespaces and composer (and preferably use autoloading)
* have a main initialization class called `App` which resides in your plugin's root namespace
* store local translation files (if needed) in an immediate plugin subdirectory `/languages/`

Getting Started
---------------

To use the library, first add it to your project by adding it to your composer.json (`composer require felixarntz/leavesandlove-wp-plugin-util:2.0.1`). The library uses autoloading to load its classes. It is recommended that you also use autoloading with your plugin's own files.

Your plugin must have a main initialization class which is called `App` and resides in your plugin's root namespace (do not put this class in the actual plugin main file!). This main class must extend the `LaL_WP_Plugin` class bundled in this library. For more information on how to extend this class, please check out [it's PHPDoc block](https://github.com/felixarntz/leavesandlove-wp-plugin-util/blob/master/leavesandlove-wp-plugin.php#L13). See a little bit further below for a basic example of what that class could look like.

Then you initialize the main class from your plugin's main file. The following code snippet gives you an example:

```php
<?php
/*
Plugin Name: My Plugin
Plugin URI: https://wordpress.org/plugins/my-plugin/
Description: This is my plugin's description.
Version: 1.0.0
Author: John Doe
Author URI: http://example.com
License: GNU General Public License v3
License URI: http://www.gnu.org/licenses/gpl-3.0.html
Text Domain: my-plugin
*/

if ( version_compare( phpversion(), '5.3.0' ) >= 0 && ! class_exists( 'MyPluginNamespace\App' ) ) {
  // load the PHP autoloader...
  if ( file_exists( dirname( __FILE__ ) . '/my-plugin/vendor/autoload.php' ) ) {
    require_once dirname( __FILE__ ) . '/my-plugin/vendor/autoload.php';
  } elseif ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
    require_once dirname( __FILE__ ) . '/vendor/autoload.php';
  }
} elseif ( ! class_exists( 'LaL_WP_Plugin_Loader' ) ) {
  // ...or load the plugin loader class itself
  if ( file_exists( dirname( __FILE__ ) . '/my-plugin/vendor/felixarntz/leavesandlove-wp-plugin-util/leavesandlove-wp-plugin-loader.php' ) ) {
    require_once dirname( __FILE__ ) . '/my-plugin/vendor/felixarntz/leavesandlove-wp-plugin-util/leavesandlove-wp-plugin-loader.php';
  } elseif ( file_exists( dirname( __FILE__ ) . '/vendor/felixarntz/leavesandlove-wp-plugin-util/leavesandlove-wp-plugin-loader.php' ) ) {
    require_once dirname( __FILE__ ) . '/vendor/felixarntz/leavesandlove-wp-plugin-util/leavesandlove-wp-plugin-loader.php';
  }
}

// the actual plugin loading call
LaL_WP_Plugin_Loader::load_plugin( array(
  'slug'                => 'my-plugin',
  'name'                => 'My Plugin',
  'version'             => '1.0.0',
  'main_file'           => __FILE__,
  'namespace'           => 'MyPluginNamespace',
  'textdomain'          => 'my-plugin',
  'use_language_packs'  => true,
), array(
  'phpversion'          => '5.3.0',
  'wpversion'           => '4.0',
) );
```

The above code is all that you should include in your plugin's main file. In case you already wondered: You must not wrap any of the code into a `plugins_loaded` function - the plugin loader handles that for you. For an overview of how to leverage the advanced initialization methods, please check out [the plugin loader class' PHPDoc block](https://github.com/felixarntz/leavesandlove-wp-plugin-util/blob/master/leavesandlove-wp-plugin-loader.php#L82).

Based on the above example, the following is the absolute minimal code that your main class should have:

```php
<?php
namespace MyPluginNamespace;

use LaL_WP_Plugin as Plugin;

if ( ! class_exists( 'MyPluginNamespace\App' ) ) {

  class App extends Plugin {
    protected static $_args = array();

    protected function __construct( $args ) {
      parent::__construct( $args );
    }

    protected function run() {
      // initialize the plugin here
    }
  }

}
```

It is recommended to always wrap all your classes and functions into an if clause whether they already exist as this prevents fatal errors that may happen if a plugin is used as a regular plugin and as a bundled library at the same time.

~~For a detailed guide and reference on how to use this library, please read the [Wiki on Github](https://github.com/felixarntz/leavesandlove-wp-plugin-util/wiki).~~ Detailed guide coming soon - for now please refer to the PHPDoc.

Contributions and Bugs
----------------------

If you have ideas on how to improve the library or if you discover a bug, please open a new issue or a pull-request.

You can also contribute to the library by translating it. In the library's `/languages/` directory, there is a `.pot` file which you can use as a starting point. When you're done with a translation, you can either create a pull request with the new translation files or you can send them to me manually.
