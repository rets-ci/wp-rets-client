<?php
/**
 * AMD Require Handler
 *
 * ### Actions
 *
 * - udx:requires
 * - udx:requires:{name}
 *
 * ### Filters
 *
 * - udx:requires:headers
 * - udx:requires:config
 *
 * @author potanin@UD
 * @version 0.1.0
 * @module UsabilityDynamics
 */
namespace UsabilityDynamics {

  if( !class_exists( 'UsabilityDynamics\Requires' ) ) {

    /**
     * Class Requires
     *
     * @class Requires
     */
    class Requires extends \UsabilityDynamics\Utility {

      /**
       * Library Server.
       *
       * @public
       * @property $server
       * @type {Object}
       */
      public static $server = '//cdn.udx.io/requires.js';

      /**
       * Instance Settings.
       *
       * @public
       * @property $_settings
       * @type {Object}
       */
      private $_settings = array();

      /**
       * Constructor.
       *
       * args.path - relative path to home to serve data-main
       *
       * Actual script is printed at bottom of page to avoid any conflicts with any third-party scripts thinking they are being loaded using AMD.
       *
       * @todo Add output cleaning to remove any errors or warnigns.
       * @todo Add logic to not serve JS until template_redirect action to let JS deps register.
       * @todo Instane / settings should probably be based on scope since only a single requires.js instance can be handled per view.
       *
       * @param array $args
       *
       * @internal param array $_atts
       *
       * @internal param array|mixed $args .path
       */
      function __construct( $args = array() ) {

        if( did_action( 'template_redirect' ) ) {
          _doing_it_wrong( __FUNCTION__, sprintf( __( 'Requires called too late.' ) ) );
        }

        $args = self::parse_args( $args, array(
          'id'      => null,
          'type'    => 'model',
          'context' => '_',
          'path'    => admin_url( 'admin-ajax.php' ),
          'rewrite' => null,

          'base'    => null,
          'data'    => array(),
          'config'  => array(),

          'shim'    => array(),
          'deps'    => array(),

          'paths'   => array(
            'api'   => esc_url( admin_url( 'admin-ajax.php' ) ),
            'home'  => esc_url( home_url( '/' ) ),
            'login' => esc_url( wp_login_url() )
          ),

          // Extra Module Request Arguments.
          'args'    => array(),

          // HTTP Headers.
          'cache'   => '',
          'vary'    => '',
          'code'    => 200
        ));
        
        if( !$args->id ) {
          return;
        }

        // Create Stateless Settings.
        $this->_settings = new Settings( array(
          'key' => $args->id
        ) );

        // Set Passed Arguments.
        $this->set( $args );

        // Compute Values.

        // if( strpos( $args->path, admin_url( 'admin-ajax.php' ) === 0 ) ) {}

        // Add an "action" argument if not an admin URL. otherwise leave be.
        $args->path = $args->path . '?action=' . ( isset( $args->id ) ? $args->id : 'main' );
        $this->set( '_slug', self::create_slug( $args->id ? $args->id : str_replace( '.js', '', basename( $args->path || '/main.js' ) ), array( 'separator' => '-' ) ) );
        $this->set( '_path', ( $args->path ? $args->path : '/scripts/' . $this->id . '.js' ) );

        // Bind Actions.
        add_action( 'wp_print_footer_scripts', array( &$this, 'render_tag' ), 500 );
        add_action( 'admin_print_footer_scripts', array( &$this, 'render_tag' ), 100 );
        add_action( 'customize_controls_print_footer_scripts', array( &$this, 'render_tag' ), 100 );
        add_action( 'customize_preview_init', array( &$this, 'render_tag' ), 100 );
        add_action( 'login_enqueue_scripts', array( &$this, 'render_tag' ), 100 );

        // Serve AJAX Scripts.
        add_action( 'wp_ajax_' . $this->get( 'id' ), array( &$this, '_serve_model' ) );
        add_action( 'wp_ajax_nopriv_' . $this->get( 'id' ), array( &$this, '_serve_model' ) );

        // Handle Rewrites.
        // @todo Add rewrite handler.

        // @chainable.
        return $this;

      }

      /**
       * Add Arbitray Data
       *
       * @param string $key
       * @param null   $value
       *
       * @return null|\UsabilityDynamics\Settings
       * @internal param array $data
       */
      public function data( $key = '', $value = null ) {

        if( $key && $value ) {
          return $this->set( 'data' . '.' . $key, $value );
        }

        return $this->set( 'data', $key );

      }

      /**
       * General Admin Scripts.
       *
       * @todo The frontent preview is using incorrect action; "customize_preview_init" is triggered on body not in head.
       *
       * @action login_enqueue_scripts - Login page header scripts.
       * @action customize_controls_print_scripts - Customizer Interface scripts.
       * @action customize_controls_print_footer_scripts - Customizer Interface footer scripts.
       * @action admin_print_footer_scripts - General administrative scripts.
       * @action wp_footer - Frontend header scripts.
       */
      public function render_tag() {

        $scope = is_admin() ? 'private' : 'public';

        $_args = apply_filters( 'udx:requires:config', array_filter( array(
          'src'           => self::$server,
          'data-id'       => $this->get( 'id' ),
          'data-main'     => $this->get( '_path' ),
          'data-version'     => $this->get( 'version' ),
          'data-scope'    => $scope,
          'data-base-url' => esc_url( $this->get( 'base' ) )
        ) ) );

        // Standard Admin.
        if( current_filter() == 'admin_print_scripts' && isset( $this->backend ) && $this->backend ) {
          $_args[ 'scope' ] = 'private';
        }

        if( current_filter() == 'admin_print_footer_scripts' && isset( $this->backend ) && $this->backend ) {
        }

        // Admin Customizer Controls.
        if( current_filter() == 'customize_controls_print_scripts' && isset( $this->customizer ) && $this->customizer ) {
          $_args[ 'scope' ] = 'customizer';
        }

        // Login Scripts.
        if( current_filter() == 'login_enqueue_scripts' && isset( $this->login ) && $this->login ) {
          $_args[ 'scope' ] = 'login';
        }

        // Public Frontend.
        if( current_filter() == 'wp_footer' && isset( $this->public ) && $this->public ) {
          $_args[ 'scope' ] = 'public';
        }

        // Frontned Customization Preview.
        if( current_filter() == 'customize_preview_init' && isset( $this->preview ) && $this->preview ) {
          $_args[ 'scope' ] = 'preview';
        }

        $_tag = '';

        foreach( (array) $_args as $key => $value ) {
          $_tag .= '' . $key . '=' . '"' . $value . '" ';
        }

        echo '<script ' . $_tag . "></script>\n";

      }

      /**
       * Serve Scripts.
       *
       * /admin-ajax.php?action=my.model
       *
       * @todo add html_entity_decode() for data strings.
       *
       * @action template_redirect
       * @action admin_init
       */
      function _serve_model() {

        // Generate Action Handler.
        do_action( 'udx:requires', $this );

        // Instance Action Handler.
        do_action( 'udx:requires:' . $this->get( 'id' ), $this );

        // Set Headers.
        add_filter( 'nocache_headers', function ( $headers = array() ) {

          $headers = apply_filters( 'udx:requires:headers', array(
            'Content-Type'    => 'application/javascript; charset=' . get_bloginfo( 'charset' ),
            'X-Frame-Options' => 'SAMEORIGIN',
            'Vary'            => 'Accept-Encoding'
          ));

          return $headers;

        } );

        // Standard Headers.
        nocache_headers();

        // Model Data.
        $data = apply_filters( 'udx:requires:data', array(
          'id'   => $this->get( 'id' ),
          'type' => $this->get( 'type' ),
          'data' => $this->get( 'data' )
        ) );


        // AMD Configuration.
        $config = apply_filters( 'udx:requires:config', array(
          'context' => $this->get( 'context' ),
          'paths'   => $this->get( 'paths' ),
          'deps'    => $this->get( 'deps' ),
          'urlArgs' => $this->get( 'args' ),
          'config'  => $this->get( 'config' )
        ) );

        self::send_script( $this->get( 'id' ), array_filter( $data ), array_filter( $config ) );

      }

      /**
       * Output JSON
       *
       * @param string $id
       * @param array  $data
       * @param array  $config
       */
      public static function send_script( $id = '', $data = array(), $config ) {
        die( 'require.config(' . json_encode( $config ) . ');define("' . $id . '",' . json_encode( $data ) . ');' );
      }

      /**
       * Get Setting.
       *
       * @method get
       *
       * @for Requires
       * @author potanin@UD
       * @since 0.1.1
       */
      public function get( $key, $default = null ) {
        return $this->_settings ? $this->_settings->get( $key, $default ) : null;
      }

      /**
       * Set Setting.
       *
       * @usage
       *
       * @method get
       * @for Requires
       *
       * @author potanin@UD
       * @since 0.1.1
       */
      public function set( $key, $value = null ) {
        return $this->_settings ? $this->_settings->set( $key, $value ) : null;
      }

    }

  }

}