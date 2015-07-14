<?php
/**
 * Madison Theme Customizer
 *
 * @package Madison
 * @author Justin Kopepasah
*/

/**
 * Extend the WP_Customize_Control class by adding
 * a textarea option.
 * 
 * @since 1.0.0
*/
if ( class_exists( 'WP_Customize_Control' ) ) {
	class Madison_Customize_Textarea_Control extends WP_Customize_Control {
		public $type = 'textarea';
		
		public function render_content() {
			?>
				<label>
					<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
					<textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
				</label>
			<?php
		}
	}
}

/**
 * Add custom options to the theme customizer.
 *
 * @since 1.0.0
*/
function madison_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';

	/**
	 * Add an option for left or right sidebar.
	*/
	$wp_customize->add_section( 'madison_layout', array(
		'title'       => __( 'Layout', 'madison' ),
		'description' => __( 'Select a default layout of a right or left sidebar.' ),
		'priority'    => 25, // Places this just under the title_tagline section.
	) );

	$wp_customize->add_setting( 'madison_layout_setting', array(
		'default'   => 'right',
		'transport' => 'postMessage'
	) );

	$wp_customize->add_control( 'madison_layout_setting', array(
		'label'   => __( 'Select a Layout' ),
		'section' => 'madison_layout',
		'type'    => 'radio',
		'choices' => array(
			'right' => __( 'Sidebar on Right (default)' ),
			'left'  => __( 'Sidebar on Left' ),
		),
	) );

	/**
	 * Custom colors for the theme. These colors are
	 * controled by the customizer and include
	 * settings for primary and secondary colors.
	*/
	$wp_customize->add_setting( 'madison_primary_color', array(
		'default'           => '#e75b67',
		'sanitize_callback' => 'sanitize_hex_color_no_hash',
		'sanitize_js_callback' => 'maybe_hash_hex_color',
	));

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_primary_color',  array(
			'label'      => __( 'Primary Color', 'madison' ),
			'section'    => 'colors',
			'settings'   => 'madison_primary_color',
	)));

	$wp_customize->add_setting( 'madison_secondary_color', array(
		'default'           => '#66b27c',
		'sanitize_callback' => 'sanitize_hex_color_no_hash',
		'sanitize_js_callback' => 'maybe_hash_hex_color',
	));

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_secondary_color',  array(
			'label'      => __( 'Secondary Color', 'madison' ),
			'section'    => 'colors',
			'settings'   => 'madison_secondary_color',
	)));

  $wp_customize->add_section( 'madison_search', array(
      'title'       => __( 'Header Search', 'madison' ),
      'description' => __( 'Control a site-wide search form in a header.', 'madison' ),
      'priority'    => 62
  ));

  $wp_customize->add_setting( 'madison_search_enable', array(
      'default'              => ''
  ));

  $wp_customize->add_control( 'madison_search_enable', array(
      'label'   => __( 'Enable Site-wide Search', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'checkbox',
      'settings' => 'madison_search_enable'
  ));

  $wp_customize->add_setting( 'madison_search_field_1', array(
      'default'              => ''
  ));

  $wp_customize->add_setting( 'madison_search_field_2', array(
      'default'              => ''
  ));

  $wp_customize->add_setting( 'madison_search_field_3', array(
      'default'              => ''
  ));

  $wp_customize->add_setting( 'madison_search_field_4', array(
      'default'              => ''
  ));

  $wp_customize->add_setting( 'madison_search_field_1_type', array(
      'default'              => 'range_dropdown'
  ));

  $wp_customize->add_setting( 'madison_search_field_2_type', array(
      'default'              => 'range_dropdown'
  ));

  $wp_customize->add_setting( 'madison_search_field_3_type', array(
      'default'              => 'range_dropdown'
  ));

  $wp_customize->add_setting( 'madison_search_field_4_type', array(
      'default'              => 'range_dropdown'
  ));

  global $wp_properties;
  $_attributes = array();
  if ( !empty( $wp_properties['searchable_attributes'] ) && is_array( $wp_properties['searchable_attributes'] ) ) {
    foreach( $wp_properties['searchable_attributes'] as $_attr_slug ) {
      $_attributes[$_attr_slug] = $wp_properties['property_stats'][$_attr_slug];
    }
  }

  $wp_customize->add_control( 'madison_search_field_1', array(
      'label'   => __( 'Field 1', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => $_attributes,
      'settings' => 'madison_search_field_1'
  ));

  $wp_customize->add_control( 'madison_search_field_1_type', array(
      'label'   => __( 'Field 1 Type', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => array(
        'range_dropdown' => 'Range Dropdown',
        'dropdown' => 'Dropdown',
        'input' => 'Text Input'
      ),
      'settings' => 'madison_search_field_1_type'
  ));

  $wp_customize->add_control( 'madison_search_field_2', array(
      'label'   => __( 'Field 2', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => $_attributes,
      'settings' => 'madison_search_field_2'
  ));

  $wp_customize->add_control( 'madison_search_field_2_type', array(
      'label'   => __( 'Field 2 Type', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => array(
          'range_dropdown' => 'Range Dropdown',
          'dropdown' => 'Dropdown',
          'input' => 'Text Input'
      ),
      'settings' => 'madison_search_field_2_type'
  ));

  $wp_customize->add_control( 'madison_search_field_3', array(
      'label'   => __( 'Field 3', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => $_attributes,
      'settings' => 'madison_search_field_3'
  ));

  $wp_customize->add_control( 'madison_search_field_3_type', array(
      'label'   => __( 'Field 3 Type', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => array(
          'range_dropdown' => 'Range Dropdown',
          'dropdown' => 'Dropdown',
          'input' => 'Text Input'
      ),
      'settings' => 'madison_search_field_3_type'
  ));

  $wp_customize->add_control( 'madison_search_field_4', array(
      'label'   => __( 'Field 4', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => $_attributes,
      'settings' => 'madison_search_field_4'
  ));

  $wp_customize->add_control( 'madison_search_field_4_type', array(
      'label'   => __( 'Field 4 Type', 'madison' ),
      'section' => 'madison_search',
      'type'    => 'select',
      'choices' => array(
          'range_dropdown' => 'Range Dropdown',
          'dropdown' => 'Dropdown',
          'input' => 'Text Input'
      ),
      'settings' => 'madison_search_field_4_type'
  ));

	/**
	 * This section defines the header colors. It is
	 * placed just below the Header Image section.
	*/
	$wp_customize->add_section( 'madison_header', array(
		'title'       => __( 'Header Colors', 'madison' ),
		'description' => __( 'Control and customize the various header colors here.', 'madison' ),
		'priority'    => 61,
	));

	$wp_customize->add_setting( 'madison_header_background_color', array(
		'default'              => '#e75b67',
		'sanitize_callback'    => 'sanitize_hex_color_no_hash',
		'sanitize_js_callback' => 'maybe_hash_hex_color',
		'transport'            => 'postMessage'
	));

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_header_background_color',  array(
			'label'    => __( 'Header Background', 'madison' ),
			'section'  => 'madison_header',
			'settings' => 'madison_header_background_color',
	)));

	$wp_customize->add_setting( 'madison_header_text_color', array(
		'default'              => '#ffffff',
		'sanitize_callback'    => 'sanitize_hex_color_no_hash',
		'sanitize_js_callback' => 'maybe_hash_hex_color',
		'transport'            => 'postMessage'
	));

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_header_text_color',  array(
			'label'    => __( 'Header Text', 'madison' ),
			'section'  => 'madison_header',
			'settings' => 'madison_header_text_color',
	)));

	$wp_customize->add_setting( 'madison_header_menu_item_background_color', array(
		'default'              => '#ea636d',
		'sanitize_callback'    => 'sanitize_hex_color_no_hash',
		'sanitize_js_callback' => 'maybe_hash_hex_color',
		'transport'            => 'postMessage'
	));

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_header_menu_item_background_color',  array(
			'label'    => __( 'Active Menu Item Background', 'madison' ),
			'section'  => 'madison_header',
			'settings' => 'madison_header_menu_item_background_color',
	)));

	$wp_customize->add_setting( 'madison_header_menu_item_text_color_hover', array(
			'default'              => '#ffffff',
			'sanitize_callback'    => 'sanitize_hex_color_no_hash',
			'sanitize_js_callback' => 'maybe_hash_hex_color',
			'transport'            => 'postMessage'
	));

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_header_menu_item_text_color_hover',  array(
			'label'    => __( 'Active Menu Item Text', 'madison' ),
			'section'  => 'madison_header',
			'settings' => 'madison_header_menu_item_text_color_hover',
	)));

	if ( function_exists( 'breadcrumb_trail' ) ) {
		$wp_customize->add_setting( 'madison_header_breadcrumbs_background', array(
				'default'              => '#fafafa',
				'sanitize_callback'    => 'sanitize_hex_color_no_hash',
				'sanitize_js_callback' => 'maybe_hash_hex_color',
		));

		$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_header_breadcrumbs_background',  array(
				'label'    => __( 'Breadcrumbs Background', 'madison' ),
				'section'  => 'madison_header',
				'settings' => 'madison_header_breadcrumbs_background',
		)));

		$wp_customize->add_setting( 'madison_header_breadcrumbs_text', array(
				'default'              => '#cecece',
				'sanitize_callback'    => 'sanitize_hex_color_no_hash',
				'sanitize_js_callback' => 'maybe_hash_hex_color',
		));

		$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'madison_header_breadcrumbs_text',  array(
				'label'    => __( 'Breadcrumbs Text', 'madison' ),
				'section'  => 'madison_header',
				'settings' => 'madison_header_breadcrumbs_text',
		)));
	}

	/**
	 * Add custom message to the front page.
	*/
	$wp_customize->add_section( 'madison_home_template', array(
		'title'       => __( 'Home Template', 'madison' ),
		'description' => __( 'This section holds customizations available for the home template.', 'madison' ),
		'priority'    => 26,
	));
	$wp_customize->add_setting( 'madison_front_page_message', array(
		'default'   => get_bloginfo( 'description' ),
		'transport' => 'postMessage'
	));

	$wp_customize->add_control( 'madison_front_page_message', array(
		'label'   => __( 'Catchline (Required)', 'madison' ),
		'section' => 'madison_home_template',
		'type'    => 'text',
	));

	/**
	 * The custom footer options, including links
	 * social networks, phone, email and custom text
	 * on the footer.
	*/
	$wp_customize->add_section( 'madison_contact_infomation', array(
		'title'    => __( 'Contact Infomation', 'madison' ),
		'description' => __( 'Use this section to define your contact information. The contact information is located just above the footer.', 'madison' ),
		'priority' => 101,
	));

	$wp_customize->add_setting( 'madison_footer_email', array(
		'default'   => '',
	));

	$wp_customize->add_control( 'madison_footer_email', array(
		'label'    => __( 'Email', 'madison' ),
		'section'  => 'madison_contact_infomation',
		'settings' => 'madison_footer_email',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_phone', array(
		'default'   => '',
	));

	$wp_customize->add_control( 'madison_footer_phone', array(
		'label'    => __( 'Phone Number', 'madison' ),
		'section'  => 'madison_contact_infomation',
		'settings' => 'madison_footer_phone',
		'type'     => 'text'
	));

	// Social Information
	$wp_customize->add_section( 'madison_social_networks', array(
		'title'    => __( 'Social Networks', 'madison' ),
		'description' => __( 'Use this section to define your social networks. Use the full URL to your social profile (e.g. http://twitter.com/kopepasah).', 'madison' ),
		'priority' => 102,
	));

	$wp_customize->add_setting( 'madison_footer_twitter', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_twitter', array(
		'label'    => 'Twitter',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_twitter',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_facebook', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_facebook', array(
		'label'    => 'Facebook',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_facebook',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_google', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_google', array(
		'label'    => 'Google+',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_google',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_linkedin', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_linkedin', array(
		'label'    => 'LinkedIn',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_linkedin',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_pinterest', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_pinterest', array(
		'label'    => 'Pinterest',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_pinterest',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_instagram', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_instagram', array(
		'label'    => 'Instagram',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_instagram',
		'type'     => 'text'
	));

	$wp_customize->add_setting( 'madison_footer_youtube', array(
		'default'    => '',
	));

	$wp_customize->add_control( 'madison_footer_youtube', array(
		'label'    => 'YouTube',
		'section'  => 'madison_social_networks',
		'settings' => 'madison_footer_youtube',
		'type'     => 'text'
	));

	// Footer site information.
	$wp_customize->add_section( 'madison_footer', array(
		'title'    => __( 'Site Info', 'madison' ),
		'description' => __( 'Use this section to customize the site info section. HTML is allowed.', 'madison' ),
		'priority' => 103,
	));

	$wp_customize->add_setting( 'madison_footer_text', array(
		'default'   => '',
		'transport' => 'postMessage'
	));

	$wp_customize->add_control( new Madison_Customize_Textarea_Control( $wp_customize, 'madison_footer_text', array(
		'label'    => 'Custom Text',
		'section'  => 'madison_footer',
		'settings' => 'madison_footer_text',
	)));
}
add_action( 'customize_register', 'madison_customize_register' );

