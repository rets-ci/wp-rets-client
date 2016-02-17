<?php
/*
Plugin Name: WordPress Menufication
Plugin URI: http://www.iveo.se
Description: Generates a responsive menu from Wordpress menu system or from a custom element. Dependencies: jQuery.
Version: 1.2
Author: IVEO
Author URI: http://www.iveo.se
License:  © IVEO AB 2013 - All Rights Reserved
*/


require_once( 'lib/class-menuficiation.php' );

if( class_exists( 'Menufication' ) ) {

  new Menufication;
}