<?php
/**
 * Navigation Menu template functions
 * Fixes Menu to Bootstrap standard
 *
 * @version 0.1.0
 * @author Usability Dynamics
 * @namespace UsabilityDynamics
 * @since 0.1.0
 */

namespace UsabilityDynamics\Theme {

  /**
   * Create HTML list of nav menu items.
   *
   * @version 0.1.0
   * @author Usability Dynamics
   * @namespace UsabilityDynamics\Theme
   */
  class Nav_Menu extends \Walker_Nav_Menu {

    /**
     * @see Walker::start_lvl()
     * @since 3.0.0
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param int    $depth Depth of page. Used for padding.
     * @param array  $args
     */
    function start_lvl( &$output, $depth = 0, $args = array() ) {
      $indent = str_repeat("\t", $depth);
      $output .= "\n$indent<ul class=\"dropdown-menu\">\n";
    }

    /**
     * @see Walker::start_el()
     * @since 3.0.0
     *
     * @param string       $output Passed by reference. Used to append additional content.
     * @param object       $item Menu item data object.
     * @param int          $depth Depth of menu item. Used for padding.
     * @param array|object $args
     * @param int          $id
     *
     * @internal param int $current_page Menu item ID.
     */
	function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$class_names = $value = '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

        if( $item->is_parent ) {
          $classes[] = 'dropdown';
        }
        if( in_array( 'current_page_item', $classes ) ) {
          $classes[] = 'active';
        }
		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
        
		$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $value . $class_names .'>';

		$atts = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target )     ? $item->target     : '';
		$atts['rel']    = ! empty( $item->xfn )        ? $item->xfn        : '';
		$atts['href']   = ! empty( $item->url )        ? $item->url        : '';
        
        if( $item->is_parent ) {
          $atts[ 'data-toggle' ] = 'dropdown';
          $atts[ 'class' ] = 'dropdown-toggle';
          $atts['href'] = '#';
          //$atts['data-target'] = '#';
        }

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( ! empty( $value ) ) {
				$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

		$item_output = $args->before;
		$item_output .= '<a'. $attributes .'>';
		$item_output .= $args->link_before;
        $item_output .= apply_filters( 'the_title', $item->title, $item->ID );
        $item_output .= $item->is_parent ? ' <b class="caret"></b>' : '';
        $item_output .= $args->link_after;
		$item_output .= '</a>';
		//$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

  }
  
  /**
   * Detemine if element of menu is a parent.
   * 
   * @param array $sorted_menu_items
   * @param array $args
   * @return array
   */
  function wp_nav_menu_objects( $sorted_menu_items, $args ) {
      $last_top = 0;
      foreach ( $sorted_menu_items as $key => $obj ) {
          // it is a top lv item?
          if ( 0 == $obj->menu_item_parent ) {
              // set the key of the parent
              $last_top = $key;
          } else {
              $sorted_menu_items[$last_top]->is_parent = true;
          }
      }
      return $sorted_menu_items;
  }
  add_filter( 'wp_nav_menu_objects', 'UsabilityDynamics\Theme\wp_nav_menu_objects', 10, 2 );

}