<?php
/**
 * Theme Customizer.
 *
 * @author team@UD
 * @version 0.2.4
 * @namespace UsabilityDynamics
 * @module Theme
 * @author potanin@UD
 * @author peshkov@UD
 */
namespace UsabilityDynamics\Theme {

  if( !class_exists( '\UsabilityDynamics\Theme\Customizer' ) ) {

    /**
     * Customizer Class
     *
     * @class Customizer
     * @author potanin@UD
     */
    class Customizer {

      public $query_vars = array(
        'theme_custom_asset'
      );

      public $args = array();

      public $settings = array();

      /**
       * Inits all neccessary hooks
       *
       * Note: must be called in child class, it it has constructor too
       */
      public function __construct( $args = array() ) {

        $this->args = wp_parse_args( $args, array(
          'version' => '1.0',
          'permalink' => 'assets/themecustomizer.css',
          'exclude' => array(), // extra sections which will be removed from Customizer
          'sections' => array(),
          'settings' => array(),
        ) );

        //** Prepare settings */
        $settings = array();
        foreach( (array)$this->args[ 'settings' ] as $setting ) {
          if( $setting = $this->prepare_setting( $setting ) ) {
            $settings[] = $setting;
          }
        }
        $this->args[ 'settings' ] = $settings;
        
        //echo "<pre>"; print_r( $this->args[ 'settings' ] ); echo "</pre>"; die();

        //** rewrite and respond */
        add_action( 'query_vars', array( &$this, 'query_vars' ) );
        add_filter( 'pre_update_option_rewrite_rules', array( &$this, 'update_option_rewrite_rules' ), 1 );
        add_filter( 'template_include', array( &$this, 'return_asset' ), 1, 1 );
        add_action( 'wp_enqueue_scripts', array( &$this, 'register_asset' ), 100 );
        //** Customizer addons */
        add_action( 'customize_register', array( &$this, 'register' ), 100 );
        add_action( 'customize_preview_init', array( &$this, 'admin_scripts' ), 100 );
      }

      /**
       * New query vars
       *
       * @param type $query_vars
       * @return string
       */
      public function query_vars( $query_vars ) {
        return array_unique( array_merge( $query_vars, $this->query_vars ) );
      }

      /**
       * Dynamic Rules
       *
       * @param type $current
       * @return type
       */
      public function update_option_rewrite_rules( $rules ) {
        $rules = array( '^' . $this->get( 'permalink' ) => 'index.php?' . $this->query_vars[0] . '=1' ) + $rules;
        return $rules;
      }

      /**
       * Registers asset with all selected dependencies
       *
       * @param array $args The arguments
       * 
       * @arg array $deps Optional. The dependencies
       * @arg bool $register Optional. Should we register the script? 
       * @arg bool $enqueue Optional. Should we enqueue the script?
       * @arg bool $force Optional. Force this, even if it's already enqueued/registered
       *
       */
      public function register_asset( $args = array() ) {
        extract( wp_parse_args( $args, array(
          'deps' => array(),
          'register' => true,
          'enqueue' => true,
          'force' => false
        ) ) );
        if( isset( $_REQUEST[ 'customized' ] ) && isset( $_REQUEST[ 'wp_customize' ] ) && $_REQUEST[ 'wp_customize' ] == 'on' ) {
          add_action( 'wp_head', array( $this, 'print_styles' ), 100 );
        } else {
          if( ( $enqueue || $register ) && ( (bool) $force || !wp_style_is( 'lib-wp-theme-asset', 'registered' ) ) ){
            /** Make sure we have good deps */
            if( !is_array( $deps ) ){
              $deps = array();
            }
            /** Ungegister the style */
            wp_deregister_style( 'lib-wp-theme-asset' );
            /** Reregister the style */
            wp_register_style( 'lib-wp-theme-asset', $this->get_asset_url(), $deps, $this->get( 'version' ) );
          }
          if( $enqueue && ( (bool) $force || !wp_style_is( 'lib-wp-theme-asset', 'enqueued' ) ) ){
            wp_dequeue_style( 'lib-wp-theme-asset' );
            wp_enqueue_style( 'lib-wp-theme-asset' );
          }
        }
      }

      /**
       * Print styles instead of registering asset when
       * we're working on Customizer page for handling some javascript functionality.
       */
      public function print_styles() {
        $data = $this->get_asset_data();
        foreach( (array)$data as $k => $v ) {
          echo "<style type=\"text/css\" id=\"lib_wp_theme_customizer_{$k}\">{$v}</style>";
        }
      }

      /**
       *
       * @global type $wp_query
       * @param type $template
       * @return type
       */
      public function return_asset( $template ) {
        global $wp_query;

        if ( get_query_var( $this->query_vars[0] ) ) {
          $headers = apply_filters( 'lib-wp-theme::customizer::headers', array(
            'Content-Type'    => ( 'text/css; charset=' . get_bloginfo( 'charset' ) ),
            'Cache-Control'   => 'public',
            'Pragma'          => 'cache',
            'X-Frame-Options' => 'SAMEORIGIN',
            'Vary'            => 'Accept-Encoding'
          ) );
          foreach( (array) $headers as $_key => $field_value ) {
            @header( "{$_key}: {$field_value}" );
          }
          $data = $this->get_asset_data();
          if ( !empty( $data ) ) {
            $data = is_array( $data ) ?  implode( ' ', $data ) : $data;
            die( $data );
          } else {
            die('/** Global asset is empty */');
          }
        }
        return $template;
      }

      /**
       * Return styles
       */
      public function get_asset_data() {
        $data = array();
        foreach( (array)$this->get( 'settings' ) as $setting ) {
          if( is_array( $setting[ 'css' ] ) && count( $setting[ 'css' ] ) ){
            foreach( $setting[ 'css' ] as $rule ){
              if( !empty( $rule ) && $rule[ 'style' ] && $style = $this->generate_css( $rule ) ) {
                $data[ $setting[ 'key' ] . '-' . $rule[ 'style' ] ] = $style;
              }
            }
          }
        }
        return $data;
      }

      /**
       * Global JS URL
       * @return bool|string
       */
      public function get_asset_url() {
        global $wp_rewrite;

        /** If we don't have any rules, get them */
        if( $wp_rewrite->rules === null ){
          $wp_rewrite->wp_rewrite_rules();
        }

        $url = home_url() . '?' . $this->query_vars[0] . '=1';
        switch( true ) {
          case ( empty( $wp_rewrite->permalink_structure ) ):
            // Do nothing.
            break;
          case ( !key_exists( '^' . $this->get( 'permalink' ), $wp_rewrite->rules ) || strpos( $wp_rewrite->rules[ '^' . $this->get( 'permalink' ) ], $this->query_vars[0] ) === false ):
            // Looks like permalink structure is set, but our rules are not.
            // Flush rewrite rules to have correct permalink next time.
            flush_rewrite_rules( );
            break;
          default:
            $url = home_url( $this->get( 'permalink' ) );
            break;
        }

        return $url;
      }

      /**
       * This hooks into 'customize_register' (available as of WP 3.4) and allows
       * you to add new sections and controls to the Theme Customize screen.
       *
       * Note: MUST BE REWTITTEN BY CHILD CLASS
       *
       * @see add_action('customize_register',$func)
       * @param \WP_Customize_Manager $wp_customize
       * @link http://ottopress.com/2012/how-to-leverage-the-theme-customizer-in-your-own-themes/
       */
      public function register( $wp_customize ) {
        //** Remove extra sections */
        foreach( (array)$this->get( 'exclude' ) as $i ) {
          $wp_customize->remove_section( (string)$i );
        }
        //** Remove extra sections */
        foreach( (array)$this->get( 'settings' ) as $i => $v ) {
          $this->register_instance( $wp_customize, $v );
        }
        return $wp_customize;
      }

      /**
       * Try to register setting, its section and control.
       *
       */
      public function register_instance( $wp_customize, $i ) {
        //** Add Section if it has not been added yet. */
        $sections = $this->get( 'sections' );
        if( !$wp_customize->get_section( $i[ 'section' ] ) ) {
          $section = wp_parse_args( $sections[ $i[ 'section' ] ], array(
            'title' => __( 'No Name' ),
            'priority' => 100,
          ) );
          $wp_customize->add_section( $i[ 'section' ], $section );
        }

        //** Add Setting */
        $wp_customize->add_setting( $i[ 'key' ], array(
          'capability' => 'edit_theme_options',
          'transport'  => 'postMessage',
        ) );

        //** Add Control */
        $control_args = array(
          'label'    => ( !empty( $i[ 'label' ] ) ? $i[ 'label' ] : $i[ 'key' ] ),
          'section'  => $i[ 'section' ],
          'settings' => $i[ 'key' ],
          'priority' => ( !empty( $i[ 'priority' ] ) ? $i[ 'priority' ] : 999 ),
        );
        switch ( $i[ 'control' ] ) {
          case 'text':
          case 'font':
          case 'font-family':
            $wp_customize->add_control( new \WP_Customize_Control( $wp_customize, $i[ 'key' ], $control_args ) );
            break;
          case 'image':
          case 'background-image':
            $wp_customize->add_control( new \WP_Customize_Image_Control( $wp_customize, $i[ 'key' ], $control_args ) );
            break;
          case 'color':
          case 'background-color':
          case 'border-color':
            $wp_customize->add_control( new \WP_Customize_Color_Control( $wp_customize, $i[ 'key' ], $control_args ) );
            break;
          default:
            //** Custom Control must be added using the hook below. */
            if ( has_action( "lib-wp-theme::customizer::control::{$i[ 'control' ]}" ) ) {
              do_action( "lib-wp-theme::customizer::control::{$i[ 'control' ]}",  $i );
            } else {
              $wp_customize->add_control( new \WP_Customize_Control( $wp_customize, $i[ 'key' ], $control_args ) );
            }
            break;
        }

      }

      /**
       * This outputs the javascript needed to automate the live settings preview.
       * Also keep in mind that this function isn't necessary unless your settings
       * are using 'transport'=>'postMessage' instead of the default 'transport'
       * => 'refresh'
       *
       * Used by hook: 'customize_preview_init'
       * @see add_action('customize_preview_init',$func)
       */
      public function admin_scripts() {
        if ( !wp_script_is( 'lib-wp-theme-customizer', 'enqueued' ) ) {
          wp_enqueue_script( 'lib-wp-theme-customizer', $this->get_url( 'scripts/udx.wp.customizer.js' ), array( 'jquery', 'customize-preview' ), $this->get( 'version' ), true );
          wp_localize_script( 'lib-wp-theme-customizer', '_lib_wp_theme_customizer', array(
            'settings' => $this->get( 'settings' ),
          ) );
        }
      }

      private function get_url( $shortpath = '' ) {
        $path = wp_normalize_path( dirname( __FILE__ ) );
        $url = '';
        if ( strpos( $path, get_template_directory() ) !== false ) {
          $url = str_replace( get_template_directory(), get_template_directory_uri(), $path );
        } else {
          $url = str_replace( get_stylesheet_directory(), get_stylesheet_directory_uri(), $path );
        }

        $url = explode( '/lib/', $url );
        $url = $url[0];

        $url = trailingslashit( $url );

        return $url . $shortpath;
      }

      /**
       * Returns required argument
       */
      public function get( $arg ) {
        return isset( $this->args[ $arg ] ) ? $this->args[ $arg ] : NULL;
      }

      /**
       * Prepares setting
       */
      public function prepare_setting( $i ) {

        $i = wp_parse_args( $i, array(
          'key' => false,
          'label' => false,
          'section' => false,
          'control' => false, // values: 'background-image', 'color', 'background-color', 'border-color', 'image'
          'selector' => false,
          'min_width' => '',
          'max_width' => '',
          'extra_controls' => false
        ) );

        try {

          $sections = $this->get( 'sections' );
          if( !$i[ 'section' ] || !key_exists( $i[ 'section' ], $sections ) ) {
            throw new \Exception( "Name of section {$i[ 'section' ]} is undefined." );
          }

          if( empty( $i[ 'key' ] ) ) {
            throw new \Exception( "Key of setting is undefined." );
          }

          if( empty( $i[ 'control' ] ) ) {
            throw new \Exception( "Control for Setting is undefined." );
          }

          if( empty( $i[ 'selector' ] ) ) {
            throw new \Exception( "Selector is undefined." );
          }
          
          /** Setup the thing we're looping */
          $to_parse = array( $i );
          /** Now see if we have any extra items to parse */
          if( is_array( $i[ 'extra_controls' ] ) && count( $i[ 'extra_controls' ] ) ){
            $to_add = $i;
            foreach( $i[ 'extra_controls' ] as $control => $selector ){
              $to_add[ 'control' ] = $control;
              $to_add[ 'selector' ] = $selector;
              $to_add[ 'min_width' ] = $i[ 'min_width' ];
              $to_add[ 'max_width' ] = $i[ 'max_width' ];
              $to_parse[] = $to_add;
            }
          }
          
          /** Setup what we're returning */
          $css = array();
          
          foreach( $to_parse as $i ){
            //** Add CSS rules */
            $media_query = '';
            if ( ! empty( $i['min_width'] ) || ! empty( $i['max_width'] ) ) {
              $media_query .= 'only screen and';
              if ( ! empty( $i['min_width'] ) ) {
                $media_query .= ' (min-width: ' . $i['min_width'] . ')';
              }
              if ( ! empty( $i['max_width'] ) ) {
                $media_query .= ' (max-width: ' . $i['max_width'] . ')';
              }
            }

            $rule = array(
              'mod_name' => $i[ 'key' ],
              'selector' => $i[ 'selector' ],
              'style' => false,
              'prefix' => '',
              'postfix' => '',
              'media_query' => $media_query,
              'type' => 'style', // style, image
              'important' => true, // must default to true for backwards compatibility
            );
            switch( $i[ 'control' ] ) {
              case 'text':
                /** Not sure how to use this yet */
                continue;
                break;
              case 'font':
                $rule[ 'style' ] = 'font';
                break;
              case 'font-family':
                $rule[ 'style' ] = 'font-family';
                break;
              case 'image':
                $rule[ 'type' ] = 'image';
                break;
              case 'background-image':
                $rule[ 'style' ] = 'background-image';
                $rule[ 'prefix' ] = 'url(';
                $rule[ 'postfix' ] = ')';
                break;
              case 'color':
                $rule[ 'style' ] = 'color';
                break;
              case 'background-color':
                $rule[ 'style' ] = 'background-color';
                break;
              case 'border-color':
                $rule[ 'style' ] = 'border-color';
                break;
              default:
                $rule[ 'style' ] = $i[ 'control' ];
                //** Custom CSS rules must be added using the hook below. */
                $rule = apply_filters( "lib-wp-theme::customizer::css::{$i[ 'control' ]}", $rule, $i );
                if( empty( $rule[ 'style' ] ) ) {
                  throw new \Exception( "CSS rules are incorrect. Check control '{$i[ 'control' ]}'" );
                }
                break;
            }
            
            /** Add on the important rule */
            if( isset( $i[ 'important' ] ) ){
              $rule[ 'important' ] = (bool) $i[ 'important' ]; 
            }
            /** Add it onto the css */
            $css[] = $rule;
          }
          
          /** Return it */
          $i[ 'css' ] = $css;
          return $i;

        } catch ( \Exception $e ) {
          $i = false;
          // Filter can be used for logs.
          do_action( 'lib-wp-theme::customizer::error', 'Customizer Error: ' . $e->getMessage() . " Setting '{$i['label']} ( {$i['key']} )' can not be initialized." );
        }

        return $i;
      }

      /**
       * This will generate a line of CSS for use in header output. If the setting
       * ($mod_name) has no defined value, the CSS will not be output.
       *
       * @uses get_theme_mod()
       * @param string $selector CSS selector
       * @param string $style The name of the CSS *property* to modify
       * @param string $mod_name The name of the 'theme_mod' option to fetch
       * @param string $prefix Optional. Anything that needs to be output before the CSS property
       * @param string $postfix Optional. Anything that needs to be output after the CSS property
       * @param bool $important Whether or not to show the !important tag
       * @param bool $echo Optional. Whether to print directly to the page (default: true).
       * @return string Returns a single line of CSS with selectors and a property.
       */
      public function generate_css( $args ) {
        extract( wp_parse_args( $args, array(
          'selector' => '',
          'style' => '',
          'mod_name' => '',
          'prefix' => '',
          'postfix' => '',
          'media_query' => '',
        ) ) );
        $return = '';
        $mod = get_theme_mod( $mod_name );

        
        /** If the selector is an array, we're going to combine it first */
        if( is_array( $selector ) ){
          $selector = implode( ",\r\n", $selector );
        }
        
        
        if ( ! empty( $mod ) ) {
          $return = sprintf( '%s { %s: %s%s; }' . "\r\n",
            $selector,
            $style,
            $prefix.$mod.$postfix,
            $important ? ' !important' : ''
          );

          if ( is_string( $media_query ) && ! empty( trim( $media_query ) ) ) {
            $return = '@media ' . $media_query . ' { ' . $return . ' } ';
          }
        }
        return $return;
      }

    }

  }

}