/**
 * Script for the customizer preview.
 * 
 * @since 1.0.0
*/
function madison_customize_preview_init() {
	wp_enqueue_script( 'madison-customizer-preview', get_template_directory_uri() . '/lib/customizer/js/customizer-preview.js', array( 'customize-preview' ), '20140401', true );
}
add_action( 'customize_preview_init', 'madison_customize_preview_init' );

/**
 * Enqueue styles for the cusomtizer.
*/
function madison_customize_controls_enqueue_scripts() {
	wp_enqueue_script( 'madison-customizer', get_template_directory_uri() . '/lib/customizer/js/customizer.js', array( 'jquery' ), '20140401', true );

	/*
		NOTE When I clean the customizer, decided if I want to keep this.
	*/
	wp_enqueue_style( 'madison-customizer', get_template_directory_uri() . '/lib/customizer/css/customizer.css' );
}
// add_action( 'customize_controls_enqueue_scripts', 'madison_customize_controls_enqueue_scripts' );

/**
 * For some theme mods, I want to replace to the
 * default if left empty.
 *
 * @since 1.0.0
*/
function madison_reset_theme_mods() {
	// We don't want this mod left emtpy.
	if ( ! get_theme_mod( 'madison_front_page_message' ) ) {
		remove_theme_mod( 'madison_front_page_message' );
	}
}
add_action( 'after_setup_theme', 'madison_reset_theme_mods' );

