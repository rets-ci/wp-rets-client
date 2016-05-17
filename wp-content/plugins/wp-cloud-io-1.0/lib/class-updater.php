<?php
namespace wpCloud {

  use wpplex\WP_AutoUpdate\WP_AutoUpdate;
  use Plugin_Upgrader_Skin;
  use Plugin_Upgrader;

  if( class_exists( 'wpplex\WP_AutoUpdate\WP_AutoUpdate' ) && !class_exists( 'wpCloud\Updater' ) ) {

    /**
     * wpCloud MySQL Utility Plugin
     *
     * @package DH_Migrate_Command
     * @subpackage commands/community
     * @maintainer Mike Schroder
     */
    class Updater extends WP_AutoUpdate {

      /**
       * Plugin Slug (plugin_directory/plugin_file.php)
       * @var string
       */
      private $plugin_slug;

      /**
       * Plugin name (plugin_file)
       * @var string
       */
      private $slug;
      /**
       * The plugin remote update path
       * @var string
       */
      private $update_path;


      static public function register( $args = array( )) {

        return new self( $args['current_version'], $args['update_path'], $args['plugin_slug'], $args['license_user'], $args['license_key'] );

      }

      public function update() {

        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        $upgrader = new \WP_Upgrader;

        $automatic = new \WP_Automatic_Updater;

        // wp_remote_retrieve_body();
        // $automatic->should_update( 'plugin', '', ABSPATH );

        //$skin = new \Automatic_Upgrader_Skin;

        // compact('title', 'nonce', 'url', 'plugin')
        $wp_filesystem = $upgrader->fs_connect( array(WP_CONTENT_DIR, WP_PLUGIN_DIR ) );

        $download  = $upgrader->download_package( 'https://github.com/wpCloud/wp-cloud/archive/v1.0.zip' );

        $working_dir = $upgrader->unpack_package( $download );

        // if ( !is_wp_error($result) && $wp_filesystem->is_dir($from . $distro . 'wp-content/languages') ) {}



        if ( !$wp_filesystem->copy($working_dir . '/wordpress/wp-admin/includes/update-core.php', $wp_dir . 'wp-admin/includes/update-core.php', true) ) {
          $wp_filesystem->delete($working_dir, true);
          return new WP_Error( 'copy_failed_for_update_core_file', __( 'The update cannot be installed because we will be unable to copy some files. This is usually due to inconsistent file permissions.' ), 'wp-admin/includes/update-core.php' );
        }

        $wp_filesystem->chmod($wp_dir . 'wp-admin/includes/update-core.php', FS_CHMOD_FILE);


        // Remove working directory
        $wp_filesystem->delete( $working_dir, true);


        die( '<pre>' . print_r( $working_dir, true ) . '</pre>' );
        $result = $upgrader->upgrade( 'wp-cloud-1.0/wp-cloud.php', array(
          'clear_update_cache' => true,
          'title' => 'asdf', $this->slug,
          'plugin' => 'wp-cloud-1.0/wp-cloud.php', //$this->plugin_slug,
          'url' => 'https://github.com/wpCloud/wp-cloud/archive/v1.0.zip', //$this->update_path,
        ) );


        die( '<pre>' . print_r( $result, true ) . '</pre>' );
        //$upgrader->upgrade($plugin);


        // $skin = new Automatic_Upgrader_Skin;
        // $upgrader = new Language_Pack_Upgrader( $skin );
        // $translation->type = 'core';
        // $result = $upgrader->upgrade( $translation, array( 'clear_update_cache' => false ) );

        // if ( ! $result || is_wp_error( $result ) ) {
        //   return false;
        // }

        // return $translation->language;


      }


    }

  }

}