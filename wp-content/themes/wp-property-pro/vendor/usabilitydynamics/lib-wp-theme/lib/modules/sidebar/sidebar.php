<?php
if( !class_exists( 'SidebarModule' ) ) {
  define( 'CFCT_BUILD_SIDEBARS_OPTION', 'cfct_build_sidebars' );

  /**
   * Carrington Build Sidebar Module
   * Allows the designation of a sidebar to be output
   *
   */
  class SidebarModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-sidebar-module'; // deprecated property, not needed for new module development

    protected $sidebar_default_options;
    private $sidebar_option_name = CFCT_BUILD_SIDEBARS_OPTION;

    public function __construct() {
      $opts = array(
        'description' => __( 'Place a WordPress Sidebar in to the layout.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cfct-sidebar-module', __( 'SideBar', 'carrington-build' ), $opts );

      $this->sidebar_default_options = apply_filters( 'cfct-sidebar-module-default-options', array(
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '<div class="clear"></div></div>',
        'before_title'  => '<h2 class="widget-title"><span>',
        'after_title'   => '</span></h2>'
      ) );

      $this->register_dynamic_sidebars();
    }

    /**
     * Handler for loading the sidebars that have been added by the module
     *
     * @return void
     */
    function register_dynamic_sidebars() {
      if( !function_exists( 'register_sidebar' ) ) {
        return false;
      }

      $cfct_sidebars = get_option( $this->sidebar_option_name );
      if( $cfct_sidebars != false ) {
        foreach( $cfct_sidebars as $sidebar ) {
          register_sidebar( $sidebar );
        }
      }
    }

    public function display( $data ) {
      global $wp_registered_sidebars;

      $wrapper = array(
        'before_sidebar' => '<div>',
        'after_sidebar'  => '</div>'
      );

      // sniff wether we're dealing with a list based widget group
      foreach( (array) $wp_registered_sidebars as $key => $sidebar ) {
        if( $sidebar[ 'name' ] == $data[ 'sidebar_id' ] ) {
          if( preg_match( '/^\<li/', $sidebar[ 'before_widget' ] ) ) {
            $wrapper = array(
              'before_sidebar' => '<ul>',
              'after_sidebar'  => '</ul>'
            );
          }
          break;
        }
      }

      $wrapper = apply_filters( 'cfct-sidebar-module-wrapper', $wrapper, $data );

      ob_start();
      dynamic_sidebar( $data[ 'sidebar_id' ] );
      $sidebar_html = ob_get_clean();

      return $this->load_view( $data, compact( 'sidebar_html', 'wrapper' ) );
    }

    public function admin_form( $data ) {
      global $wp_registered_sidebars;
      $html = '';
      //$html .= '<pre>'.htmlentities(print_r($data, true)).'</pre>';

      $html .= '
				<div>
					<select name="sidebar_id" id="' . $this->get_field_id( 'sidebar' ) . '" onchange="cfct_sidebar_select(this);">
						<option value="">-- Choose Sidebar --</option>
						<optgroup label="Registered Sidebars">
					';
      foreach( $wp_registered_sidebars as $id => $sidebar ) {
        $selected = ( isset( $data[ 'sidebar_id' ] ) && $data[ 'sidebar_id' ] == $sidebar[ 'name' ] ) ? ' selected="selected"' : null;
        $html .= '<option value="' . $id . '"' . $selected . '> &nbsp; ' . $sidebar[ 'name' ] . '</option>';
      }

      $sidebar_options = $this->sidebar_default_options;

      $advanced = ( isset( $data[ 'sidebar-custom' ] ) && $data[ 'sidebar-custom' ] ) ? 'true' : 'false';
      if( $advanced == true && isset( $data[ 'sidebar-options' ] ) ) {
        $sidebar_options = array_merge( $sidebar_options, $data[ 'sidebar-options' ] );
      }

      $html .= '
						</optgroup>
						';
      if( function_exists( 'register_sidebar' ) ) {
        $html .= '
							<optgroup label="----------">
								<option value="new">Register New Sidebar</option>
							</optgroup>
							';
      }
      $html .= '
					</select>
				</div>
				<div id="' . $this->get_field_id( 'new-sidebar-entry' ) . '" class="cfct-hidden">
					<p>
						<label>Sidebar Name</label>
						<input type="text" name="' . $this->get_field_name( 'new-sidebar-name' ) . '" id="' . $this->get_field_id( 'new-sidebar-name' ) . '" value="" />
					<p>
					<p><a href="#" onclick="cfct_sidebar_advanced(); return false;">&raquo; <span id="' . $this->get_field_id( 'new-sidebar-advanced-toggle' ) . '">Show</span> Advanced Options</a></p>
					<div id="' . $this->get_field_name( 'new-sidebar-advanced' ) . '" class="cfct-hidden">
						<p>Configure the Advanced options for your sidebar below. For more information on what these fields are for, please reference the <a href="http://codex.wordpress.org/WordPress_Widgets_Api/register_sidebar">WordPress Codex page on Sidebar Registration</a>.</p>
						<p>
							<label>Before Widget</label>
							<input type="text" name="' . $this->get_field_name( 'new-sidebar-before_widget' ) . '" id="' . $this->get_field_id( 'new-sidebar-before_widget' ) . '" value="' . esc_html( $sidebar_options[ 'before_widget' ] ) . '" />
						<p>
						<p>
							<label>After Widget</label>
							<input type="text" name="' . $this->get_field_name( 'new-sidebar-after_widget' ) . '" id="' . $this->get_field_id( 'new-sidebar-after_widget' ) . '" value="' . esc_html( $sidebar_options[ 'after_widget' ] ) . '" />
						<p>
						<p>
							<label>Before Title</label>
							<input type="text" name="' . $this->get_field_name( 'new-sidebar-before_title' ) . '" id="' . $this->get_field_id( 'new-sidebar-before_title' ) . '" value="' . esc_html( $sidebar_options[ 'before_title' ] ) . '" />
						<p>
						<p>
							<label>After Title</label>
							<input type="text" name="' . $this->get_field_name( 'new-sidebar-after_title' ) . '" id="' . $this->get_field_id( 'new-sidebar-after_title' ) . '" value="' . esc_html( $sidebar_options[ 'after_title' ] ) . '" />
						<p>
					</div>
				</div>
				';

      return $html;
    }

    public function update( $new_data, $old_data ) {
      global $wp_registered_sidebars;
      if( $new_data[ 'sidebar_id' ] == 'new' ) {
        $new_data[ 'sidebar_id' ] = $new_data[ $this->get_field_name( 'new-sidebar-name' ) ];

        $sidebar = array(
          'name'          => $new_data[ 'sidebar_id' ],
          'before_widget' => $new_data[ $this->get_field_name( 'new-sidebar-before_widget' ) ],
          'after_widget'  => $new_data[ $this->get_field_name( 'new-sidebar-after_widget' ) ],
          'before_title'  => $new_data[ $this->get_field_name( 'new-sidebar-before_title' ) ],
          'after_title'   => $new_data[ $this->get_field_name( 'new-sidebar-after_title' ) ]
        );

        $cfct_sidebars = get_option( $this->sidebar_option_name );

        if( $cfct_sidebars == false ) {
          $cfct_sidebars = array();
        }

        array_push( $cfct_sidebars, $sidebar );
        update_option( $this->sidebar_option_name, $cfct_sidebars );
      } else {
        $new_data[ 'sidebar_id' ] = $wp_registered_sidebars[ $new_data[ 'sidebar_id' ] ][ 'name' ];
      }

      // clean the data array
      unset( $new_data[ $this->get_field_name( 'new-sidebar-name' ) ] );
      unset( $new_data[ $this->get_field_name( 'new-sidebar-before_widget' ) ] );
      unset( $new_data[ $this->get_field_name( 'new-sidebar-after_widget' ) ] );
      unset( $new_data[ $this->get_field_name( 'new-sidebar-before_title' ) ] );
      unset( $new_data[ $this->get_field_name( 'new-sidebar-after_title' ) ] );

      return $new_data;
    }

    public function text( $data ) {
      return '';
    }

    public function admin_text( $data ) {
      global $wp_registered_sidebars;
      $text = 'Sidebar';
      foreach( $wp_registered_sidebars as $id => $sidebar ) {
        if( isset( $data[ 'sidebar_id' ] ) && $data[ 'sidebar_id' ] == $sidebar[ 'name' ] ) {
          $text = $sidebar[ 'name' ];
          break;
        }
      }

      return $text;
    }

    public function admin_js() {
      $js = '
				// toggle display of new sidebar entry
				cfct_sidebar_select = function(select) {
					var _this = jQuery(select);
					var tgt = jQuery("#' . $this->get_field_id( 'new-sidebar-entry' ) . '");
					if (_this.val() == "new") {
						tgt.show();
					}
					else {
						tgt.hide();
					}
				}
			
				// toggle display of advanced sidebar module options
				cfct_sidebar_advanced = function() {
					var tgt = jQuery("#' . $this->get_field_id( 'new-sidebar-advanced' ) . '");
					tgt.slideToggle();
				}
			';

      return $js;
    }

    public function admin_css() {
      $css = '
				#' . $this->get_field_name( 'new-sidebar-advanced' ) . ' {
					margin-left: 15px;
				}
				#' . $this->get_field_name( 'new-sidebar-advanced' ) . ' input {
					font-family: Monaco, Consolas, Courier, "Courier New", monospaced;
				}
			';

      return $css;
    }

    public function css() {
      $css = '
				.entry div.cfct-sidebar > ul {
					list-style-type: none;
					list-style-image: none;
					list-style-position: outside;
					margin-left: 0;
					padding-left: 0;
				}
				.entry div.cfct-sidebar > ul li {
					margin: 0 0 5px 0;
				}
				.entry div.cfct-sidebar .widgettitle {
					margin-top: 0;
				}
			';

      return $css;
    }
  }

}
