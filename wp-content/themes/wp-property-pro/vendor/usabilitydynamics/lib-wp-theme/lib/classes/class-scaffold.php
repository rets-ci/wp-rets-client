<?php
/**
 * Theme Scaffolding.
 *
 * @author team@UD
 * @version 0.2.0
 * @namespace UsabilityDynamics
 * @module Theme
 * @author potanin@UD
 */
namespace UsabilityDynamics\Theme {

  if( !class_exists( '\UsabilityDynamics\Theme\Scaffold' ) ) {

    /**
     * Scaffold Class
     *
     * @class Scaffold
     * @author potanin@UD
     */
    class Scaffold {

      /**
       * Theme ID.
       *
       * @param $id
       *
       * @var string
       */
      public $id;

      /**
       * Theme Version.
       *
       * @param $version
       *
       * @var string
       */
      public $version;

      /**
       * Theme Text Domain.
       *
       * @param $domain
       *
       * @var string
       */
      public $domain;

      /**
       * Theme Settings.
       *
       * @param $settings
       *
       * @var UsabilityDynamics\Theme\Settings object
       */
      public $settings;

      /**
       * Structure.
       *
       * @param $structure
       *
       * @var string
       */
      public $structure;

      /**
       * AMD Requires Instance.
       *
       * @param $requires
       *
       * @var Object
       */
      public $requires;

      /**
       * Initializes our theme
       *
       * @param array $options
       */
      public function initialize( $options = array() ) {

        if( !$this->id ) {
          _doing_it_wrong( 'UsabilityDynamics\Theme\Scaffold::initialize', 'Theme ID not specified.', $this->get( 'version' ) ? $this->get( 'version' ) : null );
        }

        if( did_action( 'widgets_init' ) ) {
          _doing_it_wrong( 'UsabilityDynamics\Theme\Scaffold::initialize', 'Called too late - should be called before widgets_init hook.', $this->get( 'version' ) );
        }

        $options = (object) Utility::extend( array(
          'domain'    => $this->domain,
          'languages' => get_template_directory() . '/static/languages'
        ), $options );

        // Initialize Settings.
        $this->settings = Settings::define( array(
          'id'      => $this->id,
          'version' => $this->version,
          'domain'  => $this->domain,
          'data'    => array(
            'locations'    => array(
              'modules' => array()
            ),
            '_option_keys' => array(
              'version'  => $options->id . '::version',
              'settings' => $options->id . '::settings',
            )
          )
        ));

        if( is_dir( dirname( __DIR__ ) . '/modules' ) ) {
          $this->modules( dirname( __DIR__ ) . '/modules' );
        }

        // Set Instance Settings.
        $this->set( '_initialize', $options );

        // Set for short-hand referencing.
        $this->set( 'version', $options->version );

        $this->set( '_theme', array(
          'rootPath' => get_theme_root(),
          'absolutePath' => get_stylesheet_directory(),
          'relativePath' => str_replace( WP_CONTENT_DIR, '', get_stylesheet_directory() )
        ));

        add_filter( 'admin_menu', array( $this, 'admin_menu' ) );
        add_filter( 'pre_update_option_rewrite_rules', array( $this, '_update_option_rewrite_rules' ), 1 );
        add_action( 'query_vars', array( $this, '_query_vars' ) );
        add_action( 'template_redirect', array( $this, '_redirect' ), 5 );
        add_filter( 'intermediate_image_sizes_advanced', array( $this, '_image_sizes' ) );

        add_action( 'wp_enqueue_scripts', array( $this, '_enqueue_scripts' ), 500 );
        add_action( 'wp_default_scripts', array( $this, '_default_scripts' ), 15 );

        // Disable Script Printing.
        add_action( 'print_head_scripts', array( $this, '_use_head_scripts' ), 15 );
        add_action( 'print_footer_scripts', array( $this, '_use_footer_scripts' ), 15 );

        // Output Actual Script(s).
        add_action( 'wp_print_scripts', array( $this, '_print_scripts' ), 5 );
        add_action( 'wp_print_footer_scripts', array( $this, '_print_scripts' ), 5 );
        add_action( 'admin_print_scripts', array( $this, '_print_scripts' ), 5 );
        add_action( 'admin_print_footer_scripts', array( $this, '_print_scripts' ), 5 );

        add_action( 'widgets_init', array( $this, '_widgets' ), 100 );
        add_filter( 'post_class', array( $this, '_post_class' ), 100, 4 );

        // @example http://discodonniepresents.com/manage/?debug=debug_rewrite_rules
        if( @$_GET[ 'debug' ] === 'debug_rewrite_rules' ) {
          // die( json_encode( get_option( 'rewrite_rules' ) ) );
        }

        // die( json_encode( get_option( 'rewrite_rules' ) ) );

        //die( json_encode( get_option( 'rewrite_rules' ) ) );
        // Make theme available for translation
        if( is_dir( $options->languages ) ) {
          load_theme_textdomain( $this->domain, $options->languages );
        }

        $this->_upgrade();

      }

      /**
       * Extend WP_Scripts Instance.
       *
       * @param $scripts
       */
      public function _default_scripts( &$scripts ) {

        // Ensure Content URL is valid.
        $scripts->content_url = content_url();

        // Add Extra Theme Directories
        $scripts->default_dirs = array_merge( $scripts->default_dirs, array( trailingslashit( $this->get( '_theme.relativePath' ) . '/scripts' ) ) );

      }

      /**
       * @param string $path
       */
      public function modules( $path = '' ) {

        $_modules = (array) $this->get( 'locations.modules' );

        $_modules = array_merge( $_modules, (array) $path );

        $this->set( 'locations.modules', $_modules );

      }

      /**
       * Determine Post Class based on active sidebars
       * s
       *
       * @param $classes
       * @param $class
       * @param $post_id
       *
       * @return array
       */
      public function _post_class( $classes, $class, $post_id ) {

        if( is_active_sidebar( 'left-sidebar' ) && is_active_sidebar( 'right-sidebar' ) ) {
          $classes[ ] = 'col-md-6 col-md-pull-3 section';
        }

        if( is_active_sidebar( 'left-sidebar' ) && !is_active_sidebar( 'right-sidebar' ) ) {
          $classes[ ] = 'col-md-9 section';
        }

        if( !is_active_sidebar( 'left-sidebar' ) && is_active_sidebar( 'right-sidebar' ) ) {
          $classes[ ] = 'col-md-9 col-md-pull-3 section';
        }

        if( !is_active_sidebar( 'left-sidebar' ) && !is_active_sidebar( 'right-sidebar' ) ) {
          $classes[ ] = 'col-md-12 section';
        }

        return $classes;
      }

      /**
       * Register and Enqueue Footer Scripts.
       *
       * @param array $options
       */
      public function scripts( $options = array() ) {

        // wp_deregister_script( 'jquery' );
        // wp_register_script( 'jquery', 'http://cdn.udx.io/vendor/jquery.js', array(), '1.10.2', true );

        // Register app.require as a header script.
        if( !wp_script_is( 'app.require', 'registered' ) ) {
          // wp_register_script( 'app.require', 'http://cdn.udx.io/udx.requires.js', array(), $this->get( 'version' ), false );
        }

        foreach( (array) $options as $name => $_settings ) {

          // Register
          $settings = array(
            'name'    => $name,
            'url'     => '',
            'version' => $this->get( 'version' ),
            'footer'  => true,
            'deps'    => array()
          );

          if( is_array( $_settings ) ) {
            $settings = (object) Utility::extend( $settings, $_settings );
          }

          if( is_string( $_settings ) ) {

            $settings = (object) Utility::extend( $settings, array(
              'name'    => $name,
              'url'     => $_settings,
              'version' => $this->get( 'version' ),
              'deps'    => array(  ),
              'footer'  => true
            ));

          }

          // Store Script Settings.
          $this->set( '_scripts', array( $settings->name => $settings ) );

        }

      }

      /**
       * @param array $widget_areas
       *
       * @return array|bool
       */
      public function sidebars_widgets( $widget_areas = array() ) {

        if( empty( $widget_areas ) ) {
          return false;
        }

        $widget_areas = (array) $widget_areas;

        if( method_exists( '\UsabilityDynamics\Theme\WidgetConditions', 'sidebars_widgets' ) ) {
          return \UsabilityDynamics\Theme\WidgetConditions::sidebars_widgets( $widget_areas );
        }

        if( method_exists( '\Jetpack_Widget_Conditions', 'sidebars_widgets' ) ) {
          return \Jetpack_Widget_Conditions::sidebars_widgets( $widget_areas );
        }

        return null;

      }

      /**
       * Register Widget Areas.
       *
       */
      public function _widgets() {

        if( did_action( 'widgets_init' ) && !current_filter( 'widgets_init' ) ) {
          _doing_it_wrong( 'UsabilityDynamics\Theme\Scaffold::initialize', 'Called too late - should be called before widgets_init hook.', $this->get( 'version' ) );
        }

        foreach( is_array( $this->get( '_sidebars' ) ) ? $this->get( '_sidebars' ) : array() as $_key => $settings ) {

          register_sidebar( array(
            'id'            => '' . ( isset( $settings[ 'id' ] ) ? $settings[ 'id' ] : $_key . '' ),
            'name'          => $settings[ 'title' ],
            'description'   => $settings[ 'description' ],
            'class'         => isset( $settings[ 'class' ] ) ? $settings[ 'class' ] : 'module',
            'before_widget' => isset( $settings[ 'before' ] ) ? $settings[ 'before' ] : '<div class="module widget %1$s %2$s"><div class="module-inner">',
            'after_widget'  => isset( $settings[ 'after' ] ) ? $settings[ 'after' ] : '</div></div>',
            'before_title'  => isset( $settings[ 'before.title' ] ) ? $settings[ 'before.title' ] : '<h3 class="module-title">',
            'after_title'   => isset( $settings[ 'after.title' ] ) ? $settings[ 'after.title' ] : '</h3>',
          ) );

        }

      }

      /**
       * Enable or Disable Inline Header JavaScript.
       *
       */
      public function _use_head_scripts() {
        return true;
      }

      /**
       * Enable or Disable Inline Footer JavaScript.
       *
       * Prints the scripts that were queued for the footer or too late for the HTML head.
       * Footer scripts are those added to group "1" (header scripts are in group 0)
       *
       */
      public function _use_footer_scripts() {
        return true;
      }

      /**
       *
       * <script type="text/javascript" src="_.pagespeed.jo.tXBSxcB8mn.js"></script>
       */
      public function _print_scripts() {
        global $wp_scripts;

        // Do nothing if script handling is not enabled.
        if( !$this->get( 'scripts.print' ) ) {
          return;
        }

        // Header Scripts. NOT LOAD REQUIREJS ON BACK END TO PREVENT THE CONFLICT WITH JETPACK
        if( current_filter() === 'wp_print_scripts' && !is_admin() ) {
          /* _theme_app_config variable should contain only neccessary dynamic vars. */
          echo '<script type="text/javascript">var _theme_app_config = ' . json_encode( apply_filters( 'udx:theme:script:config', array() ) ) . '</script>';
          echo '<script type="text/javascript" pagespeed_no_defer="" data-main="/assets/scripts/app.config" data-version="' . $this->get( 'version' )  . '" src="http://cdn.udx.io/udx.requires.js?ver=' . $this->get( 'version' ) . '"></script>' . "\n";
        }

        // Footer Scripts.
        if( current_filter() === 'wp_print_footer_scripts' ) {}

        if( current_filter() === 'admin_print_scripts' ) {}

        if( current_filter() === 'admin_print_footer_scripts' ) {}

      }

      /**
       *
       *
       */
      public function _enqueue_scripts() {
        global $wp_scripts;

        // Enqueue All AMD Scripts
        foreach( (array) $this->get( '_scripts' ) as $_name => $settings ) {
          wp_register_script( $settings->name, $settings->url, $settings->deps, $settings->get( 'version' ), $settings->footer );
          wp_enqueue_script( $settings->name );
        }

      }

      /**
       * Handle Style Rewrites.
       *
       * @param array $options
       */
      public function styles( $options = array() ) {

        foreach( (array) $options as $name => $_settings ) {

          $settings = array(
            'name'    => $name,
            'url'     => '',
            'version' => $this->get( 'version' ),
            'media'   => 'all',
            'deps'    => array()
          );

          if( is_array( $_settings ) ) {
            $settings = (object) Utility::extend( $settings, $_settings );
          }

          if( is_string( $_settings ) ) {

            $settings = (object) Utility::extend( $settings, array(
              'name'    => $name,
              'url'     => $_settings,
              'version' => $this->get( 'version' ),
              'media'   => 'all',
              'deps'    => array()
            ) );

          }

          // Store Script Settings.
          $this->set( '_styles', array( $settings->name => $settings ) );

          // Register Style.
          wp_register_style( $settings->name, $settings->url, $settings->deps, method_exists( $this, 'get' ) ? $this->get( 'version' ) : '', $settings->media );

        }

      }

      /**
       * Handle Font Rewrties.
       *
       * @param array $options
       */
      public function fonts( $options = array() ) {

      }

      /**
       * Configures API/RPC Methods.
       *
       * @param array $options
       */
      public function api( $options = array() ) {

      }

      /**
       * Declare UDX Models / Scripts.
       *
       * * Adds cdn.udx.io script tag to <head>
       *
       * @param array $args
       */
      public function requires( $args = array() ) {

        $args = Utility::defaults( $args, array(
          'bootstrap' => true
        ) );

        $this->requires = new Requires( $args );

      }

      /**
       * Configure Carrington Builder.
       *
       * @example
       *
       *      $this->carrington->add_module_style( 'polaroid', home_url( '/images/style-polaroid.jpg' ), 'cfct_module_callout' );
       *
       * @param array $args
       */
      public function carrington( $args = array() ) {

        $args = Utility::defaults( $args, array(
          'bootstrap' => true
        ) );

        $this->carrington = new Carrington( $args );

        //$this->carrington->template->register_type('module', $classname, $args);
        //$this->carrington->template->deregister_type('module', $classname);
        //$this->carrington->template->register_type('row', $classname);
        //$this->carrington->template->deregister_type('row', $classname);
        //cfct_module_options::get_instance()->register($classname);
        //cfct_module_options::get_instance()->deregister($classname);

      }

      /**
       * Add Header Tag.
       *
       *
       */
      public function head( $options = array() ) {

        // Save "head" options.
        $this->set( '_head', (object) $options );

        add_action( 'wp_head', array( $this, '_head_tags' ) );

      }

      /**
       * Print Head Tags.
       *
       * @since 0.2.0
       * @author potanin@UD
       * @method wp_head
       */
      public function _head_tags() {

        $output = array();

        foreach( (array) $this->get( '_head' ) as $data ) {

          $attributes = array();

          foreach( (array) $data as $key => $value ) {
            if( $key != 'tag' ) {
              $attributes[ ] = $key . '="' . $value . '"';
            }
          }

          if( $data[ 'tag' ] === 'meta' ) {
            $output[ ] = '<meta ' . implode( ' ', $attributes ) . ' />';
          }

          if( $data[ 'tag' ] === 'link' ) {
            $output[ ] = '<link ' . implode( ' ', $attributes ) . ' />';
          }

          if( $data[ 'tag' ] === 'script' ) {
            $output[ ] = '<script ' . implode( ' ', $attributes ) . '></script>';
          }

        }

        echo implode( "\n", $output );

      }

      /**
       * Returns post data including meta data specified in structure
       *
       * @author peshkov@UD
       */
      public function get_post( $post_id, $filter = false ) {

        $post = get_post( $post_id, ARRAY_A, $filter );

        if( $post && !is_wp_error( $post ) ){

          /** This is a legacy check against the schema, we should support both types, so go ahead and get structure */
          $structure = (array) $this->structure;
          if( isset( $structure[ 'post_types' ] ) && is_array( $structure[ 'post_types' ] ) && isset( $structure[ 'post_types' ][ $post[ 'post_type' ] ] ) ){
            /** New format */
            $structure = $structure[ 'post_types' ][ $post[ 'post_type' ] ];
          }elseif( isset( $structure[ $post[ 'post_type' ] ] ) ){
            /** Legacy format */
            $structure = $structure[ $post[ 'post_type' ] ];
          }else{
            $structure = false;
          }

          /** Move on and get the data */
          if( $structure ){
            // Get meta data
            foreach( (array) $structure[ 'meta' ] as $key ) {
              $post[ $key ] = get_post_meta( $post_id, $key, false );
              if( is_array( $post[ $key ] ) ) {
                if( count( $post[ $key ] ) == 1 ) {
                  $post[ $key ] = array_shift( $post[ $key ] );
                } else if( empty( $post[ $key ] ) ) {
                  $post[ $key ] = '';
                }
              }
            }
          }
        }

        return $post;
      }

      /**
       * Display Nav Menu.
       *
       * @example
       *
       *      // Show Primary Navigation with depth of 2
       *      wp_festival()->nav( 'primary', 2 );
       *
       *      // Show My Menu in footer location.
       *      wp_festival()->nav( 'my-menu', 'footer' );
       *
       * @param $name {String|Integer|Null}
       * @param $location {String|Integer|Null}
       *
       * @return bool|mixed|string|void
       */
      public function nav( $name = null, $location = null ) {

        return wp_nav_menu( apply_filters( "udx:theme:nav_menu:{$name}", array(
          'theme_location' => is_string( $location ) ? $location : $name,
          'depth'          => is_numeric( $location ) ? $location : 2,
          'menu_class'     => implode( ' ', array_filter( array( $this->id . '-menu', 'nav', 'navbar-nav', $name, is_string( $location ) ? $location : '' ) ) ),
          'fallback_cb'    => false,
          'container'      => false,
          'items_wrap'     => '<ul data-menu-name="%1$s" class="%2$s">%3$s</ul>',
          'walker'         => new \UsabilityDynamics\Theme\Nav_Menu,
          'echo'           => false
        ) ) );

      }

      /**
       * Add "Sections" link to Appearance menu.
       *
       * @todo Figure out a way to keep the Appearance menu open while editing a menu.
       *
       * @method admin_menu
       * @param $menu
       */
      public function admin_menu( $menu ) {
        global $submenu;

        if( current_theme_supports( 'asides' ) ) {
          $submenu[ 'themes.php' ][ 20 ] = array( __( 'Asides' ), 'edit_theme_options', 'edit.php?post_type=_aside' );
        }

      }

      /**
       * Render Section
       *
       * Can find and render Widget Area (sidebar) or Dynamic Aside section.
       *
       * @param null  $name
       * @param array $args
       *
       * @return bool|null
       */
      public function section( $name = null, $args = array() ) {
        global $post, $wp_registered_sidebars, $wp_registered_widgets;

        $_sections = $this->get( '_sections' );

        if( !isset( $_sections ) || !isset( $_sections[ $name ] ) ) {
          return null;
        }

        /* Determine if section has been disabled for the current page */
        $disabled_sections = get_post_meta( $post->ID, 'disabledSections' );
        if( in_array( $name, $disabled_sections ) ) {
          return null;
        }

        // Widget / Sidebar Area.
        if( isset( $_sections[ $name ][ 'sidebar' ] ) && is_active_sidebar( $name ) ) {

          ob_start();
          dynamic_sidebar( $name );
          $content = ob_get_clean();

          if( $name === 'right-sidebar' && !is_active_sidebar( 'left-sidebar' ) ) {
            $_sections[ $name ][ 'options' ][ 'class' ] = $_sections[ $name ][ 'options' ][ 'class' ] . ' col-md-push-9';
          }

          if( $name === 'right-sidebar' && is_active_sidebar( 'left-sidebar' ) ) {
            $_sections[ $name ][ 'options' ][ 'class' ] = $_sections[ $name ][ 'options' ][ 'class' ] . ' col-md-push-6';
          }

          if( $name === 'left-sidebar' && is_active_sidebar( 'right-sidebar' ) ) {
            $_sections[ $name ][ 'options' ][ 'class' ] = $_sections[ $name ][ 'options' ][ 'class' ] . ' ';
          }

          echo '<section class="' . ( isset( $_sections[ $name ][ 'options' ][ 'class' ] ) ? $_sections[ $name ][ 'options' ][ 'class' ] : 'section sidebar section-' . $name ) . '" data-section-type="sidebar" data-section="' . $name . '">' . $content . '</section>';

        }

        // Dynamic Aside Section.

        $args = (object) wp_parse_args( $args, $default = array(
          'type'           => '_aside',
          'class'          => 'modular-aside',
          'more_link_text' => null,
          'strip_teaser'   => null,
          'return'         => true
        ) );

        // Get all asides assigned to current section/location.
        $custom_loop = get_posts( array(
          'post_type'   => '_aside',
          'post_status' => 'publish',
          'meta_key'    => 'asideLocation',
          'meta_value'  => $name
        ) );

        if( empty( $custom_loop ) || !is_array( $custom_loop ) ) {
          return null;
        }

        $_asides = array();

        foreach( $custom_loop as $_post ) {
          $_asides[ ] = self::aside( $_post->ID, $args );
        }

        if( !empty( $_asides ) ) {
          $_requires = (!empty( $_sections[ $name ][ 'options' ] ) && !empty( $_sections[ $name ][ 'options' ][ 'requires' ] )) ? $_sections[ $name ][ 'options' ][ 'requires' ] : '';
          echo '<section class="section section-' . $name . '" data-section="' . $name . '" data-requires="' . $_requires . '"><div class="container">' . implode( '', $_asides ) . '</div></section>';
        }

      }

      /**
       * Get a Content Section.
       *
       * If section can not be found, will attempt to find template of same name in /templates directory.
       *
       * @example
       *
       *        wp_festival()->aside( 'header' );
       *
       * @param null  $name
       * @param array $args
       *
       * @return mixed|null
       */
      public function aside( $name = null, $args = array() ) {
        global $post;

        $args = (object) wp_parse_args( $args, $default = array(
          'type'           => '_aside',
          'class'          => 'modular-aside',
          'more_link_text' => null,
          'strip_teaser'   => null,
          'return'         => false,
        ) );

        // Preserve Post.
        $_post = $post;

        // Using query_posts() will not work because we must not change the global query.
        $custom_loop = new \WP_Query( array_filter( array(
          'page_id'   => is_numeric( $name ) ? $name : null,
          'name'      => is_string( $name ) ? $name : null,
          'post_type' => $args->type
        ) ) );

        if( $custom_loop->have_posts() ) {
          while( $custom_loop->have_posts() ) {
            $custom_loop->the_post();
            $title   = get_post()->post_name;
            $content = get_the_content( $args->more_link_text, $args->strip_teaser );
            $content = apply_filters( 'the_content', $content );
            $content = str_replace( ']]>', ']]&gt;', $content );
          }
        }

        // Try to locale regular aside.
        if( !isset( $content ) || !$content ) {
          ob_start();
          get_template_part( 'templates/aside/' . $name, get_post_type() );
          $content = ob_get_clean();
        }

        $content = apply_filters( $this->id . ':aside', isset( $content ) ? '<aside class="' . $args->class . ' ' . $title . ' aside-' . $name . '" data-aside="' . $name . '">' . $content . '</aside>' : null, $name );

        // Return post.
        $post = $_post;

        if( $args->return ) {
          return $content;
        } else {
          echo $content;
        }

      }

      /**
       * Configure Activation, Deactivation, Installation and Upgrade Handling.
       *
       * @param array $options
       */
      public function upgrade( $options = array() ) {

      }

      /**
       * Enables Customizer Interface for Settings.
       *
       * @param array $options
       */
      public function customizer( $options = array() ) {

        // @temp
        add_action( 'customize_register', function ( $wp_customize ) {
          $wp_customize->remove_section( 'title_tagline' );
          $wp_customize->remove_section( 'static_front_page' );
          $wp_customize->remove_section( 'nav' );
        } );

        foreach( (array) $options as $key => $config ) {
          // add_theme_support( $key );
        }

      }

      /**
       * Register Menus
       *
       * @param array $options
       */
      public function menus( $options = array() ) {

        foreach( (array) $options as $name => $config ) {

          if( $config && is_array( $config ) ) {
            register_nav_menu( $name, $config[ 'name' ] );
          }

          if( !$config || is_null( $config ) ) {
            unregister_nav_menu( $name );
          }

        }

      }

      /**
       * Enables Theme Support for Features.
       *
       * @param array $options
       */
      public function supports( $options = array() ) {

        foreach( (array) $options as $feature => $config ) {

          if( $config && is_array( $config ) ) {
            add_theme_support( $feature, $config );
          }

          if( !$config || is_null( $config ) ) {
            remove_theme_support( $feature );
          }

        }

      }

      /**
       * Add Dynamic Aside Sections.
       *
       * @param array $options
       */
      public function sections( $options = array() ) {
        global $_wp_theme_features, $wp_post_types;

        if( !isset( $_wp_theme_features[ 'aside-sections' ] ) ) {
          add_theme_support( 'aside-sections', $options );
        }

        $_locations = array();
        $_sidebars  = array();

        foreach( (array) $options as $_key => $_settings ) {

          if( isset( $_settings[ 'options' ] ) && is_array( $_settings[ 'options' ] ) ) {

            if( isset( $_settings[ 'sidebar' ] ) && $_settings[ 'options' ] ) {
              $_sidebars[ $_key ] = $_settings;
            }

          }

          if( !isset( $_settings[ 'sidebar' ] ) || !$_settings[ 'sidebar' ] ) {
            $_locations[ $_key ] = isset( $_settings[ 'title' ] ) ? $_settings[ 'title' ] : $_key;
          }

        }

        // Store all defined Sections.
        $this->set( '_sections', $options );

        // Store Sidebars for later registration.
        $this->set( '_sidebars', $_sidebars );

        // Register Aside Post Type.
        \UsabilityDynamics\Structure::define( array(
          'types' => array(
            '_aside' => array(
              'data' => array(
                'label'               => __( 'Aside' ),
                'capability_type'     => 'page',
                'show_in_menu'        => false,
                'show_ui'             => true,
                'exclude_from_search' => true,
                'publicly_queryable'  => false,
                'public'              => false,
                'can_export'          => true,
                'supports'            => array( 'title', 'editor', 'revisions', 'post-formats' )
              ),
              'meta' => array(
                'general' => array( 'fields' => array( 'asideLocation' ) )
              )
            ),
            'page' => array(
              'meta' => array(
                'disabled_content' => array( 'fields' => array( 'disabledSections', 'disabledNavMenu' ) )
              )

            ),
          ),
          'meta'  => array(
            'asideLocation' => array(
              "name"        => __( "Sections" ),
              "description" => __( "Sections to display aside in." ),
              "type"        => "checkbox_list",
              "multiple"    => true,
              "options"     => $_locations
            ),
            'disabledSections' => array(
              "name"        => __( "Sections (Asides)" ),
              "desc" => __( "Check section to remove it from the current page view." ),
              "type"        => "checkbox_list",
              "multiple"    => true,
              "options"     => $_locations
            ),
            'disabledNavMenu' => array(
              "name"        => __( "Navigation Menu" ),
              "desc" => __( "Check menu to remove it from the current page view." ),
              "type"        => "checkbox_list",
              "multiple"    => true,
              "options"     => array(
                'top' => __( "Primary (Top)" ),
                'menufication' => __( "Menufication (Mobile)" ),
              ),
            ),
          )
        ) );

      }

      /**
       * Configures Image Sizes.
       *
       * @param array $options
       *
       * @return array
       */
      public function media( $options = array() ) {
        global $_wp_additional_image_sizes;

        foreach( (array) $options as $name => $settings ) {

          if( $name === 'post-thumbnail' ) {
            add_theme_support( 'post-thumbnails' );
          }

          $_wp_additional_image_sizes[ $name ] = array_filter( array(
            'description' => isset( $settings[ 'description' ] ) ? $settings[ 'description' ] : '',
            'post_types'  => isset( $settings[ 'post_types' ] ) ? $settings[ 'post_types' ] : array( 'page' ),
            'width'       => isset( $settings[ 'width' ] ) ? absint( $settings[ 'width' ] ) : null,
            'height'      => isset( $settings[ 'height' ] ) ? absint( $settings[ 'height' ] ) : null,
            'crop'        => isset( $settings[ 'crop' ] ) ? (bool) $settings[ 'crop' ] : false
          ) );

        }

        return $options;

      }

      /**
       * Return Post Type Image Sizes
       *
       * @todo Take thumbnail, large and medium into account.
       *
       * @filter intermediate_image_sizes_advanced
       *
       * @param $_sizes
       *
       * @return array
       */
      public function _image_sizes( $_sizes ) {
        global $_wp_additional_image_sizes;

        $_available_sizes = $_wp_additional_image_sizes;

        $_available_sizes[ 'thumbnail' ] = array(
          'width'  => get_option( "thumbnail_size_w" ),
          'height' => get_option( "thumbnail_size_h" ),
          'crop'   => get_option( "thumbnail_crop" )
        );

        $_available_sizes[ 'large' ] = array(
          'width'  => get_option( "large_size_w" ),
          'height' => get_option( "large_size_h" ),
          'crop'   => get_option( "large_crop" )
        );

        $_available_sizes[ 'medium' ] = array(
          'width'  => get_option( "medium_size_w" ),
          'height' => get_option( "medium_size_h" ),
          'crop'   => get_option( "medium_crop" )
        );

        // Upload attachment Unassociated with post.
        if( !isset( $_POST[ 'action' ] ) && isset( $_POST[ 'post_id' ] ) && $_POST[ 'post_id' ] == 0 ) {
          return $_sizes;
        }

        // Uploading image to post.
        if( isset( $_POST[ 'action' ] ) && $_POST[ 'action' ] === 'upload-attachment' && $_POST[ 'post_id' ] ) {

          $_allowed = array();

          foreach( (array) $_available_sizes as $size => $settings ) {

            // Post type sizes not configured, allow by deafult.
            if( !isset( $settings[ 'post_types' ] ) ) {
              $_allowed[ $size ] = $settings;
            }

            // Size Allowed.
            if( isset( $settings[ 'post_types' ] ) && in_array( $_post_type, (array) $settings[ 'post_type' ] ) ) {
              $_allowed[ $size ] = $settings;
            }

          }

          // Return Image Sizes for Post Type.
          return $_allowed;

        }

        return $_sizes;

      }

      /**
       * Set Theme Option.
       *
       * @param $key
       * @param $value
       *
       * @return \UsabilityDynamics\Settings
       */
      public function set( $key = null, $value = null ) {
        return $this->settings->set( $key, $value );
      }

      /**
       * Get Theme Option.
       *
       * @param $key
       * @param $default
       *
       * @return \UsabilityDynamics\type
       */
      public function get( $key = null, $default = null ) {

        if( isset( $this->settings ) ) {
          return $this->settings->get( $key, $default );
        }

      }

      /**
       * Modify Rewrite Ruels on Save.
       *
       * @param $rules
       *
       * @internal param $value
       *
       * @return array
       */
      public function _update_option_rewrite_rules( $rules ) {

        // Define New Rules.
        $new_rules = array(
          'assets/styles/fonts/([^/]+)(.woff|.ttf|.svg|.eot)?$' => 'index.php?is_asset=1&asset_type=font&asset_slug=$matches[1]',
          'assets/styles/([^/]+)?$'                             => 'index.php?is_asset=1&asset_type=style&asset_slug=$matches[1]',
          'assets/images/([^/]+)?$'                             => 'index.php?is_asset=1&asset_type=image&asset_slug=$matches[1]',
          'assets/scripts/([^/]+)?$'                            => 'index.php?is_asset=1&asset_type=script&asset_slug=$matches[1]',
          'assets/models/([^/]+)(.json|.js)?'                  => 'index.php?is_asset=1&asset_type=model&asset_slug=$matches[1]'
        );

        // Return concatenated rules.
        $new = array_merge( (array) $new_rules, (array) $rules );

        return $new;

      }

      /**
       * Modify Query Rules.
       *
       * @param $query_vars
       *
       * @return array
       */
      public function _query_vars( $query_vars ) {

        $query_vars[ ] = 'asset_type';
        $query_vars[ ] = 'asset_slug';
        $query_vars[ ] = 'is_asset';

        return $query_vars;

      }

      /**
       * Handle Asset Redirection.
       *
       * Redirects asset/image requests back to the theme's static file directory without exposing the path to the theme to frontend.
       *
       * http://capitaldealsonline.loc/assets/scripts/app.main.js
       *  -> /home/cdo/public_html/themes/wp-yukon/static/scripts/app.js
       *
       * @param $query_vars
       */
      public function _redirect( $query_vars ) {
        global $wp_query;

        if( !$wp_query->get( 'is_asset' ) ) {
          return;
        }

        switch( get_query_var( 'asset_type' ) ) {

          case 'style':
            $_path = apply_filters( 'udx:theme:asset:path', 'styles', 'style', $this );
          break;

          case 'font':
            $_path = apply_filters( 'udx:theme:asset:path', 'styles/fonts', 'font', $this );
          break;

          case 'script':
            $_path = apply_filters( 'udx:theme:asset:path', 'scripts', 'script', $this );
          break;

          case 'image':
            $_path = apply_filters( 'udx:theme:asset:path', 'images', 'image', $this );
          break;

        }

        // Compute Extension if one is needed.
        $_extension = pathinfo( get_query_var( 'asset_slug' ), PATHINFO_EXTENSION ) ? '' : '.' . pathinfo( parse_url( $_SERVER[ 'REQUEST_URI' ], PHP_URL_PATH ), PATHINFO_EXTENSION );

        if( is_file( $_path = trailingslashit( get_stylesheet_directory() ) . trailingslashit( isset( $_path ) ? $_path : '' ) . get_query_var( 'asset_slug' )  . $_extension ) ) {
          $_data = file_get_contents( $_path );
        }

        // Data Filter.
        if( get_query_var( 'asset_slug' ) ) {
          $_data = apply_filters( 'udx:theme:asset:' . get_query_var( 'asset_type' ) . ':' . get_query_var( 'asset_slug' ), isset( $_data ) ? $_data : null, get_query_var( 'asset_slug' ) );
        }

        // Set to bypass caching.
        $wp_query->is_attachment = true;
        $wp_query->is_asset      = true;

        if( isset( $_data ) && get_query_var( 'asset_type' ) === 'script' ) {
          $this->_serve_public( 'script', get_query_var( 'asset_slug' ), $_data );
        }

        if( isset( $_data ) && get_query_var( 'asset_type' ) === 'font' ) {
          $this->_serve_public( 'font', get_query_var( 'asset_slug' ), $_data );
        }

        if( isset( $_data ) && get_query_var( 'asset_type' ) === 'image' ) {
          $this->_serve_public( 'image', get_query_var( 'asset_slug' ), $_data );
        }

        if( isset( $_data ) && get_query_var( 'asset_type' ) === 'style' ) {
          $this->_serve_public( 'style', get_query_var( 'asset_slug' ), $_data );
        }

        if( isset( $_data ) && get_query_var( 'asset_type' ) === 'model' ) {
          $this->_serve_public( 'model', get_query_var( 'asset_slug' ), $_data );
        }

        // Stop Request. (willl break wp-amd);
        // header( "Cache-Control: no-cache" );
        // header( "HTTP/1.0 404 Not Found" );
        // die();

      }

      /**
       * Serve Public Assets.
       *
       *
       * @example
       *
       *    add_filter( 'udx:theme:public:script', 'custom script content' );
       *    add_filter( 'udx:theme:public:style', 'custom script content' );
       *    add_filter( 'udx:theme:public:model', 'custom script content' );
       *
       * @param string $type
       * @param        $name
       * @param string $data
       */
      private function _serve_public( $type = '', $name, $data = '' ) {

        // Configure Headers.
        $headers = apply_filters( 'udx:theme:public:' . $type . 'headers', array(
            'Cache-Control'   => 'public',
            'Pragma'          => 'cache',
            'X-Frame-Options' => 'SAMEORIGIN',
            'Vary'            => 'Accept-Encoding'
          ) );

        if( $type === 'script' ) {
          $headers[ 'Content-Type' ] = isset( $headers[ 'Content-Type' ] ) && $headers[ 'Content-Type' ] ? $headers[ 'Content-Type' ] : 'application/javascript; charset=' . get_bloginfo( 'charset' );
        }

        if( $type === 'style' ) {
          $headers[ 'Content-Type' ] = isset( $headers[ 'Content-Type' ] ) && $headers[ 'Content-Type' ] ? $headers[ 'Content-Type' ] : 'text/css; charset=' . get_bloginfo( 'charset' );
        }

        if( $type === 'image' ) {
          $headers[ 'Content-Type' ] = isset( $headers[ 'Content-Type' ] ) && $headers[ 'Content-Type' ] ? $headers[ 'Content-Type' ] : 'image/png; charset=' . get_bloginfo( 'charset' );
        }

        if( $type === 'model' ) {
          $headers[ 'Content-Type' ] = isset( $headers[ 'Content-Type' ] ) && $headers[ 'Content-Type' ] ? $headers[ 'Content-Type' ] : 'application/json; charset=' . get_bloginfo( 'charset' );
        }

        // Set Headers.
        foreach( (array) $headers as $_key => $field_value ) {
          @header( "{$_key}: {$field_value}" );
        }

        if( is_array( $data ) || is_object( $data ) ) {
          $data = 'define(' . json_encode( $data ) . ');';
        }

        // Output Data.
        die( $data );

      }

      /**
       * Handles Theme Activation.
       *
       */
      private function _activate() {

      }

      /**
       * Handles Theme Deactivation.
       *
       */
      private function _deactivate() {

      }

      /**
       * Handles Theme Installation.
       *
       */
      private function _install() {

        if( !$this->get( 'version' ) ) {
          return;
        }

        // Update installed verison, flush if successful.
        if( update_option( $this->get( '_option_keys.version' ), $this->get( 'version' ) ) ) {

          // Flush Rules.
          flush_rewrite_rules();

        }

        // wp_die( 'installed' );

      }

      /**
       * Handles Theme Upgrades.
       *
       */
      private function _upgrade() {

        // Get Installed Version.
        $_installed = get_option( $this->get( '_option_keys.version' ) );

        // Not Instlled.
        if( !$_installed ) {
          $this->_install();
        }

        // Upgrade Needed.
        if( version_compare( $this->get( 'version' ), $_installed, '>' ) ) {

          // Update installed verison, and then flush.
          if( update_option( $this->get( '_option_keys.version' ), $this->get( 'version' ) ) ) {
            flush_rewrite_rules();
          }

          // wp_die( 'upgrded' );

        }

      }

      /**
       * Uses back-trace to figure out which sidebar was called from the sidebar.php file
       *
       * WordPress does not provide an easy way to figure out the type of sidebar that was called from within the sidebar.php file, so we backtrace it.
       *
       * @author potanin@UD
       */
      public function detect_sidebar_type() {

        $backtrace = debug_backtrace();

        if( !is_array( $backtrace ) ) {
          return false;
        }

        foreach( (array) $backtrace as $item ) {

          if( $item[ 'function' ] == $this->id . '_widget_area' ) {
            return $item[ 'args' ][ 0 ];
          } elseif( $item[ 'function' ] == 'get_sidebar' ) {
            return $item[ 'args' ][ 0 ];
          }

        }

        return false;

      }

      /**
       * Returns path to page's template
       *
       * @param bool $basename
       *
       * @return string
       * @author Usability Dynamics
       * @since 0.1.0
       */
      public function get_query_template( $basename = true ) {
        $object = get_queried_object();

        if( is_404() && $template = get_404_template() ) :
        elseif( is_search() && $template = get_search_template() ) :
        elseif( is_tax() && $template = get_taxonomy_template() ) :
        elseif( is_front_page() && $template = get_front_page_template() ) :
        elseif( is_home() && $template = get_home_template() ) :
        elseif( is_attachment() && $template = get_attachment_template() ) :
        elseif( is_single() && $template = get_single_template() ) :
        elseif( is_page() && $template = get_page_template() ) :
        elseif( is_category() && $template = get_category_template() ) :
        elseif( is_tag() && $template = get_tag_template() ) :
        elseif( is_author() && $template = get_author_template() ) :
        elseif( is_date() && $template = get_date_template() ) :
        elseif( is_archive() && $template = get_archive_template() ) :
        elseif( is_comments_popup() && $template = get_comments_popup_template() ) :
        elseif( is_paged() && $template = get_paged_template() ) :
        else : $template = get_index_template();
        endif;

        $template = apply_filters( 'template_include', $template );

        if( $basename ) {
          $template = str_replace( '.php', '', basename( $template ) );
        }

        return $template;
      }

      /**
       * Returns specific schema from file.
       * Contains: post types, meta, taxonomies.
       *
       * @author peshkov@UD
       */
      public function get_schema( $path = '/static/schemas/schema.structure.json', $l10n = array() ) {
        if( file_exists( $file = get_stylesheet_directory() . $path ) ) {
          return (array)\UsabilityDynamics\Utility::l10n_localize( json_decode( file_get_contents( $file ), true ), $l10n );
        }
        return array();
      }

    }

  }

}