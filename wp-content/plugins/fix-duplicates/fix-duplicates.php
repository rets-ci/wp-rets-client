<?php
/*
Plugin Name: Fix Duplicates
Plugin URI: http://scratch99.com/products/fix-duplicates/
Description: Find and delete duplicates posts, specifying which one to keep (newest, oldest or manual selection). There is a premium extension that allows you to 301 redirect duplicates to the post you are keeping.
Version: 1.0.3
Date: 12 July 2015
Author: Stephen Cronin (Scratch99 Design)
Author URI: http://scratch99.com/

   Copyright 2014  Stephen Cronin  (email : sjc@scratch99.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/


// ***********************************************
function fix_duplicates_init() {

	// set the current plugin version
	$fix_duplicates_version = '1.0.3';

	// get the plugin options
	$fix_duplicates_options = get_option( 'fix_duplicates_options' );

	// if it's not the latest version, let's make sure that we have all the settings we need for this version (more to come)
	if ( version_compare( $fix_duplicates_version, $fix_duplicates_options[ 'version' ], '>' ) ) {
		$fix_duplicates_options[ 'version' ] = $fix_duplicates_version;
		update_option( 'fix_duplicates_options', $fix_duplicates_options );
	}

	// ****** Load admin scripts if it's a admin visit ******
	if ( is_admin() )
		require_once( 'fix-duplicates-admin.php' );
	// *********************************************

}
add_action( 'init', 'fix_duplicates_init', 0 );
// ***********************************************

?>