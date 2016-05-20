<?php
/*
Plugin Name: Widget Visibility
Plugin URI: http://www.codefleet.net/widget-visibility/
Description: Control which pages your widgets appear on WordPress
Version: 1.2.1
Author: Nico Amarilla
Author URI: http://www.codefleet.net/
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Autoloader
function widvis_autoloader($classname) {
    if(false !== strpos($classname, 'WidVis')){
        $plugin_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR;
        $classname = str_replace('_', DIRECTORY_SEPARATOR, $classname);
        $file = $plugin_dir .'src'.DIRECTORY_SEPARATOR. $classname . '.php';
        require_once $file;
    }
}
spl_autoload_register('widvis_autoloader');

// Hook the plugin
add_action('plugins_loaded', 'widvis_init'); // Priority must be less than target action
function widvis_init() {
    
    $plugin = new WidVis_Plugin();
    
    $plugin['version'] = '1.2.1';
    $plugin['path'] = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR;
    $plugin['url'] = plugin_dir_url(__FILE__);
	$plugin['textdomain'] = 'widvis';
    $plugin['slug'] = 'widget-visibility/widget-visibility.php';
    
    load_plugin_textdomain( $plugin['textdomain'], false, basename(dirname(__FILE__)).'/languages' ); // Load language files
    
    $plugin['view.view_folder'] = $plugin['path'].'views'.DIRECTORY_SEPARATOR;
    $plugin['view'] = new WidVis_View( $plugin['view.view_folder'] );
    
    $plugin['admin'] = new WidVis_Admin();
    
    $plugin->run();
}