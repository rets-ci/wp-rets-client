<?php
/**
 * Plugin Name: Custom Post Type Rewrite
 * Plugin URI: https://github.com/thingsym/custom-post-type-rewrite
 * Description: This WordPress plugin adds default custom post type permalinks.
 * Version: 1.0.1
 * Author: thingsym
 * Author URI: http://www.thingslabo.com/
 * License: GPL2
 * Text Domain: custom-post-type-rewrite
 * Domain Path: /languages
 */

/**
 *     Copyright 2015 thingsym (http://www.thingslabo.com/)
 *
 *     This program is free software; you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation; either version 2 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program; if not, write to the Free Software
 *     Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110, USA
 */

class Custom_Post_Type_Rewrite {

	public function __construct() {
		add_action( 'wp_loaded', array( $this, 'set_rewrite' ), 10 );
	}

	public function set_rewrite() {
		global $wp_rewrite;

		if ( ! $wp_rewrite->permalink_structure ) {
			return;
		}

		$post_types = get_post_types( array( '_builtin' => false, 'publicly_queryable' => true, 'show_ui' => true ) );

		$search = array( '%front%', '%post%', '%year%', '%monthnum%', '%day%', '%date%' );

		$date = '';
		if ( preg_match( '/\/archives/', $wp_rewrite->permalink_structure ) ) {
			$date = '/date';
		}

		$position = 'top';

		foreach ( $post_types as $post_type ) {
			if ( ! $post_type ) {
				continue;
			}

			$slug = get_post_type_object( $post_type )->rewrite['slug'] ? get_post_type_object( $post_type )->rewrite['slug'] : $post_type;
			$front = get_post_type_object( $post_type )->rewrite['with_front'] ? $wp_rewrite->front : '';

			$replace = array( preg_replace( '/^\//', '', $front ), $slug, $wp_rewrite->rewritereplace[0], $wp_rewrite->rewritereplace[1], $wp_rewrite->rewritereplace[2], $date );

			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/%day%/feed/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/%day%/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/%day%/page/?([0-9]{1,})/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&paged=$matches[4]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/%day%/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&post_type=' . $post_type, $position );

			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/feed/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]&post_type='. $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/page/?([0-9]{1,})/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&paged=$matches[3]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/%monthnum%/?$' ), 'index.php?year=$matches[1]&monthnum=$matches[2]&post_type=' . $post_type, $position );

			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/feed/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?year=$matches[1]&feed=$matches[2]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?year=$matches[1]&feed=$matches[2]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/page/?([0-9]{1,})/?$' ), 'index.php?year=$matches[1]&paged=$matches[2]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%%date%/%year%/?$' ), 'index.php?year=$matches[1]&post_type='. $post_type, $position );

			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%/author/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?author=$matches[1]&feed=$matches[2]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%/author/([^/]+)/(feed|rdf|rss|rss2|atom)/?$' ), 'index.php?author=$matches[1]&feed=$matches[2]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%/author/([^/]+)/page/?([0-9]{1,})/?$' ), 'index.php?author=$matches[1]&paged=$matches[2]&post_type=' . $post_type, $position );
			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%/author/([^/]+)/?$' ), 'index.php?author=$matches[1]&post_type=' . $post_type, $position );

			add_rewrite_rule( str_replace( $search, $replace, '%front%%post%/?$' ), 'index.php?post_type=' . $post_type, $position );
		}
	}
}

$custom_post_type_rewrite = new Custom_Post_Type_Rewrite;
