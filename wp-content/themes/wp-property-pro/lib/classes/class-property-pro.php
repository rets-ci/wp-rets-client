<?php
/**
 * PropertyPro Core
 *
 * @version 0.1.0
 * @author Usability Dynamics
 * @namespace UsabilityDynamics
 */
namespace UsabilityDynamics {

  use UsabilityDynamics\PropertyPro\Customizer;
  Use UsabilityDynamics\Theme\Scaffold;
  use WPModel\Post;

  /**
   * PropertyPro Theme
   *
   * @author Usability Dynamics
   */
  class PropertyPro extends Scaffold
  {

    /**
     * Class Initializer
     *
     * @author Usability Dynamics
     * @since 0.1.0
     */

    /** @var string */
    private $_stylesDir;

    /** @var string */
    private $_scriptsDir;

    /** @var  Customizer */
    private $customizer;

    /** @var bool */
    private $isSearchPage = false;

    /** @var string */
    private $no_min_text = 'No Min';

    /** @var string */
    private $no_max_text = 'No Max';

    public function __construct()
    {

      /** Parsing current url */
      $url = parse_url($_SERVER['REQUEST_URI']);
      $path = explode('/', $url['path']);

      /** Define template for search page */
      $template = 'index';
      if(isset($path[1]) && $path[1] === 'search'){

        $this->isSearchPage = true;

        /** Override meta title with dynamic title */
        if( class_exists( 'WPSEO_Frontend' ) ) {
          add_filter( 'wpseo_title', function () {
            return $this->property_pro_build_search_title_and_description()[ 'title' ];
          }, 100 );
        } else {
          add_filter( 'wp_title', function ( $title ) {
            return $this->property_pro_build_search_title_and_description()[ 'title' ];
          }, 16 );
        }

        /** Override meta description with dynamic description */
        add_filter( 'wpseo_metadesc', function ( $description ) {
          return $this->property_pro_build_search_title_and_description()[ 'description' ];
        }, 100, 1 );

        $template = 'search';
      }

      if (!isset($_GET['pageType'])) {
        add_action('template_include', function () use($template) {
          return get_stylesheet_directory() . '/' . $template . '.php';
        }, 100);
      }

      $this->_stylesDir = get_template_directory_uri() . '/static/styles';
      $this->_scriptsDir = get_template_directory_uri() . '/static/scripts';

      /** Enables Customizer for Options. */
      $this->property_pro_customizer();

      /** Scripts action section */
      if (!isset($_GET['pageType'])) {
        add_action('wp_enqueue_scripts', [$this, 'property_pro_enqueue_scripts']);
      }
      add_action('admin_enqueue_scripts', [$this, 'property_pro_enqueue_admin_scripts']);

      /** Buffering output */
      add_action('init', [$this, 'property_pro_start_buffer_output_content']);
      add_action('shutdown', [$this, 'property_pro_end_buffer_output_content'], 100);

      /** Disable admin bar */
      add_action('after_setup_theme', [$this, 'property_pro_remove_admin_bar']);

      /** Add svg to mimes types */
      if (!defined('ALLOW_UNFILTERED_UPLOADS'))
        define('ALLOW_UNFILTERED_UPLOADS', true);

      add_action('upload_mimes', [$this, 'property_pro_add_svg_to_upload_mimes'], 10, 1);

      /** Register guide post type */
      add_action('init', [$this, 'property_pro_register_guide_post_type']);

      /** Register taxonomy for guide post type */
      add_action('init', [$this, 'property_pro_register_guide_post_type_taxonomy']);

      /** Delete cache with siteorigin posts query widget result on save post */
      add_action('save_post', [$this, 'property_pro_delete_widget_posts_cache'], 10, 3);

      /** Build seo meta data on wp_head */
      add_action('wp_head', [$this, 'property_pro_build_seo_meta_tags'], 2);

      /** Disable standart seo meta data output  */
      add_filter( 'wpseo_opengraph_title', '__return_false', 10, 1 );
      add_filter( 'wpseo_opengraph_desc', '__return_false', 10, 1 );
      add_filter( 'wpseo_opengraph_url', '__return_false', 10, 1 );
      add_filter( 'wpseo_opengraph_site_name', '__return_false', 10, 1 );
      add_filter( 'wpseo_opengraph_admin', '__return_false', 10, 1 );
      add_filter( 'wpseo_opengraph_type', '__return_false', 10, 1 );
      add_filter( 'wpseo_output_twitter_card', '__return_false', 10, 1 );

      /** Do not output site origin styles to front-end */
      remove_action('wp_footer', 'siteorigin_widget_print_styles');

      /** Add ajax actions */

      /** Get posts list */
      add_action('wp_ajax_get_posts', [$this, 'property_pro_get_blog_posts_handler']);
      add_action('wp_ajax_nopriv_get_posts', [$this, 'property_pro_get_blog_posts_handler']);
    }

    /**
     * Adds settings to customizer
     */
    public function property_pro_customizer()
    {
      if (class_exists('\UsabilityDynamics\PropertyPro\Customizer')) {
        $this->customizer = new Customizer();
      }
    }

    function property_pro_enqueue_scripts()
    {
      global $post;

      wp_enqueue_script('property-pro-jquery', '', [], null, true);
      wp_enqueue_script('property-pro-tether', $this->_scriptsDir . '/src/tether.min.js', [], null, true);
      wp_enqueue_script('property-pro-bootstrap-js', $this->_scriptsDir . '/src/bootstrap.min.js', [ 'jquery' ], null, true );
      wp_enqueue_style('property-pro-bootstrap-css', $this->_stylesDir . '/src/bootstrap.min.css');
      wp_enqueue_style('property-pro-main-css', $this->_stylesDir . '/dist.css');

      wp_enqueue_script('bundle', $this->_scriptsDir . '/src/dist/bundle.js', [], null, true);
      if (defined('PROPERTYPRO_GOOGLE_API_KEY') && PROPERTYPRO_GOOGLE_API_KEY && !is_single()) { 
        wp_enqueue_script('googlemaps', 'https://maps.googleapis.com/maps/api/js?v=3&key=' . PROPERTYPRO_GOOGLE_API_KEY, [], null, true);
      }

      // Exclude SO font flex
      wp_deregister_style( 'siteorigin-panels-front' );

      $params = $this->property_pro_get_base_info();
      /**
       * @TODO Add elasticsearch host to wp property settings and get value from it,
       * now host value in theme composer.json
       */
      $params['elasticsearch_host'] = defined('ELASTICSEARCH_HOST') && ELASTICSEARCH_HOST ? ELASTICSEARCH_HOST : $_SERVER['HTTP_HOST'];
      wp_localize_script('jquery', 'bundle', $params);
    }

    function property_pro_enqueue_admin_scripts()
    {

      wp_enqueue_style('admin_style', $this->_stylesDir . '/admin/admin.css');

      wp_register_script('admin_script', $this->_scriptsDir . '/admin/admin.js');
      wp_enqueue_script('admin_script', $this->_scriptsDir . '/admin/admin.js', [], null, true);
    }

