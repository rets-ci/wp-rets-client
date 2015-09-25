<?php

/**
* Admin class
*/

class Widvis_Admin extends WidVis_Base {
    
    protected $pages_list;
    protected $categories_list;
    
	public function bootstrap() {
		
		// Add all hooks and filters
		if(is_admin()){
			add_filter( 'plugin_action_links', array( $this, 'settings_link' ), 10, 2 ); // Add link in WP plugins screen
			add_action( 'sidebar_admin_setup', array($this, 'register_admin_scripts' ), 10);
			add_action( 'in_widget_form', array($this, 'in_widget_form'), 10, 3);
			add_filter( 'widget_update_callback', array( $this, 'widget_update' ), 10, 3 );
			
			$this->pages_list = array();
			$this->categories_list = array();
			$this->get_pages_flattened_tree($this->pages_list);
			$this->get_categories_flattened_tree($this->categories_list);
		} else {
			add_action( 'sidebars_widgets', array( $this, 'sidebars_widgets' ) );
		}
	}
	
	/**
    * Add a "Settings" link on the plugins page 
    */
    public function settings_link( $links, $file ) {

        if ( $this->plugin['slug'] == $file ) {
            $links[] = '<a href="' . admin_url( 'widgets.php' ) . '">' . __( 'Widgets', $this->plugin['textdomain'] ) . '</a>';
        }

        return $links;
    }
	
    /*
	* Add our custom CSS
	**/
    public function register_admin_scripts(){
		wp_enqueue_style( 'widvis-css', $this->plugin['url'].'css/admin.css', array(), $this->plugin['version'] );
	}
	
	/*
	* Insert admin form in widgets
	**/
	public function in_widget_form( $widget, $return, $instance ){
	
		$widvis_conditions = array(
			'action'=>'',
			'rules'=>array(
				'main'=>array(),
				'page'=>array(),
				'cat'=>array(),
				'author'=>array(),
				'tag'=>array(),
				'archive'=>array()
			)
		);
		
		if(isset($instance['widvis_conditions'])){
			$instance['widvis_conditions']['rules'] = wp_parse_args($instance['widvis_conditions']['rules'], $widvis_conditions['rules']); // Apply defaults so keys are not missing and prevent notice
		} else {
			$instance['widvis_conditions'] = $widvis_conditions;
		}
		
		$categories = get_categories( array( 'number' => 1000, 'orderby' => 'count', 'order' => 'DESC' ) );
		$authors = get_users( array( 'orderby' => 'display_name' ) );
		$tags = get_tags();
		$pages = get_pages();
		$vars = array();
		$vars['widget'] = $widget;
		$vars['categories'] = $categories;
		$vars['authors'] = $authors;
		$vars['tags'] = $tags;
		$vars['pages'] = $pages;
		$vars['instance'] = $instance;
		$vars['widvis'] = $this;
		
		$vars['pages_list'] = $this->pages_list;
		$vars['categories_list'] = $this->categories_list;
		
		$vars['textdomain'] = $this->plugin['textdomain'];
		
		$this->plugin['view']->render( 'widget-admin.php', $vars );
		
	}
	
	/*
	* Widget Update
	* 
	* Saving routine performed before widget data from form is saved
	*
	* @param array $instance The widget data
	* @param array $new_instance The widget data
	**/
	public function widget_update( $instance, $new_instance, $old_instance ) {
		
		if( isset($new_instance['widvis_conditions']) and isset($new_instance['widvis_conditions']['rules']) ){
			$instance['widvis_conditions'] = $new_instance['widvis_conditions'];
		} else {
			unset($instance['widvis_conditions']);
		}
		return $instance;
	}
	
	/*
	* Widget Display Callback
	*
	* @param array $instance The widget data
	* @return bool True or false
	**/
	function widget_display_callback($instance){
		return $this->is_widget_visible( $instance );
	}
	
