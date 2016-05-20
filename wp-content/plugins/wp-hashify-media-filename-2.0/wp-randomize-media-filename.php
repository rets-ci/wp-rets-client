<?php
/**
 * Plugin Name: Hashify Media Filename
 * Plugin URI: https://github.com/UsabilityDynamics/wp-randomize-media-filename
 * Description: Randomizes the filename of newly uploaded media files.
 * Author: Usability Dynamics, Inc.
 * Author URI: https://www.usabilitydynamics.com/
 * Version: 2.0.0
 * GitHub Plugin URL: UsabilityDynamics/wp-hashify-media-filename
 *
 */

add_filter( 'sanitize_file_name', 'rmf_randomize_filename', 10 );

if( !function_exists( 'rmf_randomize_filename' ) ) {

	function rmf_randomize_filename( $filename ) {

		$info = pathinfo( $filename );

	  $ext = empty( $info[ 'extension' ] ) ? '' : '' . $info[ 'extension' ];
	  $rnd = rand( 0, 99 );
	  $name = basename( $filename, $ext );

		$_parts = array(  );

		if( strpos( $info['filename'], '@' ) ) {

			$_cleanName = explode( '@', $info['filename'] )[0];
			$_retna = explode( '@', $info['filename'] )[1];

			$_parts[] = substr( md5( time() ), 0, 8 );
			$_parts[] = '-';
			$_parts[] = strtolower( $_cleanName );
			$_parts[] = '@' . strtolower( $_retna );
		} else {
			$_parts[] = substr( md5( time() ), 0, 8 );
			$_parts[] = '-';
			$_parts[] = strtolower( $info['filename'] );
		}

		return join( '', $_parts ) . '.' . $ext;

	}

}