    private function property_pro_get_base_info()
    {

      $blog_post_id = get_option('page_for_posts');

      /** Just get one fresh property */
      $property = get_posts([
        'posts_per_page' => 1,
        'post_type' => 'property',
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
      ]);

      $property_single_url = '';
      if($property){
        /** Rebuild post permalink to single property routing */
        $property_single_url_array = array_filter(explode('/', str_replace(site_url(), '', get_permalink(array_shift($property)))));
        array_pop($property_single_url_array);

        if($property_single_url_array)
          $property_single_url = array_pop($property_single_url_array);
      }

      $sidebar_menu = wp_get_nav_menu_object( 'Sitewide Panel Navigation' );
      $sidebar_menu_term_id = $sidebar_menu ? $sidebar_menu->term_id : 0;

      $params = [
        'site_url' => site_url(),
        'admin_ajax_url' => admin_url('admin-ajax.php'),
        'template_url' => get_template_directory_uri(),
        'site_name' => esc_attr(get_bloginfo('name')),
        'page_title' => wp_title('&raquo;', false),
        'static_images_url' => get_template_directory_uri() . '/static/images/src/',
        'blog_base' => $blog_post_id ? str_replace(home_url(), "", get_permalink($blog_post_id)) : null,
        'category_base' => get_option('category_base') ? get_option('category_base') : 'category',
        'guide_category_base' => 'guides',
        'theme_prefix' => defined('THEME_PREFIX') ? THEME_PREFIX : '',
        'property_single_url' => $property_single_url,
        'sidebar_menu_items' => $sidebar_menu_term_id ? array_map( function ( $item ) {
          return [ 'ID' => $item->ID, 'title' => $item->title, 'url' => $item->url, 'relative_url' => str_replace( home_url(), "", $item->url ), 'classes' => $item->classes ];
        }, wp_get_nav_menu_items( $sidebar_menu_term_id ) ) : []
      ];

      /** Custom elastic press index */
      if(defined('EP_INDEX_NAME') && EP_INDEX_NAME){
        $params['ep_index_name'] = EP_INDEX_NAME;
      }

      if (defined('PROPERTYPRO_GOOGLE_API_KEY') && PROPERTYPRO_GOOGLE_API_KEY) {
        $params['google_api_key'] = PROPERTYPRO_GOOGLE_API_KEY;
      }

      /** Get company logos */
      $params['logos'] = [
          'square_logo' => get_theme_mod('property_pro_company_square_logo'),
          'horizontal_logo' => get_theme_mod('property_pro_company_horizontal_logo'),
          'vertical_logo' => get_theme_mod('property_pro_company_vertical_logo')
      ];

      /** Get footer menus */
      $footer_structure = [
          'top_footer' => [
              get_theme_mod('property_pro_footer_top_menu_one'),
              get_theme_mod('property_pro_footer_top_menu_two'),
              get_theme_mod('property_pro_footer_top_menu_three'),
              get_theme_mod('property_pro_footer_top_menu_four')
          ],
          'bottom_footer' => [
              'menu' => get_theme_mod('property_pro_footer_bottom_menu'),
              'social_menu' => get_theme_mod('property_pro_footer_bottom_menu_social')
          ]
      ];

      foreach ($footer_structure as $level_title => $level) {
        foreach ($level as $key => $menu_id) {
          $params['footer'][$level_title][$key]['title'] = wp_get_nav_menu_object($menu_id)->name;
          $params['footer'][$level_title][$key]['items'] = array_map(function ($item) {
            return [
                'ID' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'relative_url' => str_replace(home_url(), "", $item->url),
                'classes' => $item->classes
            ];
          }, wp_get_nav_menu_items($menu_id));
        }
      }

      /** Build search options array for search type dropDown at search result page */

      /** Array for filters modal */
      $property_search_options = [];

      $sale_types_array = ['Rent', 'Sale'];

      /** Build search options and filters modal array */
      foreach ([
                   'Rent',
                   'Sale',
                   'Land',
                   'Commercial'
               ] as $label) {

        $sale_type = [$label];
        if (in_array($label, $sale_types_array)){
          $type = 'residential';
        }
        else {
          $sale_type = $sale_types_array;
          $type = strtolower($label);
        }

        /** Mapping for search type option label */
        $search = $label === 'Sale' ? 'Buy' : $label;

        /** Build option array */
        $option = [
            'search' => $search,
            'property_type' => $type
        ];

        /** Include sale type just if it is not empty */
        if($sale_type){
          $option['listing_statuses'] = $sale_type;
        }

        $property_search_options[] = $option;
      }
      $params['property_search_options'] = $property_search_options;

      /** Plural values for listing types titles */
      $listing_subtypes_plural_values_filename = get_template_directory() . '/static/schemas/listing_subtypes_plural_values.json';
      if(file_exists($listing_subtypes_plural_values_filename)){
        $listing_subtypes_plural_values = file_get_contents($listing_subtypes_plural_values_filename);
        $params['listing_subtypes_plural_values'] = json_decode($listing_subtypes_plural_values, true);
      }

      $params['agents'] = array_map(function($user){
        $meta = get_user_meta($user->ID);

        $new_user = new \stdClass();

        $new_user->data = new \stdClass();
        $new_user->data->display_name = $user->display_name;

        if($meta){
          $new_user->data->meta = new \stdClass();
          $new_user->data->meta->phone_number = isset($meta['phone_number']) ? $meta['phone_number'] : '';
          $new_user->data->meta->sale_type = isset($meta['sale_type']) ? $meta['sale_type'] : '';
          $new_user->data->meta->triangle_mls_id = isset($meta['triangle_mls_id']) ? $meta['triangle_mls_id'] : '';
        }

        $new_user->data->images = array_map(function($image){
          return wp_get_attachment_image_src(unserialize($image)[0]);
        }, (isset($meta['agent_images']) ? $meta['agent_images'] : []));

        return $new_user;
      }, get_users(['role' => 'agent']));

      /** Front page post content for 404's page displaying search bar */
      if(is_404()){
      $front_page_id = get_option('page_on_front');
        if ($post_data = get_post_meta($front_page_id, 'panels_data', true)) {
          $params['front_page_post_content'] = self::property_pro_rebuild_builder_content($post_data, $front_page_id);
        }
      }

      return $params;

    }