	/*
	* Is Widget Visible
	*
	* Does checks if the widget should be shown or not
	*
	* @param array $widget_settings The widget data
	* @return bool True or false
	**/
	function is_widget_visible( $widget_settings ){
		global $post, $wp_query;
		
		$action = '';
		$rules = array();
		$result = null; // Null means no rules hit yet
		
		if(isset($widget_settings['widvis_conditions']['action'])){
			$action = $widget_settings['widvis_conditions']['action'];
		}
		if(isset($widget_settings['widvis_conditions']['rules'])){
			$rules = $widget_settings['widvis_conditions']['rules'];
		}
		
		// Rules check - main
		if(isset($rules['main'])){
			if( in_array('front_page', $rules['main']) ){
				if(is_front_page()){
					$result = true;
				}
			} else if( in_array('posts_page', $rules['main']) ){
				if(is_home()){
					$result = true;
				}
			} else if( in_array('404_page', $rules['main']) ){
				if(is_404()){
					$result = true;
				}
			} else if( in_array('search_page', $rules['main']) ){
				if(is_search()){
					$result = true;
				}
			}
		}
		
		// Page
		if(isset($rules['page'])){
			if( in_array('all', $rules['page']) ){
				if( is_page() ){ // Check if its a category or a post with a category
					$result = true;
				}
			} else {
				foreach($rules['page'] as $page_id){
					if(is_page((int)$page_id)){ // Check if page and ID = $page_id
						$result = true;
						break;
					}
				}
				
			}
		}
		
		// Category
		if(isset($rules['cat'])){
			if( in_array('all', $rules['cat']) ){
				if(is_category() or (is_singular('post') and has_category())){ // Check if its a category or a post with a category
					$result = true;
				}
			} else {
				foreach($rules['cat'] as $cat_id){
					if(is_category((int)$cat_id) or in_category((int)$cat_id)){ // Check if its a category or a post with a category identified by $cat_id
						$result = true;
						break;
					}
				}
				
			}
		}
		
		// Author
		if(isset($rules['author'])){
			if( in_array('all', $rules['author']) ){
				if(is_singular()){ 
					$result = true;
				}
			} else {
				foreach($rules['author'] as $author_id){
					if(is_singular() and $author_id == $post->post_author){ // Check if its a post by this author
						$result = true;
						break;
					}
				}
				
			}
		}
		
		// Tag
		if(isset($rules['tag'])){
			if( in_array('all', $rules['tag']) ){
				if(is_singular()){ 
					$result = true;
				}
			} else {
				foreach($rules['tag'] as $tag_id){
					if(is_singular() and has_tag($tag_id) ){ // Check if its a post with this tag
						$result = true;
						break;
					}
				}
				
			}
		}
		
		// Archive
		if(isset($rules['archive'])){
			if( in_array('author', $rules['archive']) ){
				if(is_author()){ 
					$result = true;
				}
			}
			if( in_array('category', $rules['archive']) ){
				if(is_category()){ 
					$result = true;
				}
			}
			if( in_array('custom_post', $rules['archive']) ){
				if(is_post_type_archive()){ 
					$result = true;
				}
			}
			if( in_array('custom_taxonomy', $rules['archive']) ){
				if(is_tax()){ 
					$result = true;
				}
			}
			if( in_array('date', $rules['archive']) ){
				if(is_date()){ 
					$result = true;
				}
			}
			if( in_array('tag', $rules['archive']) ){
				if(is_tag()){ 
					$result = true;
				}
			}
		}
		
		if('hide'==$action){
			if( null === $result){ // No rules was hit, show by default
				$result = true;
			} else if ($result){ // A rule was hit
				$result = false; // But since we want to hide, reverse boolean
			}
		} else if ( 'show' == $action ){
			if( null === $result){ // No rules was hit
				$result = false;
			}
		}
		
		return $result;
	}
	
