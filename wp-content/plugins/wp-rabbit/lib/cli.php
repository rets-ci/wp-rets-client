<?php
/**
 * Adds Rabbit icon to navbar with some information about the container.
 *
 * * HTTP_X_SELECTED_BRANCH
 * * HTTP_X_SELECTED_CONTAINER
 * * HTTP_X_SELECTED_BACKEND
 *
 */
namespace RabbitCI\CLI {

	use WP_CLI;

	if( defined( 'WP_CLI' ) ) {
		WP_CLI::add_command( 'rabbit purge', array( 'RabbitCI\CLI\Actions', 'purge' ) );
	}

	class Actions {

		/**
		 * Purges Varnish/CloudFront for a URL
		 *
		 * ## OPTIONS
		 *
		 * default: success
		 * options:
		 *   - success
		 *   - error
		 * ---
		 *
		 * ## EXAMPLES
		 *
		 *     wp rabbit purge /
		 *     wp rabbit purge /stuff/
		 *
		 * @when after_wp_load
		 *
		 * @param array $args
		 */
		static public function purge( $args = array() ) {

			$_pages = array(
				"home" => get_home_url( null, isset( $args[0] ) ? $args[0] : '/' ),
				//"includes" => includes_url('/*'),
				//"content" => content_url('/*'),
			);

			foreach( $_pages as $_url ) {
				// WP_CLI::success( 'Purging ' . $_url );

				$_result = rabbit_purge_url( $_url, array( "blocking" => true ));

					if( isset( $_result->ok ) && $_result->ok ) {
						WP_CLI::success( sprintf( 'Purged %s on [%s] branch. Response: %s', $_result->url, $_result->branch, $_result->message )) ;
					}

			}

		}

	}

}