    private function property_pro_get_page_content()
    {
      global $post;

      /** Get blog post id */
      $blog_post_id = get_option('page_for_posts');

      /** Init guide category and post type variables */
      $guide_category = 'propertypro-guide-category';
      $guide_post_type = 'propertypro-guide';

      /** Init params variable */
      $params = $this->property_pro_get_base_info();

      /** Build post data array */
      $params['post'] = isset($post) ? [
        'post_id' => $post->ID,
        'post_date' => $post->post_date,
        'post_modified' => $post->post_modified,
        'post_parent' => $post->post_parent,
        'post_title' => $post->post_title,
        'post_content' => $post->post_content,
        'post_type' => $post->post_type,
        'post_url' => get_permalink($post->ID),
        'custom_content' => false
      ] : [
          /** It is done for prevent error massage on front-end on pages like /search which support dynamic pages */
          'post_content' => null
      ];

      /** Is single page */
      if (is_single()) {

        /** Is guide single page ? */
        if ($post->post_type === $guide_post_type) {
          $params['post']['is_guide_single'] = true;
          $params['post']['guide_single_content']['content'] = apply_filters('the_content', $post->post_content);

          /** Get top parent category relative for current guide */
          $terms = get_the_terms($post->ID, $guide_category);
          $term_id = $terms ? $terms[0]->term_id : 0;
          $term_parent = 0;
          while ($term_id) {
            $term = get_term($term_id);
            $term_id = $term->parent;
            $term_parent = $term->term_id;
          }
          $params['post']['guide_single_content']['parent_category_relative_link'] = str_replace(home_url(), "", get_term_link($term_parent, $guide_category));

          /** Get next guide relative link */

          /** Get all posts ids in guide terms */
          $termIds = get_term_children($term_parent, $guide_category);
          $ids = [];
          foreach ($termIds as $termId) {
            $ids = array_merge($ids, get_posts([
              'post_type' => $guide_post_type,
              'posts_per_page' => -1,
              'fields' => 'ids',
              'tax_query' => [
                [
                  'taxonomy' => $guide_category,
                  'field' => 'id',
                  'terms' => $termId
                ]
              ]
            ]));
          }

          $next_post = null;
          if ($ids) {
            /** Get current post index */
            $current_post_index = array_search($post->ID, $ids);

            /** Get next post index */
            $next_index = is_numeric($current_post_index) ? $current_post_index + 1 : 0;

            /** Get next post data */
            $next_post = get_post(isset($ids[$next_index]) ? $ids[$next_index] : $ids[0]);
          }

          $params['post']['guide_single_content']['next_article_relative_link'] = $next_post ? str_replace(home_url(), "", get_permalink($next_post->ID)) : '';

          /** Masthead widget payload */
          $params['post']['guide_single_content']['masthead'] = [
            'widget' => [
              'fields' => [
                'layout' => 'guide_single_layout',
                'title' => $post->post_title,
                'subtitle' => $post->post_excerpt,
                'image_src' => isset($post->ID) ? get_the_post_thumbnail_url($post->ID) : ''
              ]
            ]
          ];
        } /** Is blog single page */
        elseif ($post->post_type === 'post') {
          $params['post']['is_blog_single'] = true;
          $params['post']['content'] = apply_filters('the_content', $post->post_content);
          if ($categories = get_the_category($post->ID)) {
            $categories = array_map(function($cat){
              return $cat->parent;
            }, $categories);
            $params['post']['category_title'] = $categories['0']->cat_name;
            $args = [
              'category' => $categories[0]->cat_ID,
              'post_type' => 'post',
              'posts_per_page' => '2',
              'exclude' => [
                $post->ID
              ]
            ];
            list($params['post']['related_posts']) = $this->property_pro_get_blog_posts($args);
          }
          $params['post']['widgets'] = [
            'masthead' => [
              'widget' => [
                'fields' => [
                  'layout' => 'blog_single_layout',
                  'title' => $post->post_title,
                  'image_src' => get_the_post_thumbnail_url($post->ID),
                  'image_position' => 'center center',
                  'post_title' => $post->post_title,
                  'post_url' => get_permalink($post->ID),
                ]
              ]
            ]
          ];
        } elseif ($post->post_type === 'property') {

          /** Get listing statuses */
          $statuses = array_map(function($t){
            /** Cut off prefix 'For ' from name */
            return explode(' ', $t->name)[1];
          }, wp_get_post_terms($post->ID, 'wpp_sale_status', ['hide_empty' => false]));

          if(count($statuses) === 1){
            $params['post']['wpp_listing_statuses'] = array_values($statuses);
          }

          /** Get listing type */
          $params['post']['wpp_listing_type'] = reset(wp_get_post_terms($post->ID, 'wpp_listing_type', ['hide_empty' => false]))->slug;

          /** Get property location */
          $location_city = get_the_terms($post->ID, 'location_city');
          $location_city = !empty($location_city) && !is_wp_error($location_city) ? reset($location_city) : null;
          if($location_city){
            $params['post']['wpp_location'] = [
                'term_type' => $location_city->taxonomy,
                'slug' => $location_city->slug,
                'term' => $location_city->name
            ];
          }

          /** Get property type */
          $property_type = '';
          $type_terms = array_filter(wp_get_post_terms($post->ID, 'wpp_listing_type', ['hide_empty' => false]), function ($term) {
            return $term->parent;
          });

          if(count($type_terms) === 1){
            $type_term = reset($type_terms);
            $property_type = $type_term->slug;
          }

          foreach($params['property_search_options'] as $label => $option){
            /** Define search type based on sale_type and property_type */
            $types = array_map(function($t){
              return $t['slug'];
            }, $option['property_types']);
            if($option['sale_type'] === $params['post']['sale_type'] && in_array($property_type, $types)){
              $params['post']['search_type'] = $label;
            }
          }
        }
      } /** Is blog page ? */
      elseif (get_query_var('cat') || ($blog_post_id && !is_front_page() && is_home())) {
        $category_id = (int)get_query_var('cat');

        /** Get blog post some data */
        $post_title = get_post_field('post_title', $blog_post_id);
        $post_content = get_post_field('post_content', $blog_post_id);
        $category_link = get_category_link($category_id);
        $params['post']['post_url'] = $category_link ? $category_link : get_permalink($blog_post_id);

        if ($category_id) {
          $category = get_category($category_id);
        }

        /** Payload for blog/archive page */
        $params['post']['blog_content'] = [
          'masthead' => [
            'widget' => [
              'fields' => [
                'layout' => $category_id ? 'subtitle_title_layout' : 'title_description_layout',
                'title' => $category_id ? $category->name : $post_title,
                'subtitle' => $category_id ? $post_title : $post_content,
                'image_src' => $blog_post_id ? get_the_post_thumbnail_url($blog_post_id) : '',
                'image_position' => 'center center'
              ]
            ]
          ],
          'subnavigation' => [
            'widget' => [
              'fields' => [
                'layout' => 'text_layout',
                'menu_items' => array_map(function ($item) {
                  return [
                    'ID' => $item->ID,
                    'title' => $item->title,
                    'url' => $item->url,
                    'relative_url' => str_replace(home_url(), "", $item->url),
                    'classes' => $item->classes
                  ];
                }, wp_get_nav_menu_items(get_theme_mod('property_pro_blog_subnavigation_menu')))
              ]
            ]
          ],
          'category_id' => $category_id,
        ];
      } /** Is guide ? */
      elseif (is_tax($guide_category)) {

        /** Get current term */
        $term = get_queried_object();

        $params['post']['post_url'] = get_term_link($term->term_id);

        /** @var Post $rand_posts
         *  Rand post related with current term of child for get thumbnail
         *
         */
        $rand_posts = get_posts([
          'post_type' => $guide_post_type,
          'posts_per_page' => 1,
          'orderby' => 'rand',
          'tax_query' => [
            [
              'taxonomy' => $guide_category,
              'field' => 'id',
              'terms' => array_merge([$term->term_id], get_term_children($term->term_id, $guide_category)),
              'include_children' => true
            ]
          ]
        ]);

        /** Masthead widget payload */
        $params['post']['guide_content']['masthead'] = [
          'widget' => [
            'fields' => [
              'layout' => 'guide_layout',
              'title' => $term->name,
              'subtitle' => $term->description,
              'image_src' => $rand_posts ? get_the_post_thumbnail_url($rand_posts[0]->ID) : ''
            ]
          ]
        ];

        /** Get child articles */
        $content = array_map(function ($guide) {
          return [
            'title' => $guide->post_title,
            'excerpt' => $guide->post_excerpt,
            'image_src' => get_the_post_thumbnail_url($guide->ID),
            'url' => get_permalink($guide->ID),
            'relative_url' => str_replace(home_url(), "", get_permalink($guide->ID))
          ];
        }, get_posts([
          'post_type' => $guide_post_type,
          'orderby' => 'menu_order',
          'order' => 'ASC',
          'tax_query' => [
            [
              'taxonomy' => $guide_category,
              'field' => 'id',
              'terms' => $term->term_id,
              'include_children' => false
            ]
          ]
        ]));

        /** Merge articles with child terms */
        $child_terms = array_map(function ($child) {

          $child_term = get_term($child);

          $child_posts = array_map(function ($guide) {
            return [
              'ID' => $guide->ID,
              'menu_order' => $guide->menu_order,
              'title' => $guide->post_title,
              'excerpt' => $guide->post_excerpt,
              'url' => get_permalink($guide->ID),
              'relative_url' => str_replace(home_url(), "", get_permalink($guide->ID))
            ];
          }, get_posts([
            'post_type' => 'propertypro-guide',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
            'tax_query' => [
              [
                'taxonomy' => 'propertypro-guide-category',
                'field' => 'id',
                'terms' => $child,
                'include_children' => false
              ]
            ]
          ]));

          $term_order = 0;
          foreach ($child_posts as $p) {
            $term_order += $p['menu_order'];
          }

          $rand_child_post_index = rand(0, count($child_posts) - 1);

          return [
            'title' => $child_term->name,
            'menu_order' => $term_order,
            'url' => get_term_link($child, 'propertypro-guide-category'),
            'relative_url' => str_replace(home_url(), "", get_term_link($child, 'propertypro-guide-category')),
            'image_src' => get_the_post_thumbnail_url($child_posts[$rand_child_post_index]['ID']),
            'children' => $child_posts
          ];
        }, get_term_children($term->term_id, $guide_category));

        /** Ordering child terms */
        usort($child_terms, function ($a, $b) {
          if ($a['menu_order'] == $b['menu_order']) {
            return 0;
          }
          return ($a['menu_order'] < $b['menu_order']) ? -1 : 1;
        });

        $params['post']['guide_content']['items'] = array_merge($content, $child_terms);
      }

      /** Builder content case */
      if (isset($post) && $post_data = get_post_meta($post->ID, 'panels_data', true)) {
        $params['post']['custom_content'] = true;
        $params['post']['post_content'] = self::property_pro_rebuild_builder_content($post_data, $post->ID);
      }


      return $params;
    }

