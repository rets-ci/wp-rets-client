<?php
/*
Plugin Name: Duplicate Page And Post
Plugin URI: http://wordpresshowtos.blogspot.com/2015/10/duplicate-page-plugin.html
Description: A plugin to create exact duplicate of a page or a post maintaining the formating and settings 
Author: Zeeshan Aslam Durrani
Version: 1.1
Author URI: http://wordpresshowtos.blogspot.com/2015/10/duplicate-page-plugin.html
Text Domain: duplicate-page-and-post
Domin Path: Languages
License: GPLV2

Copyright 2015 ZEESHANASLAMDURRANI (email : zeeshanaslamdurrani@gmail.com)
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/

/*******************
* Global Variables 
*******************/

$dpap_prefix = 'dpap';
$dpap_plugin_name = 'Duplicate Page and Post';

/*******************
* includes 
*******************/

$dir = plugin_dir_path( __FILE__ );

include($dir.'includes/dpap_processing.php'); // to open links in a new window

/*****************
* Translation
******************/

load_plugin_textdomain('duplicate-page-and-post', false, basename(dirname( __FILE__ ) ) . '/languages' );




?>