/**
 * Head hook for customizer styles.
 *
 * @since 1.0.0
*/
function madison_customize_head_hook() {
	// Set the modification into an array.
	$mods = array(
		'primary_color'               => get_theme_mod( 'madison_primary_color' ),
		'secondary_color'             => get_theme_mod( 'madison_secondary_color' ),
		'header_bg_color'             => get_theme_mod( 'madison_header_background_color' ),
		'header_text_color'           => get_theme_mod( 'madison_header_text_color' ),
		'header_menu_item_bg_color'   => get_theme_mod( 'madison_header_menu_item_background_color' ),
		'header_menu_item_text_color' => get_theme_mod( 'madison_header_menu_item_text_color_hover' ),
		'header_breadcrumbs_bg'       => get_theme_mod( 'madison_header_breadcrumbs_background' ),
		'header_breadcrumbs_text'     => get_theme_mod( 'madison_header_breadcrumbs_text' )
	);

	?>
	<style type="text/css" media="screen">
		<?php if ( $mods['primary_color'] && $mods['primary_color'] !== 'e75b67' ) : ?>
			a,
			.hentry .entry-meta-categories,
			.property-feature a:hover,
			#respond .required,
			#colorbox #cboxContent button i,
			#colorbox #cboxContent #cboxPrevious,
			#colorbox #cboxContent #cboxNext,
			#colorbox #cboxContent #cboxClose,
			#colorbox #cboxContent #cboxSlideshow {
				color: #<?php echo $mods['primary_color'] ?>;
			}
			.btn,
			.btn-wrapper a,
			.more-link,
			input[type="submit"],
			input[type="button"],
			input[type="reset"],
			button,
			#infinite-handle span {
				background: #<?php echo $mods['primary_color'] ?> !important;
				border-color: #<?php echo $mods['primary_color'] ?> !important;
			}
			.content-navigation .meta-nav,
			.property-map-header .property-address,
			.property-attributes .property-price,
      .property .property-price,
      .widget.widget_tag_cloud a:hover,
			.site-contact-info a:hover {
				background: #<?php echo $mods['primary_color'] ?> !important;
			}
			#comments .comment #respond .cancel-comment a:hover {
				border-color: #<?php echo $mods['primary_color'] ?>;
				color: #<?php echo $mods['primary_color'] ?>;
			}
		<?php endif; ?>

		<?php if ( $mods['secondary_color'] && $mods['secondary_color'] !== '66b27c' ) : ?>
			a:hover,
			.hentry .entry-meta-tags a:hover,
			.property-overview-item .property-information .property-price,
			#colorbox #cboxContent #cboxPrevious:hover,
			#colorbox #cboxContent #cboxNext:hover,
			#colorbox #cboxContent #cboxClose:hover,
			#colorbox #cboxContent #cboxSlideshow:hover {
				color: #<?php echo $mods['secondary_color'] ?> !important;
			}
			.btn:hover,
			.btn-wrapper a:hover,
			.more-link:hover,
			input[type="submit"]:hover,
			input[type="button"]:hover,
			input[type="reset"]:hover,
			button:hover,
			#infinite-handle span,
			.section-property-search input:focus,
			.section-property-search select:focus {
				border-color: #<?php echo $mods['secondary_color'] ?> !important;
				color: #<?php echo $mods['secondary_color'] ?> !important;
			}
			.content-navigation a:hover span,
			.property-overview-item .property-information .property-permalink a:hover {
				background: #<?php echo $mods['secondary_color'] ?>;
			}
		<?php endif; ?>

		<?php if ( $mods['header_bg_color'] && $mods['header_bg_color'] !== 'e75b67' ) : ?>
			#site-header .section-header-navigation {
				background: #<?php echo $mods['header_bg_color']; ?>;
			}
      #site-header .section-property-search {
        border-bottom-color: #<?php echo $mods['header_bg_color']; ?>;
      }
		<?php endif; ?>

		<?php if ( $mods['header_text_color'] && $mods['header_text_color'] !== 'ffffff' ) : ?>
			#site-header .section-header-navigation,
			#site-header .section-header-navigation a,
			#site-header .site-branding .site-tagline {
				color: #<?php echo $mods['header_text_color']; ?>;
			}
		<?php endif; ?>

		<?php if ( $mods['header_menu_item_bg_color'] && $mods['header_menu_item_bg_color'] !== 'ea636d' ) : ?>
			#site-header .site-navigation .menu li a:hover,
			#site-header .site-navigation .menu li.current-menu-item > a,
			#site-header .site-navigation .menu li.current-menu-ancestor > a {
				background: #<?php echo $mods['header_menu_item_bg_color']; ?>;
			}
		<?php endif; ?>

		<?php if ( $mods['header_menu_item_text_color'] ) : ?>
			#site-header .site-navigation .menu li a:hover,
			#site-header .site-navigation .menu li.current-menu-item > a,
			#site-header .site-navigation .menu li.current-menu-ancestor > a {
				color: #<?php echo $mods['header_menu_item_text_color']; ?>;
			}
		<?php endif; ?>

		<?php if ( $mods['header_breadcrumbs_bg'] && $mods['header_breadcrumbs_bg'] !== 'fafafa' ) : ?>
			#site-header .section-breadcrumbs {
				background: #<?php echo $mods['header_breadcrumbs_bg']; ?>;
			}
		<?php endif; ?>

		<?php if ( $mods['header_breadcrumbs_text'] && $mods['header_breadcrumbs_text'] !== 'cecece' ) : ?>
			#site-header .section-breadcrumbs span,
			#site-header .section-breadcrumbs a {
				color: #<?php echo $mods['header_breadcrumbs_text']; ?> !important;
			}
			#site-header .section-breadcrumbs a:hover {
				text-decoration: underline;
			}
		<?php endif; ?>
	</style>
	<?php
}
add_action( 'wp_head', 'madison_customize_head_hook' );

/**
 * Hook into the body class filter.
 *
 * @since 1.0.0
 * @param string The body classes.
*/
function madison_customizer_body_class( $classes ) {
	if ( get_theme_mod( 'madison_layout_setting' ) === 'left' ) {
		$classes[] = 'sidebar-left';
	}

	return $classes;
}
add_filter( 'body_class', 'madison_customizer_body_class' );