    /**
     * Get posts for blog/archive page
     *
     * @param $args
     * @param bool $just_count
     * @return array
     */
    function property_pro_get_blog_posts($args, $just_count = false)
    {

      /** Increase paged by 1 for check next page and save previous value */
      $paged = $args['paged'];
      $args['paged'] += 1;

      $found_posts = count(get_posts($args));

      if ($just_count) {
        return [$found_posts];
      }

      $args['paged'] = $paged;

      $posts = array_map(function ($post) {

        $attachment_id = get_post_thumbnail_id($post->ID);

        return [
          'ID' => $post->ID,
          'title' => $post->post_title,
          'excerpt' => $post->post_excerpt,
          'image_src' => get_the_post_thumbnail_url($post->ID),
          'image_title' => $attachment_id ? get_the_title($attachment_id) : '',
          'image_alt' => $attachment_id ? get_post_meta($attachment_id, '_wp_attachment_image_alt', true) : '',
          'url' => get_permalink($post->ID),
          'relative_url' => str_replace(home_url(), "", get_permalink($post->ID))
        ];
      }, get_posts($args));

      return [$posts, $found_posts];
    }

    /**
     * Handler for ajax query which request blog posts
     *
     */
    function property_pro_get_blog_posts_handler()
    {

      $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : 0;
      $posts_per_page = 6;

      $args = [
        'post_type' => 'post',
        'posts_per_page' => $posts_per_page,
      ];

      $args['paged'] = isset($_GET['from']) && !empty($_GET['from']) ? round($_GET['from'] / $posts_per_page) + 1 : 1;

      if ($category_id) {
        $args['category'] = $category_id;
      }

      list($posts, $found_posts) = $this->property_pro_get_blog_posts($args);

      echo wp_json_encode([
        'posts' => $posts,
        'allowPagination' => $found_posts > 0
      ]);

      wp_die();
    }