	/**
	* Filter the list of widgets for a sidebar so that active sidebars work as expected.
	*
	* @param array $widget_areas An array of widget areas and their widgets.
	* @return array The modified $widget_area array.
	*/
	public function sidebars_widgets( $widget_areas ) {
		$settings = array();
		foreach ( $widget_areas as $widget_area => $widgets ) {
			
			if ( !empty( $widgets ) and 'wp_inactive_widgets' != $widget_area ) {

				foreach ( $widgets as $position => $widget_id ) {
					
					$last_dash_pos = strrpos($widget_id, '-');
					if( false !== $last_dash_pos ) {
						$basename = substr($widget_id, 0, $last_dash_pos); // Examples: "text-2" will return "text", "recent-post-2" will return "recent-post"
						$index = substr($widget_id, $last_dash_pos+1); // Examples: "text-2" will return "2", "recent-post-2" will return "2"
						
						if ( ! isset( $settings[$basename][$index] ) ) { // Check if it exist already from previous loop run
							// Get data for this widget from options table.
							$settings[$basename][$index] = $this->get_widget_db_option($basename, $index);
						}
						
						if ( isset( $settings[$basename][$index]['widvis_conditions'] ) ) {
							if ( false === $this->is_widget_visible( $settings[$basename][$index] ) ) {
								unset( $widget_areas[$widget_area][$position] );
							}
						}
					
					}  
					
				}
			}
		}
		return $widget_areas;
	}
	
	/*
	* Get Flattened Pages Tree
	*
	* Recursive function for building one dimensional array containing a level element use for building nested checkboxes
	*
	* @param array $flattened_list A passed-by-referrence list of data.
	* @param int $parent_id Get all child determined by this param
	* @param $level Current depth level
	* @return void
	**/
	public function get_pages_flattened_tree(&$flattened_list, $parent_id=0, $level=0){

		$args = array(
			'parent'=>$parent_id
		);
		
		$pages = get_pages( $args );
		
		if($pages){
			$list=array();
			foreach($pages as $page){
				$holder = (array) $page; // Cast as array
				if(empty($holder['post_title'])){
					$holder['post_title'] = __('(No Title)', $this->plugin['textdomain']);
				}
				$holder['level'] = $level;
				$flattened_list[] = $holder;
				$this->get_pages_flattened_tree($flattened_list, $page->ID, $level+1); // Call function recursively
				
			}
		}
	}
	
	/*
	* Get Flattened Categories Tree
	*
	* Recursive function for building one dimensional array containing a level element use for building nested checkboxes
	*
	* @param array $flattened_list A passed-by-referrence list of data.
	* @param int $parent_id Get all child determined by this param
	* @param $level Current depth level
	* @return void
	**/
	public function get_categories_flattened_tree(&$flattened_list, $parent_id=0, $level=0){

		$args = array(
			'parent'=>$parent_id
		);
		
		$categories = get_categories( $args );
		
		if($categories){
			$list=array();
			foreach($categories as $category){
				$holder = (array) $category; // Cast as array
				if(empty($holder['name'])){
					$holder['name'] = __('(No Title)', $this->plugin['textdomain']);
				}
				$holder['level'] = $level;
				$flattened_list[] = $holder;
				$this->get_categories_flattened_tree($flattened_list, $category->term_id, $level+1); // Call function recursively
				
			}
		}
	}
	
	/**
	* Get data for a widget from options table.
	*
	* @param string $id The unique ID of a widget.
	* @param int $index The numeric index of the widget.
	* @return array The array of widget settings or empty array if none
	*/
	private function get_widget_db_option($id, $index){
		$settings = get_option( 'widget_' . $id );
		if( isset( $settings[$index] ) ){
			return $settings[$index];
		}
		return array();
	}
	
	/**
	* In Array Checked
	*
	* Check if element is in array and return string for use in checkboxes
	*
	* @param array $array The haystack.
	* @param variant $check The needle in the haystack.
	* @param bool $echo On true 'checked="checked"' is echoed, on false it is returned.
	* @return string The string 'checked="checked"'.
	*/
	function in_array_checked( $array, $check, $echo = true ){
		$return = '';
		if( in_array( $check, (array) $array ) ) {
			$return = 'checked="checked"';
		}
		if($echo){
			echo $return;
		}
		return $return;
	}
	
	/**
	* In Array Selected
	*
	* Check if element is in array and return string for use in selectboxes
	*
	* @param array $array The haystack.
	* @param variant $check The needle in the haystack.
	* @param bool $echo On true 'selected="selected"' is echoed, on false it is returned.
	* @return string The string 'selected="selected"'.
	*/
	function in_array_selected( $array, $check, $echo = true ){
		$return = '';
		if( in_array( $check, (array) $array ) ) {
			$return = 'selected="selected"';
		}
		if($echo){
			echo $return;
		}
		return $return;
	}
}