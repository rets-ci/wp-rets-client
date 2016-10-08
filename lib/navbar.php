<?php
/**
 * Adds Rabbit icon to navbar with some information about the container.
 *
 * * HTTP_X_SELECTED_BRANCH
 * * HTTP_X_SELECTED_CONTAINER
 * * HTTP_X_SELECTED_BACKEND
 *
 */
namespace RabbitCI\Navbar {

  add_action( 'admin_bar_menu', array( 'RabbitCI\Navbar\Actions', 'admin_bar_menu' ), 35 );


  class Filters {}

  class Actions {

    /**
     * Render Backend/Container Info
     *
     * @param $wp_admin_bar
     */
    public static function admin_bar_menu( $wp_admin_bar ) {

      if( !$wp_admin_bar ) {
        return;
      }

      $_backend = null;

      if( isset( $_SERVER['HTTP_X_SELECTED_BACKEND'] ) ) {
        $_backend = $_SERVER['HTTP_X_SELECTED_BACKEND'];
      }

      // overrides HTTP_X_SELECTED_BACKEND
      if( isset( $_SERVER['HTTP_X_VARNISH_BACKEND'] ) ) {
        $_backend = $_SERVER['HTTP_X_VARNISH_BACKEND'];
      }

      // default to this if set
      if( !$_backend && isset( $_SERVER['HTTP_X_SET_BACKEND'] ) ) {
        $_backend = $_SERVER['HTTP_X_SET_BACKEND'];
      }

      // encoded rabbit image.
      $_image_data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAARCAYAAAAsT9czAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMmJlNjc3Yi00OTUxLTQ5YTktOTBkNi1iZDJjODFiODg0NTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUNEMDJBMDg4NTczMTFFNjk3RkJGOThFQTRGMjMxMkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUNEMDJBMDc4NTczMTFFNjk3RkJGOThFQTRGMjMxMkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MTIzYmJlNC02ZjM2LTRlMDYtODkxOS04MGM3MWZmZWEwYzYiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3ZTg0YTgxMi1jZGRkLTExNzktOTAxYy1kNzY3ZTMxOGE1NjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7VJ4TkAAACBklEQVR42pyVTUhUURTHnWmGwSJCISNKpQZEoY1kH37hKhdim2oR4sIEjTYtWkiL6cG8bNMH2mZQUiSqWejCVRGhNBTKIMIQTIiWLQUVqskYGDTqd+E8uDzm3Td24Mf9Ou/+77n33PsC8Xi8rAQ7Co3QBmfgOGzBZ3gPHyzLKvhNEihBrAvuwnmIePjkYBoeI7r2v2LlcEyiyIvwGFQbvhmHO4jm3QNBKS/CEDRI/Tksw1dIwRuw4CPUwKxB7CZkbNs+VSyya5Qz0t6VMmyYTC3qEUxBn8HvuzpjIlzRI4tpDmEfIWUPYRJuQA98gU34BL80v0p4R4RVutgTn8n/wG9XXz+swjdoglZZwCGX30l4qou9gNcGsQPwVvx0q4O0nOs8jIiv264TXaeeIKd9orskK1/yuIO1HkKO3VLb6YhFfMSOyFmmtL6/grKCVi9m3XDFEcuU8Ir8hDkYlUjuq2yWscvQImdYzELqm5A0XsFVg5CKaA8OwzYMwzlt/AIprvqibFc95Vm5jzuQVZnK+A/9BTHdm3VJ5Qqfe9XBpFkvh6BWV/dmwsMvKlfgJSSl7ja1mITpHIKu9gA0y/u3CAtS75XX/p4kk5N5z0A9Sw9kAe1sY7TMcHBuSwu62RKVbmrbB9k2VY8hkpC/w8H9iHm95CfkN5OT7UrqDohuUNw2TfJPgAEA+nR/q3mtl5MAAAAASUVORK5CYII=";

      $wp_admin_bar->add_node( array(
        'id'      => 'wp-rabbit',
        'parent'  => 'top-secondary',
        'title'		=> '<span class="ab-icon dashicons" style=""><img width="27" height="17" alt="rabbit.ci" src="' . $_image_data . '" /></span>'
      ));

      $wp_admin_bar->add_node( array(
        'parent' => 'wp-rabbit',
        'title' => sprintf( __( '%s' ), $_backend ),
        'href' => '#'
      ));

    }

  }

}