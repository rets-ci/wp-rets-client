<?php
/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'madison_maybe_header_multipurpose_search' ) ) {
  /**
   * Display multipurpose search
   */
  function madison_maybe_header_multipurpose_search() {

    $search_enabled = get_theme_mod( 'madison_multipurpose_search_enable' );
    if( empty( $search_enabled ) ) {
      //return;
    }

    ob_start();

    ?>
    <section class="column col-5-12 multipurpose-search-wrapper">
      <form name="multipurpose_search">
        <input type="text" name="s" value="<?php echo !empty( $_REQUEST['s'] ) ? $_REQUEST['s'] : ''; ?>" placeholder="<?php _e( 'Type Keywords', 'madison' ) ?>" />
        <select name="post_type">
          <option value="property"><?php _e( 'Rentals', 'madison' ); ?></option>
          <option value="post"><?php _e( 'Articles', 'madison' ); ?></option>
        </select>
      </form>
    </section>
    <?php

    return ob_get_clean();
  }
}
