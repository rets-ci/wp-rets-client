<?php

/**
// Conditions example

// Standard
$condition = array( 'option' => 'x_stack', 'value' => 'renew', 'op' => '=' )

// Simplified (assumes '=' as operator)
$condition = array( 'x_stack' => 'renew' )

// Single
'condition' => $condition

// Multiple.
'conditions' => array(
  $condition,
  $another_condition
)
*/

function x_cornerstone_options_map() {

  global $x_cornerstone_options_map;

  if ( isset( $x_cornerstone_options_map ) ) {
    return $x_cornerstone_options_map;
  }

  include 'common.php';

  $sections = array(

    'x-stack' => array(
      'title'       => __( 'Stack', '__x__' ),
      'description' => __( 'Select the Stack you would like to use and wait a brief moment to view it in the preview area to the right. Each Stack functions like a unique WordPress theme, and thus comes with its own set of options, features, layouts, and more.', '__x__' ),
      'controls' => array(
        'x_stack' => array(
          'type' => 'select',
          'title' => __( 'Select', '__x__' ),
          'options' => array(
            'choices' => array(
              'integrity' => __( 'Integrity', '__x__' ),
              'renew'     => __( 'Renew', '__x__' ),
              'icon'      => __( 'Icon', '__x__' ),
              'ethos'     => __( 'Ethos', '__x__' )
            )
          )
        ),
      ),
    ),

    'x-integrity' => array(
      'title'       => __( 'Integrity', '__x__' ),
      'description' => __( 'Integrity is a beautiful design geared towards businesses and individuals desiring a site with a more traditional layout, yet with plenty of modern touches.', '__x__' ),
      'condition' => array( 'x_stack' => 'integrity' ),
      'controls' => array(
        'x_integrity_design' => array(
          'type' => 'select',
          'title' => __( 'Design', '__x__' ),
          'options' => array(
            'choices' => array(
              'light' => __( 'Light', '__x__' ),
              'dark'  => __( 'Dark', '__x__' )
            )
          )
        ),
        'x_integrity_topbar_transparency_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Topbar Transparency', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'x_integrity_navbar_transparency_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Navbar Transparency', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'x_integrity_footer_transparency_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Footer Transparency', '__x__' ),
          'condition' => array( 'virtual:classic_footers' => true )
        ),
      ),
      'sections' => array(
        'blog' => array(
          'title'       => __( 'Blog Options', '__x__' ),
          'description' => __( 'Enabling the blog header will turn on the area above your posts on the index page that contains your title and subtitle. Disabling it will result in more content being visible above the fold.', '__x__' ),
          'controls' => array(
            'x_integrity_blog_header_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Blog Header', '__x__' )
            ),
            'x_integrity_blog_title' => array(
              'type' => 'text',
              'title' => __( 'Blog Title', '__x__' ),
              'condition' => array( 'x_integrity_blog_header_enable' => true )
            ),
            'x_integrity_blog_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Blog Subtitle', '__x__' ),
              'condition' => array( 'x_integrity_blog_header_enable' => true )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'portfolio' => array(
          'title'       => __( 'Portfolio Options', '__x__' ),
          'description' => __( 'Enabling portfolio index sharing will turn on social sharing links for each post on the portfolio index page. Activate and deactivate individual sharing links underneath the main Portfolio section.', '__x__' ),
          'controls' => array(
            'x_integrity_portfolio_archive_sort_button_text' => array(
              'type' => 'text',
              'title' => __( 'Sort Button Text', '__x__' )
            ),
            'x_integrity_portfolio_archive_post_sharing_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Portfolio Index Sharing', '__x__' )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'shop' => array(
          'title'       => __( 'Shop Options', '__x__' ),
          'description' => __( 'Enabling the shop header will turn on the area above your posts on the index page that contains your title and subtitle. Disabling it will result in more content being visible above the fold.', '__x__' ),
          'enabled' => X_WOOCOMMERCE_IS_ACTIVE,
          'controls' => array(
            'x_integrity_shop_header_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Shop Header', '__x__' )
            ),
            'x_integrity_shop_title' => array(
              'type' => 'text',
              'title' => __( 'Shop Title', '__x__' ),
              'condition' => array( 'x_integrity_shop_header_enable' => true )
            ),
            'x_integrity_shop_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Shop Subtitle', '__x__' ),
              'condition' => array( 'x_integrity_shop_header_enable' => true )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true )
        )
      )
    ),

    'x-renew' => array(
      'title'       => __( 'Renew', '__x__' ),
      'description' => __( 'Renew features a gorgeous look and feel that lends a clean, modern look to your site. All of your content will take center stage with Renew in place.', '__x__' ),
      'condition' => array( 'x_stack' => 'renew' ),
      'controls' => array(
        'x_renew_topbar_background' => array(
          'type' => 'color',
          'title' => __( 'Topbar Background', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_renew_logobar_background' => array(
          'type' => 'color',
          'title' => __( 'Logobar Background', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_renew_navbar_background' => array(
          'type' => 'color',
          'title' => __( 'Navbar Background', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_renew_navbar_button_color' => array(
          'type' => 'color',
          'title' => __( 'Mobile Button Color', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_renew_navbar_button_background' => array(
          'type' => 'color',
          'title' => __( 'Mobile Button Background', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_renew_navbar_button_background_hover' => array(
          'type' => 'color',
          'title' => __( 'Mobile Button Background Hover', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_renew_footer_background' => array(
          'type' => 'color',
          'title' => __( 'Footer Background', '__x__' ),
          'condition' => array( 'virtual:classic_footers' => true ),
        ),
      ),
      'sections' => array(
        'typography' => array(
          'title'       => __( 'Typography Options', '__x__' ),
          'description' => __( 'Here you can set the colors for your topbar and footer. Get creative, the possibilities are endless.', '__x__' ),
          'controls' => array(
            'x_renew_topbar_text_color' => array(
              'type' => 'color',
              'title' => __( 'Topbar Links and Text', '__x__' ),
              'condition' => array( 'virtual:classic_headers' => true ),
            ),
            'x_renew_topbar_link_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Topbar Links Hover', '__x__' ),
              'condition' => array( 'virtual:classic_headers' => true ),
            ),
            'x_renew_footer_text_color' => array(
              'type' => 'color',
              'title' => __( 'Footer Links and Text', '__x__' ),
              'condition' => array( 'virtual:classic_footers' => true ),
            ),
          ),
        ),
        'blog' => array(
          'title'       => __( 'Blog Options', '__x__' ),
          'description' => __( 'The entry icon color is for the post icons to the left of each title. Selecting "Creative" under the "Entry Icon Position" setting will allow you to align your entry icons in a different manner on your posts index page when "Content Left, Sidebar Right" or "Fullwidth" are selected as your "Content Layout" and when your blog "Style" is set to "Standard." This feature is intended to be paired with a "Boxed" layout.', '__x__' ),
          'controls' => array(
            'x_renew_blog_title' => array(
              'type' => 'text',
              'title' => __( 'Blog Title', '__x__' ),
              'condition' => array( 'virtual:classic_headers' => true )
            ),
            'x_renew_entry_icon_color' => array(
              'type' => 'color',
              'title' => __( 'Entry Icons', '__x__' )
            ),
            'x_renew_entry_icon_position' => array(
              'type' => 'select',
              'title' => __( 'Entry Icon Position', '__x__' ),
              'options' => array(
                'choices' => array(
                  'standard' => __( 'Standard', '__x__' ),
                  'creative' => __( 'Creative', '__x__' )
                )
              )
            ),
            'x_renew_entry_icon_position_horizontal' => array(
              'type' => 'text',
              'title' => __( 'Entry Icon Horizontal Alignment (%)', '__x__' ),
              'condition' => array( 'x_renew_entry_icon_position' => 'creative' )
            ),
            'x_renew_entry_icon_position_vertical' => array(
              'type' => 'text',
              'title' => __( 'Entry Icon Vertical Alignment (px)', '__x__' ),
              'condition' => array( 'x_renew_entry_icon_position' => 'creative' )
            ),
          ),
        ),
        'shop' => array(
          'title'       => __( 'Shop Options', '__x__' ),
          'description' => __( 'Provide a title you would like to use for your shop. This will show up on the index page as well as in your breadcrumbs.', '__x__' ),
          'enabled' => X_WOOCOMMERCE_IS_ACTIVE,
          'controls' => array(
            'x_renew_shop_title' => array(
              'type' => 'text',
              'title' => __( 'Shop Title', '__x__' )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true )
        )
      )
    ),

    'x-icon' => array(
      'title'       => __( 'Icon', '__x__' ),
      'description' => __( 'Icon features a stunning, modern, fullscreen design with a unique fixed sidebar layout that scolls with users on larger screens as you move down the page. The end result is attractive, app-like, and intuitive.', '__x__' ),
      'condition' => array( 'x_stack' => 'icon' ),
      'controls' => array(
        'x_icon_post_title_icon_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Post Title Icon', '__x__' )
        ),
        'x_icon_post_standard_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Standard Post Custom Colors', '__x__' )
        ),
        'x_icon_post_standard_color' => array(
          'type' => 'color',
          'title' => __( 'Standard Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_standard_colors_enable' => true )
        ),
        'x_icon_post_standard_background' => array(
          'type' => 'color',
          'title' => __( 'Standard Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_standard_colors_enable' => true )
        ),
        'x_icon_post_image_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Image Post Custom Colors', '__x__' )
        ),
        'x_icon_post_image_color' => array(
          'type' => 'color',
          'title' => __( 'Image Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_image_colors_enable' => true )
        ),
        'x_icon_post_image_background' => array(
          'type' => 'color',
          'title' => __( 'Image Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_image_colors_enable' => true )
        ),
        'x_icon_post_gallery_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Gallery Post Custom Colors', '__x__' )
        ),
        'x_icon_post_gallery_color' => array(
          'type' => 'color',
          'title' => __( 'Gallery Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_gallery_colors_enable' => true )
        ),
        'x_icon_post_gallery_background' => array(
          'type' => 'color',
          'title' => __( 'Gallery Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_gallery_colors_enable' => true )
        ),
        'x_icon_post_video_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Video Post Custom Colors', '__x__' )
        ),
        'x_icon_post_video_color' => array(
          'type' => 'color',
          'title' => __( 'Video Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_video_colors_enable' => true )
        ),
        'x_icon_post_video_background' => array(
          'type' => 'color',
          'title' => __( 'Video Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_video_colors_enable' => true )
        ),
        'x_icon_post_audio_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Audio Post Custom Colors', '__x__' ),
        ),
        'x_icon_post_audio_color' => array(
          'type' => 'color',
          'title' => __( 'Audio Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_audio_colors_enable' => true )
        ),
        'x_icon_post_audio_background' => array(
          'type' => 'color',
          'title' => __( 'Audio Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_audio_colors_enable' => true )
        ),
        'x_icon_post_quote_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Quote Post Custom Colors', '__x__' )
        ),
        'x_icon_post_quote_color' => array(
          'type' => 'color',
          'title' => __( 'Quote Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_quote_colors_enable' => true )
        ),
        'x_icon_post_quote_background' => array(
          'type' => 'color',
          'title' => __( 'Quote Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_quote_colors_enable' => true )
        ),
        'x_icon_post_link_colors_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Link Post Custom Colors', '__x__' )
        ),
        'x_icon_post_link_color' => array(
          'type' => 'color',
          'title' => __( 'Link Post Text', '__x__' ),
          'condition' => array( 'x_icon_post_link_colors_enable' => true )
        ),
        'x_icon_post_link_background' => array(
          'type' => 'color',
          'title' => __( 'Link Post Background', '__x__' ),
          'condition' => array( 'x_icon_post_link_colors_enable' => true )
        ),
      ),
      'sections' => array(
        'shop' => array(
          'title'       => __( 'Shop Options', '__x__' ),
          'description' => __( 'Provide a title you would like to use for your shop. This will show up on the index page as well as in your breadcrumbs.', '__x__' ),
          'enabled' => X_WOOCOMMERCE_IS_ACTIVE,
          'controls' => array(
            'x_icon_shop_title' => array(
              'type' => 'text',
              'title' => __( 'Shop Title', '__x__' )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true ),
        )
      )
    ),

    'x-ethos' => array(
      'title'       => __( 'Ethos', '__x__' ),
      'description' => __( 'Ethos is a magazine-centric design that works great for blogs, news sites, or anything else that is content heavy with a focus on information. Customize the appearance of various items below and take note that some of these accent colors will be used for additional elements. For example, the "Navbar Background Color" option will also update the appearance of the widget titles in your sidebar.', '__x__' ),
      'condition' => array( 'x_stack' => 'ethos' ),
      'controls' => array(
        'x_ethos_topbar_background' => array(
          'type' => 'color',
          'title' => __( 'Topbar Background Color', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'x_ethos_navbar_background' => array(
          'type' => 'color',
          'title' => __( 'Navbar Background Color', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'x_ethos_sidebar_widget_headings_color' => array(
          'type' => 'color',
          'title' => __( 'Sidebar Widget Headings Color', '__x__' )
        ),
        'x_ethos_sidebar_color' => array(
          'type' => 'color',
          'title' => __( 'Sidebar Text Color', '__x__' )
        ),
      ),
      'sections' => array(
        'post-carousel' => array(
          'title'       => __( 'Post Carousel', '__x__' ),
          'description' => __( 'The "Post Carousel" is an element located above the masthead, which allows you to showcase your posts in various formats. If "Featured" is selected, you can choose which posts you would like to appear in this location in the post meta options.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_ethos_post_carousel_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Post Carousel', '__x__' )
            ),
            'x_ethos_post_carousel_count' => array(
              'type' => 'text',
              'title' => __( 'Posts Per Page', '__x__' ),
              'condition' => array( 'x_ethos_post_carousel_enable' => true )
            ),
            'x_ethos_post_carousel_display' => array(
              'type' => 'select',
              'title' => __( 'Display', '__x__' ),
              'condition' => array( 'x_ethos_post_carousel_enable' => true ),
              'options' => array(
                'choices' => $list_ethos_post_carousel_and_slider_display
              )
            ),
          ),
        ),
        'post-carousel-display' => array(
          'title'       => __( 'Post Carousel &ndash; Screen Display', '__x__' ),
          'description' => __( 'Select how many posts you would like to show for various screen sizes. Make sure to customize this section to suit your needs depending on how you have other options setup for your site (i.e. boxed site layout, fixed left or right navigation, et cetera).', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_ethos_post_carousel_enable' => true )
          ),
          'controls' => array(
            'x_ethos_post_carousel_display_count_extra_large' => array(
              'type' => 'text',
              'title' => __( 'Over 1500 Pixels', '__x__' )
            ),
            'x_ethos_post_carousel_display_count_large' => array(
              'type' => 'text',
              'title' => __( '1200 &ndash; 1499 Pixels', '__x__' )
            ),
            'x_ethos_post_carousel_display_count_medium' => array(
              'type' => 'text',
              'title' => __( '979 &ndash; 1199 Pixels', '__x__' )
            ),
            'x_ethos_post_carousel_display_count_small' => array(
              'type' => 'text',
              'title' => __( '550 &ndash; 978 Pixels', '__x__' )
            ),
            'x_ethos_post_carousel_display_count_extra_small' => array(
              'type' => 'text',
              'title' => __( 'Below 549 Pixels', '__x__' )
            ),
          ),
        ),
        'post-slider-blog' => array(
          'title'       => __( 'Post Slider &ndash; Blog', '__x__' ),
          'description' => __( 'The blog "Post Slider" is located at the top of the posts index page, which allows you to showcase your posts in various formats. If "Featured" is selected, you can choose which posts you would like to appear in this location in the post meta options.', '__x__' ),
          'controls' => array(
            'x_ethos_post_slider_blog_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Post Slider for Blog', '__x__' )
            ),
            'x_ethos_post_slider_blog_height' => array(
              'type' => 'text',
              'title' => __( 'Slider Height (px)', '__x__' ),
              'condition' => array( 'x_ethos_post_slider_blog_enable' => true )
            ),
            'x_ethos_post_slider_blog_count' => array(
              'type' => 'text',
              'title' => __( 'Posts Per Page', '__x__' ),
              'condition' => array( 'x_ethos_post_slider_blog_enable' => true )
            ),
            'x_ethos_post_slider_blog_display' => array(
              'type' => 'select',
              'title' => __( 'Display', '__x__' ),
              'condition' => array( 'x_ethos_post_slider_blog_enable' => true ),
              'options' => array(
                'choices' => $list_ethos_post_carousel_and_slider_display
              )
            ),
          ),
        ),
        'post-slider-archive' => array(
          'title'       => __( 'Post Slider &ndash; Archives', '__x__' ),
          'description' => __( 'The archive "Post Slider" is located at the top of all archive pages, which allows you to showcase your posts in various formats. If "Featured" is selected, you can choose which posts you would like to appear in this location in the post meta options.', '__x__' ),
          'controls' => array(
            'x_ethos_post_slider_archive_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Post Slider for Archives', '__x__' )
            ),
            'x_ethos_post_slider_archive_height' => array(
              'type' => 'text',
              'title' => __( 'Slider Height (px)', '__x__' ),
              'condition' => array( 'x_ethos_post_slider_archive_enable' => true )
            ),
            'x_ethos_post_slider_archive_count' => array(
              'type' => 'text',
              'title' => __( 'Posts Per Page', '__x__' ),
              'condition' => array( 'x_ethos_post_slider_archive_enable' => true )
            ),
            'x_ethos_post_slider_archive_display' => array(
              'type' => 'select',
              'title' => __( 'Display', '__x__' ),
              'condition' => array( 'x_ethos_post_slider_archive_enable' => true ),
              'options' => array(
                'choices' => $list_ethos_post_carousel_and_slider_display
              )
            ),
          ),
        ),
        'blog' => array(
          'title'       => __( 'Blog Options', '__x__' ),
          'description' => __( 'Enabling the filterable index will bypass the standard output of your blog page, allowing you to specify categories to highlight. Upon selecting this option, a text input will appear to enter in the IDs of the categories you would like to showcase. This input accepts a list of numeric IDs separated by a comma (e.g. 14, 1, 817).', '__x__' ),
          'controls' => array(
            'x_ethos_filterable_index_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Filterable Index', '__x__' ),
            ),
            'x_ethos_filterable_index_categories' => array(
              'type' => 'text',
              'title' => __( 'Category IDs', '__x__' ),
              'condition' => array( 'x_ethos_filterable_index_enable' => true )
            ),
          ),
        ),
        'shop' => array(
          'title'       => __( 'Shop Options', '__x__' ),
          'description' => __( 'Provide a title you would like to use for your shop. This will show up on the index page as well as in your breadcrumbs.', '__x__' ),
          'enabled' => X_WOOCOMMERCE_IS_ACTIVE,
          'controls' => array(
            'x_ethos_shop_title' => array(
              'type' => 'text',
              'title' => __( 'Shop Title', '__x__' )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true ),
        )
      )
    ),

    'x-layout-and-design' => array(
      'title'       => __( 'Layout and Design', '__x__' ),
      'description' => __( 'Select your site\'s global layout options here. "Site Width" is the percentage of the screen your site should take up while you can think of "Site Max Width" as an upper limit that your site will never be wider than. "Content Layout" has to do with your site\'s global setup of having a sidebar or not.', '__x__' ),
      'controls' => array(
        'x_layout_site' => array(
          'type' => 'select',
          'title' => __( 'Site Layout', '__x__' ),
          'options' => array(
            'choices' => array(
              'full-width' => __( 'Fullwidth', '__x__' ),
              'boxed'      => __( 'Boxed', '__x__' )
            )
          )
        ),
        'x_layout_site_max_width' => array(
          'type' => 'unit-slider',
          'title' => __( 'Site Max Width (px)', '__x__' ),
          'options' => array(
            'unit_mode' => 'unitless',
            'min'  => 500,
            'max'  => 1500,
            'step' => 10
          )
        ),
        'x_layout_site_width' => array(
          'type' => 'unit-slider',
          'title' => __( 'Site Width (%)', '__x__' ),
          'options' => array(
            'unit_mode' => 'unitless',
            'min'  => 72,
            'max'  => 90,
            'step' => 1
          )
        ),
        'x_layout_content' => array(
          'type' => 'select',
          'title' => __( 'Content Layout', '__x__' ),
          'options' => array(
            'choices' => array(
              'content-sidebar' => __( 'Content Left, Sidebar Right', '__x__' ),
              'sidebar-content' => __( 'Sidebar Left, Content Right', '__x__' ),
              'full-width'      => __( 'Fullwidth', '__x__' )
            )
          )
        ),
        'x_layout_content_width' => array(
          'type' => 'unit-slider',
          'title' => __( 'Content Width (%)', '__x__' ),
          'conditions' => array(
            array( 'option' => 'x_stack', 'value' => 'icon', 'op' => '!=' ),
            array( 'option' => 'x_layout_content', 'value' => 'full-width', 'op' => '!=' )
          ),
          'options' => array(
            'unit_mode' => 'unitless',
            'min'  => 60,
            'max'  => 74,
            'step' => 1
          )
        ),
        'x_layout_sidebar_width' => array(
          'type' => 'text',
          'title' => __( 'Sidebar Width (px)', '__x__' ),
          'conditions' => array(
            array( 'x_stack' => 'icon' ),
            array( 'option' => 'x_layout_content', 'value' => 'full-width', 'op' => '!=' )
          ),
        ),
      ),
      'sections' => array(
        'background' => array(
          'title'       => __( 'Background Options', '__x__' ),
          'description' => __( 'The "Background Pattern" setting will override the "Background Color" unless the image used is transparent, and the "Background Image" option will take precedence over both. The "Background Image Fade (ms)" option allows you to set a time in milliseconds for your image to fade in. To disable this feature, set the value to "0."', '__x__' ),
          'controls' => array(
            'x_design_bg_color' => array(
              'type' => 'color',
              'title' => __( 'Background Color', '__x__' )
            ),
            'x_design_bg_image_pattern' => array(
              'type' => 'image',
              'title' => __( 'Background Pattern', '__x__' ),
              'options' => array(
                'pattern' => true
              )
            ),
            'x_design_bg_image_full' => array(
              'type' => 'image',
              'title' => __( 'Background Image', '__x__' )
            ),
            'x_design_bg_image_full_fade' => array(
              'type' => 'text',
              'title' => __( 'Background Image Fade (ms)', '__x__' )
            ),
          ),
        )
      )
    ),

    'x-typography' => array(
      'title'       => __( 'Typography', '__x__' ),
      'description' => __( 'Here you will find global typography options for your body copy and headings, while more specific typography options for elements like your navbar are found grouped with that element to make customization more streamlined. If you are using Google Fonts, you can also enable custom subsets here for expanded character sets.<br><br>Disabling the font manager is not recommended, but will allow direct usage of System and Google Fonts.', '__x__' ),
      'controls' => array(
        'x_enable_font_manager' => array(
          'type' => 'toggle',
          'title' => __( 'Enable Font Manager', '__x__' ),
        )
      ),
      'sections' => array(
        'root-font-size' => array(
          'title'       => __('Root Font Size', '__x__' ),
          'description' => __( 'Select the method for outputting your site\'s root font size, then adjust the settings to suit your design. "Stepped" mode allows you to set a font size at each of your site\'s breakpoints, whereas "Scaling" will dymaically scale between a range of minimum and maximum font sizes and breakpoints that you specify.', '__x__' ),
          'controls'    => array(
            'x_root_font_size_mode' => array(
              'type' => 'select',
              'title' => __( 'Root Font Size Mode', '__x__' ),
              'options' => array(
                'choices' => array(
                  'stepped' => __( 'Stepped', '__x__' ),
                  'scaling' => __( 'Scaling', '__x__' )
                )
              )
            ),
            'x_root_font_size_stepped_unit' => array(
              'type' => 'select',
              'title' => __( 'Font Size Unit', '__x__' ),
              'options' => array(
                'choices' => array(
                  'px' => __( 'px', '__x__' ),
                  'em' => __( 'em', '__x__' )
                )
              ),
              'condition' => array( 'x_root_font_size_mode' => 'stepped' )
            ),
            'x_root_font_size_stepped_xs' => array(
              'type' => 'text',
              'title' => __( 'Font Size (xs)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'stepped' )
            ),
            'x_root_font_size_stepped_sm' => array(
              'type' => 'text',
              'title' => __( 'Font Size (sm)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'stepped' )
            ),
            'x_root_font_size_stepped_md' => array(
              'type' => 'text',
              'title' => __( 'Font Size (md)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'stepped' )
            ),
            'x_root_font_size_stepped_lg' => array(
              'type' => 'text',
              'title' => __( 'Font Size (lg)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'stepped' )
            ),
            'x_root_font_size_stepped_xl' => array(
              'type' => 'text',
              'title' => __( 'Font Size (xl)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'stepped' )
            ),
            'x_root_font_size_scaling_unit' => array(
              'type' => 'select',
              'title' => __( 'Font Size Unit', '__x__' ),
              'options' => array(
                'choices' => array(
                  'px' => __( 'px', '__x__' ),
                  'em' => __( 'em', '__x__' )
                )
              ),
              'condition' => array( 'x_root_font_size_mode' => 'scaling' )
            ),
            'x_root_font_size_scaling_min' => array(
              'type' => 'text',
              'title' => __( 'Minimum Font Size', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'scaling' )
            ),
            'x_root_font_size_scaling_max' => array(
              'type' => 'text',
              'title' => __( 'Maximum Font Size', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'scaling' )
            ),
            'x_root_font_size_scaling_lower_limit' => array(
              'type' => 'text',
              'title' => __( 'Lower Limit (Breakpoint)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'scaling' )
            ),
            'x_root_font_size_scaling_upper_limit' => array(
              'type' => 'text',
              'title' => __( 'Upper Limit (Breakpoint)', '__x__' ),
              'condition' => array( 'x_root_font_size_mode' => 'scaling' )
            ),
          ),  
        ),
        'google-subsets' => array(
          'title' => __('Google Subsets', '__x__' ),
          'controls' => array(
            'x_google_fonts_subsets' => array(
              'type' => 'toggle',
              'title' => __( 'Google Fonts Subsets', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_google_fonts_subset_cyrillic' => array(
              'type' => 'toggle',
              'title' => __( 'Cyrillic', '__x__' ),
              'conditions' => array(
                array( 'x_enable_font_manager' => false ),
                array( 'x_google_fonts_subsets' => true )
              )
            ),
            'x_google_fonts_subset_greek' => array(
              'type' => 'toggle',
              'title' => __( 'Greek', '__x__' ),
              'conditions' => array(
                array( 'x_enable_font_manager' => false ),
                array( 'x_google_fonts_subsets' => true )
              )
            ),
            'x_google_fonts_subset_vietnamese' => array(
              'type' => 'toggle',
              'title' => __( 'Vietnamese', '__x__' ),
              'conditions' => array(
                array( 'x_enable_font_manager' => false ),
                array( 'x_google_fonts_subsets' => true )
              )
            )
          )
        ),
        'body-and-content' => array(
          'title'       => __( 'Body and Content', '__x__' ),
          'description' => __( '"Content Font Size (rem)" will affect the sizing of all copy inside a post or page content area. It uses rems, which are a unit relative to your root font size. For example, if your root font size is 10px and you want your content font size to be 12px, you would enter "1.2" as a value. Headings are set with percentages and sized proportionally to these settings.', '__x__' ),
          'controls' => array(
            'x_body_font_family_selection' => array(
              'type' => 'font-family',
              'title' => __( 'Body Font', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_body_font_family' => array(
              'type' => 'select',
              'title' => __( 'Body Font', '__x__' ),
              'options' => array(
                'choices' => 'list:fonts'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_body_font_color' => array(
              'type' => 'color',
              'title' => __( 'Body Font Color', '__x__' )
            ),
            'x_content_font_size' => array(
              'type' => 'text',
              'title' => __( 'Content Font Size (rem)', '__x__' )
            ),
            'x_body_font_weight_selection' => array(
              'type' => 'font-weight',
              'title' => __( 'Body Font Weight', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true ),
              'options' => array(
                'references' => array(
                  array( 'key' => 'font_family', 'source' => 'x_body_font_family_selection' )
                )
              )
            ),
            'x_body_font_italic' => array(
              'type' => 'toggle',
              'title' => __( 'Body Font Italic', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_body_font_weight' => array(
              'type' => 'select',
              'title' => __( 'Body Font Weight', '__x__' ),
              'options' => array(
                'filter' => array(
                  'key'    => 'choices',
                  'method' => 'font-weights',
                  'source' => 'x_body_font_family',
                ),
                'choices' => 'list:font-weights'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            )
          ),
        ),
        'headings' => array(
          'title'       => __( 'Headings', '__x__' ),
          'description' => __( 'The letter spacing controls for each heading level will only affect that heading if it does not have a "looks like" class or if the "looks like" class matches that level. For example, if you have an &lt;h1&gt; with no modifier class, the &lt;h1&gt; slider will affect that heading. However, if your &lt;h1&gt; has an .h2 modifier class, then the &lt;h2&gt; slider will take over as it is supposed to appear as an &lt;h2&gt;.', '__x__' ),
          'controls' => array(
            'x_headings_font_family_selection' => array(
              'type' => 'font-family',
              'title' => __( 'Headings Font', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_headings_font_family' => array(
              'type' => 'select',
              'title' => __( 'Headings Font', '__x__' ),
              'options' => array(
                'choices' => 'list:fonts'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_headings_font_color' => array(
              'type' => 'color',
              'title' => __( 'Headings Font Color', '__x__' )
            ),
            'x_headings_font_weight_selection' => array(
              'type' => 'font-weight',
              'title' => __( 'Headings Font Weight', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true ),
              'options' => array(
                'references' => array(
                  array( 'key' => 'font_family', 'source' => 'x_headings_font_family_selection' )
                )
              )
            ),
            'x_headings_font_italic' => array(
              'type' => 'toggle',
              'title' => __( 'Headings Font Italic', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_headings_font_weight' => array(
              'type' => 'select',
              'title' => __( 'Headings Font Weight', '__x__' ),
              'options' => array(
                'filter' => array(
                  'key'    => 'choices',
                  'method' => 'font-weights',
                  'source' => 'x_headings_font_family',
                ),
                'choices' => 'list:font-weights'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_h1_letter_spacing' => array(
              'type' => 'unit-slider',
              'title' => __( 'h1 Letter Spacing (em)', '__x__' ),
              'options' => $list_letter_spacing
            ),
            'x_h2_letter_spacing' => array(
              'type' => 'unit-slider',
              'title' => __( 'h2 Letter Spacing (em)', '__x__' ),
              'options' => $list_letter_spacing
            ),
            'x_h3_letter_spacing' => array(
              'type' => 'unit-slider',
              'title' => __( 'h3 Letter Spacing (em)', '__x__' ),
              'options' => $list_letter_spacing
            ),
            'x_h4_letter_spacing' => array(
              'type' => 'unit-slider',
              'title' => __( 'h4 Letter Spacing (em)', '__x__' ),
              'options' => $list_letter_spacing
            ),
            'x_h5_letter_spacing' => array(
              'type' => 'unit-slider',
              'title' => __( 'h5 Letter Spacing (em)', '__x__' ),
              'options' => $list_letter_spacing
            ),
            'x_h6_letter_spacing' => array(
              'type' => 'unit-slider',
              'title' => __( 'h6 Letter Spacing (em)', '__x__' ),
              'options' => $list_letter_spacing
            ),
            'x_headings_uppercase_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Uppercase', '__x__' )
            ),
            'x_headings_widget_icons_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Widget Icons', '__x__' )
            ),
          ),
        ),
        'site-links' => array(
          'title'       => __( 'Site Links', '__x__' ),
          'description' => __( 'Site link colors are also used as accents for various elements throughout your site, so make sure to select something you really enjoy and keep an eye out for how it affects your design.', '__x__' ),
          'controls' => array(
            'x_site_link_color' => array(
              'type' => 'color',
              'title' => __( 'Site Links', '__x__' )
            ),
            'x_site_link_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Site Links Hover', '__x__' )
            ),
          ),
        )
      )
    ),

    'x-buttons' => array(
      'title'       => __( 'Buttons', '__x__' ),
      'description' => __( 'Retina ready, limitless colors, and multiple shapes. The buttons available in X are fun to use, simple to implement, and look great on all devices no matter the size.', '__x__' ),
      'controls' => array(
        'x_button_style' => array(
          'type' => 'select',
          'title' => __( 'Button Style', '__x__' ),
          'options' => array(
            'choices' => array(
              'real'        => __( '3D', '__x__' ),
              'flat'        => __( 'Flat', '__x__' ),
              'transparent' => __( 'Transparent', '__x__' )
            )
          )
        ),
        'x_button_shape' => array(
          'type' => 'select',
          'title' => __( 'Button Shape', '__x__' ),
          'options' => array(
            'choices' => array(
              'square'  => __( 'Square', '__x__' ),
              'rounded' => __( 'Rounded', '__x__' ),
              'pill'    => __( 'Pill', '__x__' )
            )
          )
        ),
        'x_button_size' => array(
          'type' => 'select',
          'title' => __( 'Button Size', '__x__' ),
          'options' => array(
            'choices' => array(
              'mini'    => __( 'Mini', '__x__' ),
              'small'   => __( 'Small', '__x__' ),
              'regular' => __( 'Regular', '__x__' ),
              'large'   => __( 'Large', '__x__' ),
              'x-large' => __( 'Extra Large', '__x__' ),
              'jumbo'   => __( 'Jumbo', '__x__' )
            )
          )
        ),
      ),
      'sections' => array(
        'colors' => array(
          'title'       => __( 'Colors', '__x__' ),
          'controls' => array(
            'x_button_color' => array(
              'type' => 'color',
              'title' => __( 'Button Text', '__x__' )
            ),
            'x_button_background_color' => array(
              'type' => 'color',
              'title' => __( 'Button Background', '__x__' ),
              'condition' => array( 'option' => 'x_button_style', 'value' => 'transparent', 'op' => '!=' )
            ),
            'x_button_border_color' => array(
              'type' => 'color',
              'title' => __( 'Button Border', '__x__' )
            ),
            'x_button_bottom_color' => array(
              'type' => 'color',
              'title' => __( 'Button Bottom', '__x__' ),
              'condition' => array( 'option' => 'x_button_style', 'value' => array( 'flat', 'transparent' ), 'op' => 'NOT IN' )
            ),
          )
        ),
        'hover-colors' => array(
          'title'       => __( 'Hover Colors', '__x__' ),
          'controls' => array(
            'x_button_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Button Text', '__x__' )
            ),
            'x_button_background_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Button Background', '__x__' ),
              'condition' => array( 'option' => 'x_button_style', 'value' => 'transparent', 'op' => '!=' )
            ),
            'x_button_border_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Button Border', '__x__' )
            ),
            'x_button_bottom_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Button Bottom', '__x__' ),
              'condition' => array( 'option' => 'x_button_style', 'value' => array( 'flat', 'transparent' ), 'op' => 'NOT IN' )
            ),
          )
        )
      )
    ),

    'x-header' => array(
      'title'       => __( 'Header', '__x__' ),
      'description' => 'component:options/launch-headers',
      'sections' => array(
        'navbar' => array(
          'title'       => __( 'Navbar', '__x__' ),
          'description' => __( '"Navbar Top Height (px)" must still be set even when using "Fixed Left" or "Fixed Right" positioning because on tablet and mobile devices, the menu is pushed to the top.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_navbar_positioning' => array(
              'type' => 'select',
              'title' => __( 'Navbar Position', '__x__' ),
              'options' => array(
                'choices' => array(
                  'static-top'  => __( 'Static Top', '__x__' ),
                  'fixed-top'   => __( 'Fixed Top', '__x__' ),
                  'fixed-left'  => __( 'Fixed Left', '__x__' ),
                  'fixed-right' => __( 'Fixed Right', '__x__' )
                )
              )
            ),
            'x_navbar_height' => array(
              'type' => 'text',
              'title' => __( 'Navbar Top Height (px)', '__x__' )
            ),
            'x_navbar_width' => array(
              'type' => 'text',
              'title' => __( 'Navbar Side Width (px)', '__x__' ),
              'condition' => array( 'option' => 'x_navbar_positioning', 'value' => array( 'fixed-right', 'fixed-left' ), 'op' => 'IN' ),
            ),
          ),
        ),
        'logo-and-navigation' => array(
          'title'       => __( 'Logo and Navigation', '__x__' ),
          'description' => __( 'Selecting "Inline" for your logo and navigation layout will place them both in the navbar. Selecting "Stacked" will place the logo in a separate section above the navbar.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_logo_navigation_layout' => array(
              'type' => 'select',
              'title' => __( 'Layout', '__x__' ),
              'options' => array(
                'choices' => array(
                  'inline'  => __( 'Inline', '__x__' ),
                  'stacked' => __( 'Stacked', '__x__' )
                )
              )
            ),
            'x_logobar_adjust_spacing_top' => array(
              'type' => 'text',
              'title' => __( 'Logobar Top Spacing (px)', '__x__' ),
              'condition' => array( 'x_logo_navigation_layout' => 'stacked' )
            ),
            'x_logobar_adjust_spacing_bottom' => array(
              'type' => 'text',
              'title' => __( 'Logobar Bottom Spacing (px)', '__x__' ),
              'condition' => array( 'x_logo_navigation_layout' => 'stacked' )
            ),
          ),
        ),
        'logo-text' => array(
          'title'       => __( 'Logo &ndash; Text', '__x__' ),
          'description' => __( 'Your logo will show up as text by default. Alternately, if you would like to use an image, upload it under the "Logo &ndash; Image" section below, which will automatically switch over. Logo alignment can also be adjusted under the "Logo &ndash; Alignment" section.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_logo_font_family_selection' => array(
              'type' => 'font-family',
              'title' => __( 'Logo Font', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_logo_font_family' => array(
              'type' => 'select',
              'title' => __( 'Logo Font', '__x__' ),
              'options' => array(
                'choices' => 'list:fonts'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_logo_font_color' => array(
              'type' => 'color',
              'title' => __( 'Logo Font Color', '__x__' )
            ),
            'x_logo_font_size' => array(
              'type' => 'text',
              'title' => __( 'Logo Font Size (px)', '__x__' )
            ),
            'x_logo_font_weight_selection' => array(
              'type' => 'font-weight',
              'title' => __( 'Logo Font Weight', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true ),
              'options' => array(
                'references' => array(
                  array( 'key' => 'font_family', 'source' => 'x_logo_font_family_selection' )
                )
              )
            ),
            'x_logo_font_italic' => array(
              'type' => 'toggle',
              'title' => __( 'Logo Font Italic', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_logo_font_weight' => array(
              'type' => 'select',
              'title' => __( 'Logo Font Weight', '__x__' ),
              'options' => array(
                'filter' => array(
                  'key'    => 'choices',
                  'method' => 'font-weights',
                  'source' => 'x_logo_font_family',
                ),
                'choices' => 'list:font-weights'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_logo_letter_spacing' => array(
              'type' => 'slider',
              'title' => __( 'Logo Letter Spacing (em)', '__x__' ),
              'options' => array(
                'choices' => $list_letter_spacing
              )
            ),
            'x_logo_uppercase_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Uppercase', '__x__' )
            ),
          ),
        ),
        'logo-image' => array(
          'title'       => __( 'Logo &ndash; Image', '__x__' ),
          'description' => __( 'To make your logo retina ready, enter in the width of your uploaded image in the "Logo Width (px)" field and we\'ll take care of all the calculations for you. If you want your logo to stay the original size that was uploaded, leave the field blank.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_logo' => array(
              'type' => 'image',
              'title' => __( 'Logo Upload', '__x__' )
            ),
            'x_logo_width' => array(
              'type' => 'text',
              'title' => __( 'Logo Width (px)', '__x__' )
            ),
          ),
        ),
        'logo-alignment' => array(
          'title'       => __( 'Logo &ndash; Alignment', '__x__' ),
          'description' => __( 'Use the following controls to vertically align your logo as desired. Make sure to adjust your top alignment even if your navbar is fixed to a side as it will reformat to the top on smaller screens (this control will be hidden if you do not have a side navigation position selected).', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_logo_adjust_navbar_top' => array(
              'type' => 'text',
              'title' => __( 'Navbar Top Logo Alignment (px)', '__x__' )
            ),
            'x_logo_adjust_navbar_side' => array(
              'type' => 'text',
              'title' => __( 'Navbar Side Logo Alignment (px)', '__x__' )
            ),
          ),
        ),
        'links-text' => array(
          'title'       => __( 'Links &ndash; Text', '__x__' ),
          'description' => __( 'Alter the appearance of the top-level navbar links for your site here and their alignment and spacing in the section below.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_navbar_font_family_selection' => array(
              'type' => 'font-family',
              'title' => __( 'Navbar Font', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_navbar_font_family' => array(
              'type' => 'select',
              'title' => __( 'Navbar Font', '__x__' ),
              'options' => array(
                'choices' => 'list:fonts'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_navbar_link_color' => array(
              'type' => 'color',
              'title' => __( 'Navbar Links', '__x__' )
            ),
            'x_navbar_link_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Navbar Links Hover', '__x__' )
            ),
            'x_navbar_font_size' => array(
              'type' => 'text',
              'title' => __( 'Navbar Font Size (px)', '__x__' )
            ),
            'x_navbar_font_weight_selection' => array(
              'type' => 'font-weight',
              'title' => __( 'Navbar Font Weight', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true ),
              'options' => array(
                'references' => array(
                  array( 'key' => 'font_family', 'source' => 'x_navbar_font_family_selection' )
                )
              )
            ),
            'x_navbar_font_italic' => array(
              'type' => 'toggle',
              'title' => __( 'Navbar Font Italic', '__x__' ),
              'condition' => array( 'x_enable_font_manager' => true )
            ),
            'x_navbar_font_weight' => array(
              'type' => 'select',
              'title' => __( 'Navbar Font Weight', '__x__' ),
              'options' => array(
                'filter' => array(
                  'key'    => 'choices',
                  'method' => 'font-weights',
                  'source' => 'x_navbar_font_family',
                ),
                'choices' => 'list:font-weights'
              ),
              'condition' => array( 'x_enable_font_manager' => false )
            ),
            'x_navbar_letter_spacing' => array(
              'type' => 'slider',
              'title' => __( 'Navbar Letter Spacing (em)', '__x__' ),
              'options' => array(
                'choices' => $list_letter_spacing
              )
            ),
            'x_navbar_uppercase_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Uppercase', '__x__' )
            ),
          ),
        ),
        'links-alignment' => array(
          'title'       => __( 'Links &ndash; Alignment', '__x__' ),
          'description' => __( 'Customize the vertical alignment of your links for both top and side navbar positions as well as alter the vertical spacing between links for top navbar positions with the "Navbar Top Link Spacing (px)" control.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_navbar_adjust_links_top' => array(
              'type' => 'text',
              'title' => __( 'Navbar Top Link Alignment (px)', '__x__' )
            ),
            'x_navbar_adjust_links_top_spacing' => array(
              'type' => 'text',
              'title' => __( 'Navbar Top Link Spacing (px)', '__x__' )
            ),
            'x_navbar_adjust_links_side' => array(
              'type' => 'text',
              'title' => __( 'Navbar Side Link Alignment (px)', '__x__' )
            ),
          ),
        ),
        'search' => array(
          'title'       => __( 'Search', '__x__' ),
          'description' => __( 'Activate search functionality for the navbar. If activated, an icon will appear that when clicked will activate the search modal.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_header_search_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Navbar Search', '__x__' )
            ),
          ),
        ),
        'mobile-button' => array(
          'title'       => __( 'Mobile Button', '__x__' ),
          'description' => __( 'Adjust the vertical alignment and size of the mobile button that appears on smaller screen sizes in your navbar.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_navbar_adjust_button_size' => array(
              'type' => 'text',
              'title' => __( 'Mobile Navbar Button Size (px)', '__x__' )
            ),
            'x_navbar_adjust_button' => array(
              'type' => 'text',
              'title' => __( 'Mobile Navbar Button Alignment (px)', '__x__' )
            ),
          ),
        ),
        'widgetbar' => array(
          'title' => __('Widgetbar', '__x__'),
          'description' => __('Adjust the vertical alignment and size of the mobile button that appears on smaller screen sizes in your navbar.', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls' => array(
            'x_header_widget_areas' => array(
              'type' => 'select',
              'title' => __( 'Header Widget Areas', '__x__' ),
              'options' => array(
                'choices' => $list_widget_areas
              )
            ),
            'x_widgetbar_button_background' => array(
              'type' => 'color',
              'title' => __( 'Widgetbar Button Background', '__x__' ),
              'condition' => array( 'option' => 'x_header_widget_areas', 'value' => 0, 'op' => '!=' ),
            ),
            'x_widgetbar_button_background_hover' => array(
              'type' => 'color',
              'title' => __( 'Widgetbar Button Background Hover', '__x__' ),
              'condition' => array( 'option' => 'x_header_widget_areas', 'value' => 0, 'op' => '!=' ),
            )
          )
        ),

        'miscellaneous' => array(
          'title'       => __( 'Miscellaneous', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
          'controls'    => array(
            'x_topbar_display' => array(
              'type' => 'toggle',
              'title' => __( 'Topbar', '__x__' )
            ),
            'x_topbar_content' => array(
              'type' => 'textarea',
              'title' => __( 'Topbar Content', '__x__' ),
              'condition' => array( 'x_topbar_display' => true )
            ),
            'x_breadcrumb_display' => array(
              'type' => 'toggle',
              'title' => __( 'Breadcrumbs', '__x__' )
            ),
          )
        )

      )
    ),

    'x-footer' => array(
      'title'       => __( 'Footer', '__x__' ),
      'description' => 'component:options/launch-footers',
      'controls' => array(
        'x_footer_widget_areas' => array(
          'type' => 'select',
          'title' => __( 'Footer Widget Areas', '__x__' ),
          'condition' => array( 'virtual:classic_footers' => true ),
          'options' => array(
            'choices' => $list_widget_areas
          )
        ),
        'x_footer_bottom_display' => array(
          'type' => 'toggle',
          'title' => __( 'Bottom Footer', '__x__' ),
          'condition' => array( 'virtual:classic_footers' => true ),
        ),
        'x_footer_menu_display' => array(
          'type' => 'toggle',
          'title' => __( 'Footer Menu', '__x__' ),
          'conditions' => array(
            array( 'x_footer_bottom_display' => true ),
            array( 'virtual:classic_footers' => true )
          )
        ),
        'x_footer_social_display' => array(
          'type' => 'toggle',
          'title' => __( 'Footer Social', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_footers' => true ),
            array( 'x_footer_bottom_display' => true )
          )
        ),
        'x_footer_content_display' => array(
          'type' => 'toggle',
          'title' => __( 'Footer Content', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_footers' => true ),
            array( 'x_footer_bottom_display' => true )
          )
        ),
        'x_footer_content' => array(
          'type' => 'textarea',
          'title' => __( 'Footer Content', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_footers' => true ),
            array( 'x_footer_bottom_display' => true ),
            array( 'x_footer_content_display' => true )
          )
        ),
      )
    ),

    'x-blog' => array(
      'title'       => __( 'Blog', '__x__' ),
      'description' => __( 'Adjust the style and layout of your blog using the settings below. This will only affect the posts index page of your blog and will not alter any archive or search results pages. The "Layout" option allows you to keep your sidebar on your posts index page if you have already selected "Content Left, Sidebar Right" or "Sidebar Left, Content Right" for you "Content Layout" option, or remove the sidebar completely if desired.', '__x__' ),
      'controls' => array(
        'x_blog_style' => array(
          'type' => 'select',
          'title' => __( 'Style', '__x__' ),
          'options' => array(
            'choices' => $list_blog_styles
          )
        ),
        'x_blog_layout' => array(
          'type' => 'select',
          'title' => __( 'Layout', '__x__' ),
          'options' => array(
            'choices' => $list_section_layouts
          )
        ),
        'x_blog_masonry_columns' => array(
          'type' => 'select',
          'title' => __( 'Columns', '__x__' ),
          'condition' => array( 'x_blog_style' => 'masonry' ),
          'options' => array(
            'choices' => $list_masonry_columns
          )
        ),
      ),
      'sections' => array(
        'archives' => array(
          'title'       => __( 'Archives', '__x__' ),
          'description' => __( 'Adjust the style and layout of your archive pages using the settings below. The "Layout" option allows you to keep your sidebar on your posts index page if you have already selected "Content Left, Sidebar Right" or "Sidebar Left, Content Right" for you "Content Layout" option, or remove the sidebar completely if desired.', '__x__' ),
          'controls' => array(
            'x_archive_style' => array(
              'type' => 'select',
              'title' => __( 'Style', '__x__' ),
              'options' => array(
                'choices' => $list_blog_styles
              )
            ),
            'x_archive_layout' => array(
              'type' => 'select',
              'title' => __( 'Layout', '__x__' ),
              'options' => array(
                'choices' => $list_section_layouts
              )
            ),
            'x_archive_masonry_columns' => array(
              'type' => 'select',
              'title' => __( 'Columns', '__x__' ),
              'condition' => array( 'x_archive_style' => 'masonry' ),
              'options' => array(
                'choices' => $list_masonry_columns
              )
            ),
          ),
        ),
        'content' => array(
          'title'       => __( 'Content', '__x__' ),
          'description' => __( 'Selecting the "Enable Full Post Content on Index" option below will allow the entire contents of your posts to be shown on the post index pages for all stacks. Deselecting this option will allow you to set the length of your excerpt.', '__x__' ),
          'controls' => array(
            'x_blog_enable_post_meta' => array(
              'type' => 'toggle',
              'title' => __( 'Post Meta', '__x__' )
            ),
            'x_blog_enable_full_post_content' => array(
              'type' => 'toggle',
              'title' => __( 'Full Post Content on Index', '__x__' )
            ),
            'x_blog_excerpt_length' => array(
              'type' => 'text',
              'title' => __( 'Excerpt Length', '__x__' ),
              'condition' => array( 'x_blog_enable_full_post_content' => true )
            ),
          ),
        )
      )
    ),

    'x-portfolio' => array(
      'title'       => __( 'Portfolio', '__x__' ),
      'description' => __( 'Setting your custom portfolio slug allows you to create a unique URL structure for your archive pages that suits your needs. When you update it, remember to save your Permalinks again to avoid any potential errors.', '__x__' ),
      'controls' => array(
        'x_custom_portfolio_slug' => array(
          'type' => 'text',
          'title' => __( 'Custom URL Slug', '__x__' )
        ),
      ),
      'sections' => array(
        'content' => array(
          'title'       => __( 'Content', '__x__' ),
          'controls' => array(
            'x_portfolio_enable_cropped_thumbs' => array(
              'type' => 'toggle',
              'title' => __( 'Cropped Featured Images', '__x__' )
            ),
            'x_portfolio_enable_post_meta' => array(
              'type' => 'toggle',
              'title' => __( 'Post Meta', '__x__' )
            ),
          )
        ),
        'labels' => array(
          'title'       => __( 'Labels', '__x__' ),
          'controls' => array(
            'x_portfolio_tag_title' => array(
              'type' => 'text',
              'title' => __( 'Tag List Title', '__x__' )
            ),
            'x_portfolio_launch_project_title' => array(
              'type' => 'text',
              'title' => __( 'Launch Project Title', '__x__' )
            ),
            'x_portfolio_launch_project_button_text' => array(
              'type' => 'text',
              'title' => __( 'Launch Project Button Text', '__x__' )
            ),
            'x_portfolio_share_project_title' => array(
              'type' => 'text',
              'title' => __( 'Share Project Title', '__x__' )
            ),
          )
        ),
        'sharing' => array(
          'title'       => __( 'Sharing', '__x__' ),
          'controls' => array(
            'x_portfolio_enable_facebook_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'Facebook Sharing Link', '__x__' )
            ),
            'x_portfolio_enable_twitter_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'Twitter Sharing Link', '__x__' )
            ),
            'x_portfolio_enable_google_plus_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'Google+ Sharing Link', '__x__' )
            ),
            'x_portfolio_enable_linkedin_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'LinkedIn Sharing Link', '__x__' )
            ),
            'x_portfolio_enable_pinterest_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'Pinterest Sharing Link', '__x__' )
            ),
            'x_portfolio_enable_reddit_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'Reddit Sharing Link', '__x__' )
            ),
            'x_portfolio_enable_email_sharing' => array(
              'type' => 'toggle',
              'title' => __( 'Email Sharing Link', '__x__' )
            ),
          )
        )
      )
    ),

    'x-social' => array(
      'title'       => __( 'Social', '__x__' ),
      'description' => __( 'Set the URLs for your social media profiles here to be used in the topbar and bottom footer. Adding in a link will make its respective icon show up without needing to do anything else. Keep in mind that these sections are not necessarily intended for a lot of items, so adding all icons could create some layout issues. It is typically best to keep your selections here to a minimum for structural purposes and for usability purposes so you do not overwhelm your visitors.', '__x__' ),
      'controls' => array(
        'x_social_facebook' => array(
          'type' => 'text',
          'title' => __( 'Facebook Profile URL', '__x__' )
        ),
        'x_social_twitter' => array(
          'type' => 'text',
          'title' => __( 'Twitter Profile URL', '__x__' )
        ),
        'x_social_googleplus' => array(
          'type' => 'text',
          'title' => __( 'Google+ Profile URL', '__x__' )
        ),
        'x_social_linkedin' => array(
          'type' => 'text',
          'title' => __( 'LinkedIn Profile URL', '__x__' )
        ),
        'x_social_xing' => array(
          'type' => 'text',
          'title' => __( 'XING Profile URL', '__x__' )
        ),
        'x_social_foursquare' => array(
          'type' => 'text',
          'title' => __( 'Foursquare Profile URL', '__x__' )
        ),
        'x_social_youtube' => array(
          'type' => 'text',
          'title' => __( 'YouTube Profile URL', '__x__' )
        ),
        'x_social_vimeo' => array(
          'type' => 'text',
          'title' => __( 'Vimeo Profile URL', '__x__' )
        ),
        'x_social_instagram' => array(
          'type' => 'text',
          'title' => __( 'Instagram Profile URL', '__x__' )
        ),
        'x_social_pinterest' => array(
          'type' => 'text',
          'title' => __( 'Pinterest Profile URL', '__x__' )
        ),
        'x_social_dribbble' => array(
          'type' => 'text',
          'title' => __( 'Dribbble Profile URL', '__x__' )
        ),
        'x_social_flickr' => array(
          'type' => 'text',
          'title' => __( 'Flickr Profile URL', '__x__' )
        ),
        'x_social_github' => array(
          'type' => 'text',
          'title' => __( 'GitHub Profile URL', '__x__' )
        ),
        'x_social_behance' => array(
          'type' => 'text',
          'title' => __( 'Behance Profile URL', '__x__' )
        ),
        'x_social_tumblr' => array(
          'type' => 'text',
          'title' => __( 'Tumblr Profile URL', '__x__' )
        ),
        'x_social_whatsapp' => array(
          'type' => 'text',
          'title' => __( 'Whatsapp Profile URL', '__x__' )
        ),
        'x_social_soundcloud' => array(
          'type' => 'text',
          'title' => __( 'SoundCloud Profile URL', '__x__' )
        ),
        'x_social_rss' => array(
          'type' => 'text',
          'title' => __( 'RSS Feed URL', '__x__' )
        ),
      ),
      'sections' => array(
        'open-graph' => array(
          'title'       => __( 'Open Graph', '__x__' ),
          'description' => __( 'X outputs standard Open Graph tags for your content. If you are employing another solution for this, you can disable X\'s Open Graph tag output here.', '__x__' ),
          'controls' => array(
            'x_social_open_graph' => array(
              'type' => 'toggle',
              'title' => __( 'Enable Open Graph', '__x__' )
            ),
          ),
        ),
        'fallback-image' => array(
          'title'       => __( 'Social Fallback Image', '__x__' ),
          'description' => __( 'The "Social Fallback Image" is used throughout X with various social media network APIs. It is used as a default on pages that do not have a featured image set. You do not have to specify one; however, it is recommended if you are using X\'s native Open Graph implementation, entry sharing, et cetera.', '__x__' ),
          'controls' => array(
            'x_social_fallback_image' => array(
              'type' => 'image',
              'title' => __( 'Social Fallback Image', '__x__' )
            ),
          ),
        )
      )
    ),

    'x-site-icons' => array(
      'title'       => __( 'Site Icons', '__x__' ),
      'description' => __( 'Easily manage your favicon for desktop, touch icon for mobile devices, and tile icon for the Windows 8 Metro interface in this section. If an image is not set, nothing will be output for that particular icon type. When setting the path to your favicon, make sure you are using the ".ico" format. A 152x152 PNG should be used for your touch icon, and a 144x144 PNG should be used for your tile icon. The color you set for your tile icon will be used behind your image.', '__x__' ),
      'controls' => array(
        'x_icon_favicon' => array(
          'type' => 'text',
          'title' => __( 'Favicon (Set Path to Image Below)', '__x__' )
        ),
        'x_icon_touch' => array(
          'type' => 'image',
          'title' => __( 'Touch Icon (iOS and Android)', '__x__' )
        ),
        'x_icon_tile' => array(
          'type' => 'image',
          'title' => __( 'Tile Icon (Microsoft)', '__x__' )
        ),
        'x_icon_tile_bg_color' => array(
          'type' => 'color',
          'title' => __( 'Tile Icon Background Color', '__x__' )
        ),
      ),
    ),

    'x-miscellaneous' => array(
      'title'       => __( 'Miscellaneous', '__x__' ),
      'description' => __( 'Additional sitewide functionality.', '__x__' ),
      'sections' => array(
        'scroll-top-anchor' => array(
          'title'       => __( 'Scroll Top Anchor', '__x__' ),
          'description' => __( 'Activating the scroll top anchor will output a link that appears in the bottom corner of your site for users to click on that will return them to the top of your website. Once activated, set the value (as a percentage) for how far down the page your users will need to scroll for it to appear. For example, if you want the scroll top anchor to appear once your users have scrolled halfway down your page, you would enter "50" into the field.', '__x__' ),
          'controls' => array(
            'x_footer_scroll_top_display' => array(
              'type' => 'toggle',
              'title' => __( 'Scroll Top Anchor', '__x__' )
            ),
            'x_footer_scroll_top_position' => array(
              'type' => 'select',
              'title' => __( 'Scroll Top Anchor Position', '__x__' ),
              'condition' => array( 'x_footer_scroll_top_display' => true ),
              'options' => array(
                'choices' => $list_left_right_positioning
              )
            ),
            'x_footer_scroll_top_display_unit' => array(
              'type' => 'text',
              'title' => __( 'When to Display the Scroll Top Anchor (%)', '__x__' ),
              'condition' => array( 'x_footer_scroll_top_display' => true )
            ),
          ),
        )
      ),
    ),

    'x-bbpress' => array(
      'title'       => __( 'bbPress', '__x__' ),
      'description' => __( 'This section handles all options regarding your bbPress setup. Select your content layout, section titles, along with plenty of other options to get bbPress up and running. The "Layout" option allows you to keep your sidebar if you have already selected "Content Left, Sidebar Right" or "Sidebar Left, Content Right" for your "Content Layout" option, or remove the sidebar completely if desired.', '__x__' ),
      'enabled'  => X_BBPRESS_IS_ACTIVE,
      'controls' => array(
        'x_bbpress_layout_content' => array(
          'type' => 'select',
          'title' => __( 'Layout', '__x__' ),
          'options' => array(
            'choices' => $list_section_layouts
          )
        ),
        'x_bbpress_enable_quicktags' => array(
          'type' => 'toggle',
          'title' => __( 'Topic/Reply Quicktags', '__x__' )
        ),

      ),
      'sections' => array(
        'header-links' => array(
          'title'       => __( 'Navbar Menu', '__x__' ),
          'description' => __( 'You can add links to various "components" manually in your navigation if desired. Selecting this setting provides you with an additional theme-specific option that will include a simple navigation item with quick links to various bbPress components.', '__x__' ),
          'controls' => array(
            'x_bbpress_header_menu_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Navbar Menu', '__x__' )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true )
        )
      )
    ),

    'x-buddypress' => array(
      'title'       => __( 'BuddyPress', '__x__' ),
      'description' => __( 'This section handles all options regarding your BuddyPress setup. Select your content layout, section titles, along with plenty of other options to get BuddyPress up and running. The "Layout" option allows you to keep your sidebar if you have already selected "Content Left, Sidebar Right" or "Sidebar Left, Content Right" for your "Content Layout" option, or remove the sidebar completely if desired.', '__x__' ),
      'enabled'  => X_BUDDYPRESS_IS_ACTIVE,
      'controls' => array(
        'x_buddypress_layout_content' => array(
          'type' => 'select',
          'title' => __( 'Layout', '__x__' ),
          'options' => array(
            'choices' => $list_section_layouts
          )
        ),
      ),
      'sections' => array(
        'header-links' => array(
          'title'       => __( 'Navbar Menu', '__x__' ),
          'description' => __( 'You can add links to various "components" manually in your navigation or activate registration and login links in the WordPress admin bar via BuddyPress\' settings if desired. Selecting this setting provides you with an additional theme-specific option that will include a simple navigation item with quick links to various BuddyPress components.', '__x__' ),
          'controls' => array(
            'x_buddypress_header_menu_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Navbar Menu', '__x__' )
            ),
          ),
          'condition' => array( 'virtual:classic_headers' => true )
        ),
        'component-titles' => array(
          'title'       => __( 'Component Titles', '__x__' ),
          'description' => __( 'Set the titles for the various "components" in BuddyPress (e.g. groups list, registration, et cetera). Keep in mind that the "Sites Title" isn\'t utilized unless you have WordPress Multisite setup on your installation. Additionally, while they might not be present as actual titles on some pages, they are still used as labels in other areas such as the breadcrumbs, so keep this in mind when selecting inputs here.', '__x__' ),
          'controls' => array(
            'x_buddypress_activity_title' => array(
              'type' => 'text',
              'title' => __( 'Activity Title', '__x__' )
            ),
            'x_buddypress_groups_title' => array(
              'type' => 'text',
              'title' => __( 'Groups Title', '__x__' )
            ),
            'x_buddypress_blogs_title' => array(
              'type' => 'text',
              'title' => __( 'Sites Title', '__x__' )
            ),
            'x_buddypress_members_title' => array(
              'type' => 'text',
              'title' => __( 'Members Title', '__x__' )
            ),
            'x_buddypress_register_title' => array(
              'type' => 'text',
              'title' => __( 'Register Title', '__x__' )
            ),
            'x_buddypress_activate_title' => array(
              'type' => 'text',
              'title' => __( 'Activate Title', '__x__' )
            ),
          ),
        ),
        'component-subtitles' => array(
          'title'       => __( 'Component Subtitles', '__x__' ),
          'description' => __( 'Set the subtitles for the various "components" in BuddyPress (e.g. groups list, registration, et cetera). Keep in mind that the "Sites Subtitle" isn\'t utilized unless you have WordPress Multisite setup on your installation. Additionally, subtitles are not utilized across every Stack but are left here for ease of management.', '__x__' ),
          'controls' => array(
            'x_buddypress_activity_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Activity Subtitle', '__x__' )
            ),
            'x_buddypress_groups_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Groups Subtitle', '__x__' )
            ),
            'x_buddypress_blogs_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Sites Subtitle', '__x__' )
            ),
            'x_buddypress_members_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Members Subtitle', '__x__' )
            ),
            'x_buddypress_register_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Register Subtitle', '__x__' )
            ),
            'x_buddypress_activate_subtitle' => array(
              'type' => 'text',
              'title' => __( 'Activate Subtitle', '__x__' )
            ),
          ),
        )
      )
    ),

    'x-woocommerce' => array(
      'title'       => __( 'WooCommerce', '__x__' ),
      'description' => __( 'Enable a cart in your navigation that you can customize to showcase the information you want your users to see as they add merchandise to their cart (e.g. item count, subtotal, et cetera).', '__x__' ),
      'enabled'  => X_WOOCOMMERCE_IS_ACTIVE,
      'controls' => array(
        'x_woocommerce_header_menu_enable' => array(
          'type' => 'toggle',
          'title' => __( 'Navbar Menu', '__x__' ),
          'condition' => array( 'virtual:classic_headers' => true ),
        ),
        'x_woocommerce_header_cart_info' => array(
          'type' => 'select',
          'title' => __( 'Cart Information', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
          'options' => array(
            'choices' => array(
              'inner'       => __( 'Single (Inner)', '__x__' ),
              'outer'       => __( 'Single (Outer)', '__x__' ),
              'inner-outer' => __( 'Double (Inner / Outer)', '__x__' ),
              'outer-inner' => __( 'Double (Outer / Inner)', '__x__' )
            )
          )
        ),
        'x_woocommerce_header_cart_style' => array(
          'type' => 'select',
          'title' => __( 'Cart Style', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
          'options' => array(
            'choices' => array(
              'square'  => __( 'Square', '__x__' ),
              'rounded' => __( 'Rounded', '__x__' )
            )
          )
        ),
        'x_woocommerce_header_cart_layout' => array(
          'type' => 'select',
          'title' => __( 'Cart Layout', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
          'options' => array(
            'choices' => array(
              'inline'  => __( 'Inline', '__x__' ),
              'stacked' => __( 'Stacked', '__x__' )
            )
          )
        ),
        'x_woocommerce_header_cart_adjust' => array(
          'type' => 'text',
          'title' => __( 'Cart Alignment (px)', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
        ),
        'x_woocommerce_header_cart_content_inner' => array(
          'type' => 'select',
          'title' => __( 'Cart Content &ndash; Inner', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
          'options' => array(
            'choices' => $list_woocommerce_navbar_cart_content
          )
        ),
        'x_woocommerce_header_cart_content_outer' => array(
          'type' => 'select',
          'title' => __( 'Cart Content &ndash; Outer', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
          'options' => array(
            'choices' => $list_woocommerce_navbar_cart_content
          )
        ),
        'x_woocommerce_header_cart_content_inner_color' => array(
          'type' => 'color',
          'title' => __( 'Cart Content &ndash; Inner Color', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
        ),
        'x_woocommerce_header_cart_content_inner_color_hover' => array(
          'type' => 'color',
          'title' => __( 'Cart Content &ndash; Inner Color Hover', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
        ),
        'x_woocommerce_header_cart_content_outer_color' => array(
          'type' => 'color',
          'title' => __( 'Cart Content &ndash; Outer Color', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
        ),
        'x_woocommerce_header_cart_content_outer_color_hover' => array(
          'type' => 'color',
          'title' => __( 'Cart Content &ndash; Outer Color Hover', '__x__' ),
          'conditions' => array(
            array( 'virtual:classic_headers' => true ),
            array( 'x_woocommerce_header_menu_enable' => true )
          ),
        ),
      ),
      'sections' => array(
        'shop' => array(
          'title'       => __( 'Shop', '__x__' ),
          'description' => __( 'This section handles all options regarding your WooCommerce setup. Select your content layout, product columns, along with plenty of other options to get your shop up and running. The "Shop Layout" option allows you to keep your sidebar on your shop page if you have already selected "Content Left, Sidebar Right" or "Sidebar Left, Content Right" for you "Content Layout" option, or remove the sidebar completely if desired.', '__x__' ),
          'controls' => array(
            'x_woocommerce_shop_layout_content' => array(
              'type' => 'select',
              'title' => __( 'Shop Layout', '__x__' ),
              'options' => array(
                'choices' => $list_section_layouts
              )
            ),
            'x_woocommerce_shop_columns' => array(
              'type' => 'select',
              'title' => __( 'Shop Columns', '__x__' ),
              'options' => array(
                'choices' => $list_shop_columns
              )
            ),
            'x_woocommerce_shop_count' => array(
              'type' => 'text',
              'title' => __( 'Posts Per Page', '__x__' )
            ),
          ),
        ),
        'single-product' => array(
          'title'       => __( 'Single Product', '__x__' ),
          'description' => __( 'All options available in this section pertain to the layout of your individual product pages. Eenable or disable the sections you want to use to achieve the layout you want.', '__x__' ),
          'controls' => array(
            'x_woocommerce_product_tabs_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Product Tabs', '__x__' )
            ),
            'x_woocommerce_product_tab_description_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Description Tab', '__x__' ),
              'condition' => array( 'x_woocommerce_product_tabs_enable' => true )
            ),
            'x_woocommerce_product_tab_additional_info_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Additional Information Tab', '__x__' ),
              'condition' => array( 'x_woocommerce_product_tabs_enable' => true )
            ),
            'x_woocommerce_product_tab_reviews_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Reviews Tab', '__x__' ),
              'condition' => array( 'x_woocommerce_product_tabs_enable' => true )
            ),
            'x_woocommerce_product_related_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Related Products', '__x__' )
            ),
            'x_woocommerce_product_related_columns' => array(
              'type' => 'select',
              'title' => __( 'Related Product Columns', '__x__' ),
              'condition' => array( 'x_woocommerce_product_related_enable' => true ),
              'options' => array(
                'choices' => $list_shop_columns
              )
            ),
            'x_woocommerce_product_related_count' => array(
              'type' => 'text',
              'title' => __( 'Related Product Post Count', '__x__' ),
              'condition' => array( 'x_woocommerce_product_related_enable' => true )
            ),
            'x_woocommerce_product_upsells_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Upsells', '__x__' )
            ),
            'x_woocommerce_product_upsell_columns' => array(
              'type' => 'select',
              'title' => __( 'Upsell Columns', '__x__' ),
              'condition' => array( 'x_woocommerce_product_upsells_enable' => true ),
              'options' => array(
                'choices' => $list_shop_columns
              )
            ),
            'x_woocommerce_product_upsell_count' => array(
              'type' => 'text',
              'title' => __( 'Upsell Post Count', '__x__' ),
              'condition' => array( 'x_woocommerce_product_upsells_enable' => true )
            ),
          ),
        ),
        'cart' => array(
          'title'       => __( 'Cart', '__x__' ),
          'description' => __( 'All options available in this section pertain to the layout of your cart page. Enable or disable the sections you want to use to achieve the layout you want.', '__x__' ),
          'controls' => array(
            'x_woocommerce_cart_cross_sells_enable' => array(
              'type' => 'toggle',
              'title' => __( 'Cross Sells', '__x__' )
            ),
            'x_woocommerce_cart_cross_sells_columns' => array(
              'type' => 'select',
              'title' => __( 'Cross Sell Columns', '__x__' ),
              'condition' => array( 'x_woocommerce_cart_cross_sells_enable' => true ),
              'options' => array(
                'choices' => $list_shop_columns
              )
            ),
            'x_woocommerce_cart_cross_sells_count' => array(
              'type' => 'text',
              'title' => __( 'Cross Sell Post Count', '__x__' ),
              'condition' => array( 'x_woocommerce_cart_cross_sells_enable' => true )
            ),
          ),
        ),
        'ajax-add-to-cart' => array(
          'title'       => __( 'AJAX Add to Cart', '__x__' ),
          'description' => __( 'If you have the "Enable AJAX add to cart buttons on archives" WooCommerce setting active, you can control the colors of the confirmation overlay here that appears when adding an item on a product index page.', '__x__' ),
          'controls' => array(
            'x_woocommerce_ajax_add_to_cart_color' => array(
              'type' => 'color',
              'title' => __( 'Icon Color', '__x__' )
            ),
            'x_woocommerce_ajax_add_to_cart_bg_color' => array(
              'type' => 'color',
              'title' => __( 'Background Color', '__x__' )
            ),
            'x_woocommerce_ajax_add_to_cart_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Icon Color Hover', '__x__' )
            ),
            'x_woocommerce_ajax_add_to_cart_bg_color_hover' => array(
              'type' => 'color',
              'title' => __( 'Background Color Hover', '__x__' )
            ),
          ),
        ),
        'widgets' => array(
          'title'       => __( 'Widgets', '__x__' ),
          'description' => __( 'Select the placement of your product images in the various WooCommerce widgets that provide them. Right alignment is better if your items have longer titles to avoid staggered word wrapping.', '__x__' ),
          'controls' => array(
            'x_woocommerce_widgets_image_alignment' => array(
              'type' => 'select',
              'title' => __( 'Image Alignment', '__x__' ),
              'options' => array(
                'choices' => $list_left_right_positioning
              )
            ),
          ),
        )
      )
    )

  );

  $x_cornerstone_options_map = $sections;
  return $sections;

}