    /**
     * Rebuild builder data array
     * @param $content
     * @param $post_id
     * @return array
     */
    private static function property_pro_rebuild_builder_content($content, $post_id)
    {
      $rows = [];

      $posts_array_for_caching = [];
      $posts_cache = wp_cache_get('widget_posts_' . $post_id, 'property_pro');

      if(isset($content['widgets']) && is_array($content['widgets'])){
        foreach ($content['widgets'] as $key => $widget) {
          $rows[$widget['panels_info']['grid']]['style'] = $content['grids'][$widget['panels_info']['grid']]['style'];

          /** Get image src */
          if (isset($widget['image']))
            $widget['image_src'] = $widget['image'] ? wp_get_attachment_image_src($widget['image'], 'full')[0] : '';

          /** Get menu items */
          if (isset($widget['menu_select']))
            $widget['menu_items'] = array_map(function ($item) {
              $item->title = htmlspecialchars_decode($item->title);
              $item->relative_url = str_replace(home_url(), "", $item->url);
              return $item;
            }, ($widget['menu_select'] ? wp_get_nav_menu_items($widget['menu_select']) : []));


          /** Remove namespace from class name */
          if (isset($widget['panels_info']['class'])) {
            $classes = explode('\\', $widget['panels_info']['class']);
            $widget['panels_info']['class'] = count($classes) ? end($classes) : '';
          }

          $fields = [];
          foreach ($widget as $k => $field) {

            if (is_array($field)) {

              /** Exclude siteorigin system field */
              if (isset($field['so_field_container_state']))
                unset($field['so_field_container_state']);

              foreach ($field as $item_key => $item)
                if (is_array($item) && array_key_exists('image', $item))
                  $field[$item_key]['image_src'] = $item['image'] ? wp_get_attachment_image_src($item['image'], 'full')[0] : '';
            }

            /** Siteorigin system fields no need in fields array */
            if (in_array($k, ['_sow_form_id', 'panels_info']))
              continue;

            /** @TODO hack for array keys, because get_post_meta return keys without underscores */
            if ($k === 'search_options' && is_array($field)) {
              $new_field = [];
              foreach ($field as $field_key => $value) {

                /** Skip empty values */
                if (!$value) {
                  continue;
                }

                /** Determine sale type from field key */
                $options_array = explode('-', $field_key);
                $label = $options_array[0];
                $sale_types_array = explode(',', $options_array[1]);

                /** Remove un-needed vars */
                unset($options_array[0]);
                unset($options_array[1]);

                /** Determine property type */
                $property_type = reset(array_values($options_array));

                /** Mapping for search type option label */
                $search = $label = $label === 'Sale' ? 'Buy' : $label;

                /** Build option array */
                $option = [
                    'search' => $search,
                    'property_type' => str_replace('.', '-', $property_type)
                ];

                /** Include sale type just if it is not empty */
                if($sale_types_array){
                  $option['listing_statuses'] = $sale_types_array;
                }

                $new_field[$label] = $option;
              }

              $field = $new_field;
            }

            if (in_array($k, ['title', 'subtitle'])) {
              $field = htmlspecialchars_decode($field);
            }

            if ($k === 'posts') {
              $formatted_posts = $posts_cache ? $posts_cache[$widget['panels_info']['id']] : [];

              if (!$formatted_posts) {

                $args = wp_parse_args(siteorigin_widget_post_selector_process_query($field));
                $args['fields'] = 'ids';
                $posts = get_posts($args);

                /** Update posts array */
                foreach ($posts as $postId) {
                  $formatted_post = new \stdClass();
                  $formatted_post->thumbnail = get_the_post_thumbnail_url($postId);
                  $formatted_post->post_name = get_post_field('post_name', $postId);
                  $formatted_post->relative_permalink = str_replace(home_url(), "", get_permalink($postId));
                  $property_detail = get_property($postId);

                  /** Build item object */
                  $formatted_post->property_type = isset($property_detail['property_type']) ? $property_detail['property_type'] : '';
                  $formatted_post->sqft = isset($property_detail['wpp_price_per_sqft']) ? $property_detail['wpp_price_per_sqft'] : 0;
                  $formatted_post->price = isset($property_detail['wpp_list_price']) ? $property_detail['wpp_list_price'] : '';
                  $formatted_post->address = isset($property_detail['wpp_address']) ? $property_detail['wpp_address'] : '';
                  $formatted_post->address_unit = isset($property_detail['address_unit']) ? $property_detail['address_unit'] : '';
                  $formatted_post->living_area = isset($property_detail['wpp_total_living_are']) ? $property_detail['wpp_total_living_are'] : '';
                  $formatted_post->zip = isset($property_detail['wpp_location_zip']) ? $property_detail['wpp_location_zip'] : '';
                  $formatted_post->beds = isset($property_detail['wpp_bedrooms_count']) ? $property_detail['wpp_bedrooms_count'] : '';
                  $formatted_post->baths = isset($property_detail['wpp_full_bathrooms_count']) ? $property_detail['wpp_full_bathrooms_count'] : '';
                  $formatted_post->lots_size = isset($property_detail['wpp_lot_size']) ? $property_detail['wpp_lot_size'] : '';

                  $formatted_post->type = reset(get_the_terms($postId, 'wpp_listing_type'))->slug;
                  $subtypes = get_the_terms($postId, 'wpp_listing_subtype');
                  $formatted_post->sub_types = array_map(function($subtype){
                    return $subtype->name;
                  }, $subtypes);

                  /** Get city  */
                  $location_city = get_the_terms($postId, 'location_city');
                  $formatted_post->city = !empty($location_city) && !is_wp_error($location_city) ? reset($location_city)->name : '';

                  /** Get state  */
                  $location_state = get_the_terms($postId, 'location_state');
                  $formatted_post->state = !empty($location_state) && !is_wp_error($location_state) ? reset($location_state)->name : '';

                  /** Get gallery images */
                  $formatted_post->gallery_images = [];
                  if ($attached_images = get_attached_media('image', $postId)) {
                    foreach ($attached_images as $im) {
                      if ($formatted_post->thumbnail === $im->guid) {
                        continue;
                      }

                      $formatted_post->gallery_images[] = $im->guid;
                    }
                  }
                  $formatted_posts[] = $formatted_post;
                }

                $posts_array_for_caching[$widget['panels_info']['id']] = $formatted_posts;
              }

              $field = $formatted_posts;
            }

            if ($k === 'image_position') {
              $field = str_replace('_', ' ', $field);
            }

            /** Rebuild structure of feature groups and features */
            if ($k === 'feature_groups' && is_array($field)) {
              foreach ($field as &$fg) {
                $fg['image_section']['image_src'] = $fg['image_section']['image'] ? wp_get_attachment_image_src($fg['image_section']['image'], 'full')[0] : '';
                unset($fg['image_section']['so_field_container_state']);

                $fg['image_section']['image_position'] = str_replace('_', ' ', $fg['image_section']['image_position']);

                if (count($fg['features'])) {
                  foreach ($fg['features'] as &$feature) {
                    unset($feature['button_section']['so_field_container_state']);
                    unset($feature['testimonial_section']['so_field_container_state']);
                    $feature['testimonial_section']['image_src'] = $feature['testimonial_section']['image'] ? wp_get_attachment_image_src($feature['testimonial_section']['image'], 'full')[0] : '';
                    $feature['title'] = htmlspecialchars_decode($feature['title']);
                    $feature['description'] = htmlspecialchars_decode($feature['description']);
                  }
                }
              }
            }

            $fields[$k] = $field;
          }

          $widget['fields'] = $fields;

          $rows[$widget['panels_info']['grid']]['cells'][] = [
            'weight' => isset($content['grid_cells'][$key]) ? $content['grid_cells'][$key]['weight'] : 0,
            'widget' => $widget
          ];
        }
      }

      if ($posts_array_for_caching) {
        wp_cache_set('widget_posts_' . $post_id, $posts_array_for_caching, 'property_pro');
      }

      return $rows;
    }

    function property_pro_start_buffer_output_content()
    {
      if (!isset($_GET['pageType']))
        return;


      switch ($_GET['pageType']) {
        case 'json':
          ob_start([$this, 'property_pro_buffer_handler']);
          break;
        default;
      }
    }

    function property_pro_end_buffer_output_content()
    {
      if (!isset($_GET['pageType']))
        return;

      switch ($_GET['pageType']) {
        case 'json':
          if (ob_get_level()) {
            ob_end_flush();
          }
          break;
        default;
      }


    }

