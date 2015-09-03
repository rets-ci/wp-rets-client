<?php
/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'madison_maybe_header_multipurpose_search' ) ) {
  /**
   * Display multipurpose search
   */
  function madison_maybe_header_multipurpose_search() {
    global $wp_query;

    $search_enabled = get_theme_mod( 'madison_multipurpose_search_enable' );
    if( empty( $search_enabled ) ) {
      //return;
    }

    if( !empty( $wp_query->wpp_search_page ) ) {
      $s = !empty( $_REQUEST['wpp_search']['s'] ) ? $_REQUEST['wpp_search']['s'] : '';
    } else {
      $s = !empty( $_REQUEST['s'] ) ? $_REQUEST['s'] : '';
    }

    ob_start();

    ?>
    <section class="column col-5-12 multipurpose-search-wrapper">
      <form name="multipurpose_search" action="<?php echo home_url(); ?>" >
        <input type="hidden" name="mps" value="1" />
        <input type="text" name="s" value="<?php echo !empty( $s ) ? $s : ''; ?>" placeholder="<?php _e( 'Type Keywords', 'madison' ) ?>" />
        <select name="post_type">
          <option value="property"><?php _e( 'Rentals', 'madison' ); ?></option>
          <option value="post" <?php echo ( !empty( $s ) && !isset( $wp_query->wpp_search_page ) ? 'selected="selected"' : ''); ?>><?php _e( 'Articles', 'madison' ); ?></option>
        </select>
      </form>
    </section>
    <?php

    return ob_get_clean();
  }
}
