<?php
namespace wpCloud\CLI {

  use WP_CLI;
  use WP_CLI_Command;

  if( defined( 'WP_CLI' ) && class_exists( 'WP_CLI_Command' ) && !class_exists( 'wpCloud\CLI\Cloud_CLI_Command' ) ) {

    /**
     * wpCloud MySQL Utility Plugin
     *
     * @package DH_Migrate_Command
     * @subpackage commands/community
     * @maintainer Mike Schroder
     */
    class Cloud_CLI_Command extends WP_CLI_Command {

      /**
       * Backup entire WordPress install, including core, plugins and database.
       *
       *
       * @alias convert
       *
       * @param array $args
       * @param array $assoc_args
       */
      function optimize( $args, $assoc_args ) {
        global $wpdb;

        //die( '<pre>' . print_r( $wpdb, true ) . '</pre>' );
        $MyISAM = $wpdb->get_col( "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'DiscoDonniePresents/www.discodonniepresents.com' AND ENGINE = 'MyISAM';" );

        WP_CLI::line( 'Found ' . count( $MyISAM ) . ' MyISAM tables.' );

        $_chunks = array_chunk( $MyISAM, 10 );

        foreach( $MyISAM as $_count => $_table ) {
          WP_CLI::line( 'Doing table [' . $_table . '] ' . $_count . ' of ' . count( $MyISAM ) );
          $wpdb->query( "ALTER TABLE `{$_table}` ENGINE=INNODB;" );
        }

        // WP_CLI::print_value( $_test->return_code );

      }

      /**
       * Backup entire WordPress install, including core, plugins and database.
       *
       * @subcommand backup
       *
       * @alias mv
       *
       * @param array $args
       * @param array $assoc_args
       * @synopsis [backup_filename] [--no-db] [--db-name=<filename>]
       */
      function backup( $args, $assoc_args ) {
        $filename = $dbname = null;
        $backup_directory = '../';

        // If a filename isn't specified, default to "Site's Title.tar.gz".
        if( empty( $args ) ) {
          $filename = $backup_directory . get_bloginfo() . '.tar.gz';
        } else {
          $filename = $args[ 0 ];
        }

        // If --no-db is specified, don't include the database in backup
        if( !isset( $assoc_args[ 'no-db' ] ) ) {
          $dbname = isset( $assoc_args[ 'db-name' ] ) ? $assoc_args[ 'db-name' ] : 'database_backup.sql';

          WP_CLI::run_command( array( 'db', 'export', $backup_directory . $dbname ), array() );
        }

        // Using esc_cmd to automatically escape parameters.
        // We can't use --exclude-vcs, because it's not available on OSX.
        WP_CLI::line( "Backing up to $filename ..." );
        $result = \WP_CLI::launch( WP_CLIUtilsesc_cmd( "
          tar
            --exclude '.git'
            --exclude '.svn'
            --exclude '.hg'
            --exclude '.bzr'
            -czf %s . -C %s %s
        ", $filename, $backup_directory, $dbname ), false );

        // If we created a database backup, remove the temp file.
        if( $dbname && !unlink( $backup_directory . $dbname ) ) {
          WP_CLI::warning( "Couldn't remove temporary database backup, '$dbname'." );
        }

        if( 0 == $result ) {
          WP_CLI::success( "Backup Complete." );
        } else {
          WP_CLI::error( "Backup Failed." );
        }
      }

    }


  }

}