    function property_pro_buffer_handler($output)
    {
      global $post;

      $params = $this->property_pro_get_page_content();

      /** Using buffer output for single property page, but separate scripts from body content and send it separately */
      /** @TODO commented it while widgets for single page not ready */
      if (false && is_single() && $post->post_type === 'property') {

        $dom = new \DOMDocument;
        $dom->loadHTML($output);

        /** Get body node */
        $body = $dom->getElementsByTagName('body')->item(0);

        $mock = new \DOMDocument;

        $scripts = [];

        /** Get all script tags from body */
        $body_scripts = iterator_to_array($body->getElementsByTagName('script'));

        /** @var \DOMElement $node */
        foreach ($body_scripts as $node) {

          $scripts[] = [
            'src' => $node->getAttribute('src'),
            'content' => $node->textContent
          ];

          /** Removing scripts from body node */
          $node->parentNode->removeChild($node);
        };

        foreach ($body->childNodes as $child) {
          $mock->appendChild($mock->importNode($child, true));
        }

        $body_content = $mock->saveHTML();

        $params['post']['output'] = $body_content;
        $params['post']['scripts'] = $scripts;
      }

      if(is_single()){

        $seo_data = $this->property_pro_prepare_seo_meta_data($post);

        $head_tags = [
          '<meta property="og:type" content="' . $seo_data['og_type'] . '" data-react-helmet="true" />',
          '<meta property="og:title" content="' . $seo_data['title'] . '" data-react-helmet="true" />',
          '<meta property="og:description" content="' . $seo_data['description'] . '" data-react-helmet="true" />',
          '<meta property="og:url" content="' . $seo_data['og_url'] . '" data-react-helmet="true" />',
          '<meta property="og:site_name" content="' . $seo_data['site_name'] . '" data-react-helmet="true" />',
          '<meta property="fb:admins" content="' . $seo_data['admin_id'] . '" data-react-helmet="true" />',
          '<meta name="twitter:card" content="' . $seo_data['twitter_card_type'] . '" data-react-helmet="true" />',
          '<meta name="twitter:description" content="' . $seo_data['description'] . '" data-react-helmet="true" />',
          '<meta name="twitter:title" content="' . $seo_data['title'] . '" data-react-helmet="true" />',
          '<meta name="twitter:site" content="' . $seo_data['site'] . '" data-react-helmet="true" />',
          '<meta name="twitter:image" content="' . $seo_data['image'] . '" data-react-helmet="true" />',
          '<meta name="twitter:creator" content="' . $seo_data['site'] . '" data-react-helmet="true" />'
        ];

      }else{
        /** Dynamic meta which needed for payload */
        $dynamic_meta = [
            'og:type',
            'og:title',
            'og:description',
            'og:url',
            'og:site_name',
            'fb:admins',
            'twitter:card',
            'twitter:description',
            'twitter:title',
            'twitter:site',
            'twitter:image',
            'twitter:creator'
        ];

        // Get head content
        preg_match_all('/<head>(.*?)<\/head>/s', $output, $matches);

        // Get head meta data
        preg_match_all('~<([^/][^>]*?)>~', $matches[1][0], $arr, PREG_PATTERN_ORDER);
        $head_tags = array_values( array_filter( $arr[ 0 ], function ( $item ) use ( $dynamic_meta ) {

          $return = false;
          foreach ($dynamic_meta as $meta_item) {

            $return = strpos( $item, $meta_item ) != false;

            if( $return ) {
              break;
            }
          }
          return $return;
        } ) );
      }
      $params[ 'post' ][ 'head_tags' ] = $head_tags;

      return wp_json_encode($params);
    }

    function property_pro_remove_admin_bar()
    {
      if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
      }
    }

    function property_pro_add_svg_to_upload_mimes($upload_mimes)
    {
      $upload_mimes['svg'] = 'image/svg+xml';
      $upload_mimes['svgz'] = 'image/svg+xml';
      return $upload_mimes;
    }

    /**
     * Register guide post type
     *
     */
    function property_pro_register_guide_post_type()
    {
      $args = [
        'public' => true,
        'labels' => [
          'name' => 'Guides',
          'singular_name' => 'Guide',
        ],
        'rewrite' => [
          'slug' => 'guide',
          'with_front' => false
        ],
        'show_in_rest' => true,
        'supports' => [
          'title',
          'editor',
          'author',
          'excerpt',
          'thumbnail',
          'revisions',
          'page-attributes'
        ]
      ];
      register_post_type('propertypro-guide', $args);
    }

    function property_pro_register_guide_post_type_taxonomy()
    {

      $labels = [
        'name' => 'Categories',
        'singular_name' => 'Category'
      ];

      $args = [
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => [
          'slug' => 'guides',
          'with_front' => false
        ],
      ];

      register_taxonomy('propertypro-guide-category', ['propertypro-guide'], $args);
    }

    /**
     * Delete cache with siteorigin posts query widget result
     *
     * @param $post_ID
     * @param $post
     * @param $update
     * @return bool
     *
     * @author fq.jony@UD
     */
    function property_pro_delete_widget_posts_cache($post_ID, $post, $update)
    {

      /** If this is just a revision, don't send the email. */
      if (!$update || wp_is_post_revision($post_ID) || wp_is_post_autosave($post_ID)) {
        return false;
      }

      wp_cache_delete('widget_posts_' . $post_ID, 'property_pro');

      return true;

    }

    /**
     * Preparing data for seo meta tags
     *
     * @param $post
     * @return array
     */
    private function property_pro_prepare_seo_meta_data($post){
      global $wp;

      $data = [];

      $frontpage_id = get_option( 'page_on_front' );
      $wpseo_social = get_option( 'wpseo_social' );

      if($this->isSearchPage){
        $dynamic_data = $this->property_pro_build_search_title_and_description();
        $data['title'] = $dynamic_data['title'];
        $data['description'] = $dynamic_data['description'];
      }else{
        $data['title'] = wp_title( '&raquo;', false );
      }

      $data['description'] = isset($data['description']) ? $data['description'] : (get_the_excerpt( $post ) ? get_the_excerpt( $post ) : get_post_meta( $post->ID, '_yoast_wpseo_metadesc', true ));
      $data['site'] = '@' . (isset( $wpseo_social[ 'twitter_site' ] ) && $wpseo_social[ 'twitter_site' ] ? $wpseo_social[ 'twitter_site' ] : 'reddoorcompany');
      $data['image'] = isset( $wpseo_social[ 'og_default_image' ] ) && $wpseo_social[ 'og_default_image' ] ? $wpseo_social[ 'og_default_image' ] : get_post_meta( $frontpage_id, '_yoast_wpseo_opengraph-image', true );
      $data['og_url'] = home_url( $wp->request );
      $data['og_site_name'] = get_bloginfo();

      $twitter_card_type = isset($wpseo_social['twitter_card_type']) && $wpseo_social['twitter_card_type'] ? $wpseo_social['twitter_card_type'] : 'summary';

      if ( is_singular() && has_shortcode( $post->post_content, 'gallery' ) ) {

        $images = get_post_gallery_images($post);

        if ( count( $images ) > 0 ) {
          $twitter_card_type = 'summary_large_image';
        }
      }

      if ( ! in_array( $twitter_card_type, array(
          'summary',
          'summary_large_image',
          'app',
          'player',
      ), true )
      ) {
        $twitter_card_type = 'summary';
      }
      $data['twitter_card_type'] = $twitter_card_type;


      if ( is_front_page() || is_home() ) {
        $og_type = 'website';
      }
      elseif ( is_singular() ) {
        $og_type = 'article';
      }
      else {
        $og_type = 'object';
      }
      $data['og_type'] = $og_type;

      $fb_admins = $wpseo_social[ 'fb_admins' ];
      $admin_id = 0;

      if( $fb_admins ) {
        reset( $fb_admins );
        $admin_id = key( $fb_admins );
      }
      $data['admin_id'] = $admin_id;

      return $data;
    }

    function property_pro_build_search_title_and_description() {
      $path = parse_url( $_SERVER[ 'REQUEST_URI' ], PHP_URL_PATH );

      $path_array = explode( '/', $path );

      // TITLE

      $terms_array = [ 'city', 'zip', 'county', 'neighborhood', ];

      // Count of items which can be displayed at title
      $items_limit = 2;

      $residential_sale_type_label = 'Real Estate';

      // Build locations array
      $terms = [];
      foreach ($path_array as $path_item) {
        foreach ($terms_array as $term) {
          if( strpos( $path_item, $term . '_' ) !== false ) {
            $terms[] = ucfirst( str_replace( $term . '_', '', $path_item ) );
          }
        }
      }

      $locations = '';
      if( $terms && count( $terms ) <= $items_limit ) {
        sort( $terms, SORT_NATURAL );
        $locations = join( ' and ', $terms );
      }

      // If there is no selected subtypes or one of selected is 'other' then just display listing type
      $types = '';
      $property_type_label = 'property-type_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $property_type_label ) !== false ) {
          $types = ucfirst( str_replace( $property_type_label, '', $path_item ) );
          break;
        }
      }

      $type = $types;

      // Get listing subtypes array with plural values
      $plural_values = json_decode( file_get_contents( get_template_directory_uri() . '/static/schemas/listing_subtypes_plural_values.json' ), true );
      $subtypes = [];
      $subtypes_slugs = [];
      $property_subtype_label = 'property-subtype_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $property_subtype_label ) !== false ) {
          $subtype_slug = str_replace( $property_subtype_label, '', $path_item );
          $subtypes_slugs[] = $subtype_slug;
          $subtypes[] = $plural_values[ strtolower( $type ) ][ $subtype_slug ];
        }
      }

      // Checking if using 'other' subtype
      $exist_other_values = false;
      foreach ($subtypes_slugs as $subtype_slug) {
        if( $subtype_slug === 'other' ) {
          $exist_other_values = true;
          break;
        }
      }

      if( count( $subtypes ) <= $items_limit && !$exist_other_values ) {
        sort( $subtypes, SORT_NATURAL );
        $types = join( ' and ', $subtypes );
      }

      // Checking selected sale types
      $saleTypes = [];
      $property_sale_type_label = 'sale-type_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $property_sale_type_label ) !== false ) {
          $saleTypes[] = ucfirst( str_replace( $property_sale_type_label, '', $path_item ) );
        }
      }
      if( !$saleTypes ) {
        $saleTypes = [ 'Rent', 'Sale' ];
      }

      // Define sale type title's part
      $saleType = '';
      $shortSaleType = '';
      switch (strtolower( $type )) {
        case 'residential':
          $shortSaleType = $saleType = $residential_sale_type_label;
          break;
        case 'commercial':
          $shortSaleType = $saleType = 'Commercial Real Estate';
          if( $exist_other_values ) {
            $types = $saleType;
          }
          break;
        case 'land':
          $saleType = 'Land Real Estate';
          $shortSaleType = 'Land';
          if( $exist_other_values ) {
            $types = $saleType;
          }
          break;
      }

      // If display all sale type, then drop it
      if( count( $saleTypes ) === 2 && count( $subtypes ) > 0 ) {
        $saleType = '';
      } else if( count( $saleTypes ) === 1 ) {
        // Case when displayed particular sale type with listing subtype
        if( count( $subtypes ) > 0 && count( $subtypes ) <= 2 ) {
          $saleType = join( ' ', [ join( ' ', [ 'for', $saleTypes[ 0 ] ] ) ] );
        } else { //Case when displayed particular sale type without subtypes
          $saleType = join( ' ', [ $shortSaleType, join( ' ', [ 'for', $saleTypes[ 0 ] ] ) ] );
        }
      }

      if( $types ) {
        $title_array = [ $locations, $types, $saleType ];
      } else {
        $title_array = [ $locations, $saleType ];
      }

      $title = join( ' ', $title_array );

      // DESCRIPTION

      // Build description start
      $description_start = 'Found';

      // Determine prices
      $start_price = $this->no_min_text;
      $to_price = $this->no_max_text;
      $price_url_label = 'price_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $price_url_label ) !== false ) {
          if( $prices_string = str_replace( $price_url_label, '', $path_item ) ) {
            $prices = explode( ',', $prices_string );
            $start_price = isset( $prices[ 0 ] ) && !empty($prices[ 0 ]) ? $prices[ 0 ] : $this->no_min_text;
            $to_price = isset( $prices[ 1 ] ) && !empty($prices[ 1 ]) ? $prices[ 1 ] : $this->no_max_text;
          }
          break;
        }
      }

      // Build price part
      $_price = '';
      if( !($to_price === $this->no_max_text && $start_price === $this->no_min_text) ) {
        $_price .= ' priced';
        if( $to_price === $this->no_max_text ) {
          $_price .= ' no less than ' . $this->property_pro_format_price( $start_price );
        } elseif( $start_price === $this->no_min_text ) {
          $_price .= ' no more than ' . $this->property_pro_format_price( $to_price );
        } else {
          $_price .= ' between ' . $this->property_pro_format_price( $start_price ) . ' and ' . $this->property_pro_format_price( $to_price );
        }
      }

      // Determine bedrooms
      $bedrooms = 0;
      $bedrooms_url_label = 'bedrooms_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $bedrooms_url_label ) !== false ) {
          $bedrooms = str_replace( $bedrooms_url_label, '', $path_item );
          break;
        }
      }

      // Build bedrooms part
      $_bedrooms = '';
      if( $bedrooms ) {
        $_bedrooms .= ' at least ' . $bedrooms . ' ' . ($bedrooms === '1' ? 'bedroom' : 'bedrooms');
      }

      // Determine bathrooms
      $bathrooms = 0;
      $bathrooms_url_label = 'bathrooms_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $bathrooms_url_label ) !== false ) {
          $bathrooms = str_replace( $bathrooms_url_label, '', $path_item );
          break;
        }
      }

      // Build bathrooms part
      $_bathrooms = '';
      if( $bathrooms ) {
        if( $_bedrooms ) {
          $_bathrooms .= ',';
        }
        $_bathrooms .= ' at least ' . $bathrooms . ' ' . ($bathrooms === '1' ? 'bathroom' : 'bathrooms');
      }

      // Determine SQFT
      $start_sqft = $this->no_min_text;
      $to_sqft = $this->no_max_text;
      $sqft_url_label = 'sqft_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $sqft_url_label ) !== false ) {
          if( $sqft_string = str_replace( $sqft_url_label, '', $path_item ) ) {
            $sqft = explode( ',', $sqft_string );
            $start_sqft = isset( $sqft[ 0 ] ) && !empty($sqft[ 0 ]) ? $sqft[ 0 ] : $this->no_min_text;
            $to_sqft = isset( $sqft[ 1 ] ) && !empty($sqft[ 1 ]) ? $sqft[ 1 ] : $this->no_max_text;
          }
          break;
        }
      }

      // Build sqft part
      $position = 'start';
      if( $_bedrooms || $_bathrooms ) {
        $position = 'middle';
      }
      $_sqft = $this->property_pro_determine_sqft( [ 'start_sqft' => $start_sqft, 'to_sqft' => $to_sqft, ], $position );

      // Determine SQFT
      $start_acres = $this->no_min_text;
      $to_acres = $this->no_max_text;
      $acres_url_label = 'acres_';
      foreach ($path_array as $path_item) {
        if( strpos( $path_item, $acres_url_label ) !== false ) {
          if( $acres_string = str_replace( $acres_url_label, '', $path_item ) ) {
            $acres = explode( ',', $acres_string );
            $start_acres = isset( $acres[ 0 ] ) && !empty( $acres[ 0 ] ) ? $acres[ 0 ] : $this->no_min_text;
            $to_acres = isset( $acres[ 1 ] ) && !empty( $acres[ 1 ] ) ? $acres[ 1 ] : $this->no_max_text;
          }
          break;
        }
      }

      // Build acres part
      $_acres = '';
      if( ($start_acres || $to_acres) && !($to_acres === $this->no_max_text && $start_acres === $this->no_min_text) ) {
        if( $_bedrooms || $_bathrooms || $_sqft ) {
          $_acres = ', and';
        }
        if( $to_acres === $this->no_max_text ) {
          $_acres .= ' at least ' . $this->property_pro_format_acres( $start_acres ) . ' acres';
        } elseif( $start_acres === $this->no_min_text ) {
          $_acres .= ' at most ' . $this->property_pro_format_acres( $to_acres ) . ' acres';
        } else {
          $_acres .= ' between ' . $this->property_pro_format_acres( $start_acres ) . ' and ' . $this->property_pro_format_acres( $to_acres ) . ' acres';
        }
      }

      // Use an "and" after the last comma.
      if( !$_acres ) {
        if( $_sqft ) {
          $position = 'end';
          if( !$_bathrooms && !$_bedrooms ) {
            $position = 'start';
          }
          $_sqft = $this->property_pro_determine_sqft( [ 'start_sqft' => $start_sqft, 'to_sqft' => $to_sqft, ], $position );
        } else if( $_bathrooms ) {
          $_bathrooms = str_replace( ',', ', and', $_bathrooms );
        }
      }

      // For residential filter without subtypes sale type is 'homes'
      if( $shortSaleType === $residential_sale_type_label && !count( $subtypes ) ) {
        $saleType = str_replace( $residential_sale_type_label, 'homes', $saleType );
      }

      // Added 'listings' to sale type or property type/subtype for commercial and land listings
      if( in_array( strtolower($type), [ 'land', 'commercial' ] ) ) {
        if( $types ) {
          $types .= ' listings';
        } else {
          if( count( $saleTypes ) === 1 ) {
            // Case when displayed particular sale type with listing subtype
            if( count( $subtypes ) > 0 && count( $subtypes ) <= 2 ) {
              $saleType = join( ' ', [ join( ' ', [ 'listings', 'for', $saleTypes[ 0 ] ] ) ] );
            } else { //Case when displayed particular sale type without subtypes
              $saleType = join( ' ', [ $shortSaleType, 'listings', join( ' ', [ 'for', $saleTypes[ 0 ] ] ) ] );
            }
          } else {
            $saleType .= ' listings';
          }
        }
      }

      $description = $description_start . ($types ? ' ' . strtolower( $types ) : '') . ($saleType ? ' ' . strtolower( $saleType ) : '') . ($locations ? ' in ' . $locations : '') . $_price . (($_bedrooms || $_bathrooms) ? ' that have' . $_bedrooms . $_bathrooms : '') . $_sqft . $_acres . '.';

      return [ 'title' => $title, 'description' => $description ];
    }

    /**
     * Build seo meta data
     *
     */
    function property_pro_build_seo_meta_tags() {
      global $post;

      $seo_data = $this->property_pro_prepare_seo_meta_data( $post );

      echo '<meta property="og:type" content="' . $seo_data[ 'og_type' ] . '" data-react-helmet="true" /> ' . "\n";
      echo '<meta property="og:title" content="' . $seo_data[ 'title' ] . '" data-react-helmet="true" />' . "\n";
      echo '<meta property="og:description" content="' . $seo_data[ 'description' ] . '" data-react-helmet="true" />' . "\n";
      echo '<meta property="og:url" content="' . $seo_data[ 'og_url' ] . '" data-react-helmet="true" />' . "\n";
      echo '<meta property="og:site_name" content="' . $seo_data[ 'og_site_name' ] . '" data-react-helmet="true" />' . "\n";
      echo '<meta property="fb:admins" content="' . $seo_data[ 'admin_id' ] . '" data-react-helmet="true" />' . "\n";
      echo '<meta name="twitter:card" content="' . $seo_data[ 'twitter_card_type' ] . '" data-react-helmet="true" />' . "\n";
      echo '<meta name="twitter:description" content="' . $seo_data[ 'description' ] . '" data-react-helmet="true" />' . "\n";
    }

    /**
     * Determine SQFT part for meta title and description
     *
     * @param $sqft
     * @param $position
     * @return string
     */
    private function property_pro_determine_sqft( $sqft, $position ) {
      $_sqft = '';
      if( ($sqft[ 'start_sqft' ] || $sqft[ 'to_sqft' ]) && !($sqft[ 'to_sqft' ] === $this->no_max_text && $sqft[ 'start_sqft' ] === $this->no_min_text) ) {
        if( $position === 'end' ) {
          $_sqft = ', and';
        } elseif( $position === 'middle' ) {
          $_sqft = ',';
        }
        if( $sqft[ 'to_sqft' ] === $this->no_max_text ) {
          $_sqft .= ' at least ' . $this->property_pro_format_sqft( $sqft[ 'start_sqft' ] ) . ' SQFT';
        } else if( $sqft[ 'start_sqft' ] === $this->no_min_text ) {
          $_sqft .= ' at most ' . $this->property_pro_format_sqft( $sqft[ 'to_sqft' ] ) . ' SQFT';
        } else {
          $_sqft .= ' between ' . $this->property_pro_format_sqft( $sqft[ 'start_sqft' ] ) . ' and ' . $this->property_pro_format_sqft( $sqft[ 'to_sqft' ] ) . ' SQFT';
        }
      }

      return $_sqft;
    }

    /**
     * Formatting price for meta tags
     *
     * @param $price
     * @return string
     */
    private function property_pro_format_price( $price ) {

      return '$' . number_format( $price, 0, '.', ',');;
    }

    /**
     * Formatting sqft for meta tags
     *
     * @param $sqft
     * @return string
     */
    private function property_pro_format_sqft( $sqft ) {
      return number_format( $sqft, 1);
    }

    /**
     * Formatting acres for meta tags
     *
     * @param $acres
     * @return string
     */
    private function property_pro_format_acres( $acres ) {
      return number_format( $acres, 2);
    }

  }

}