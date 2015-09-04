<?php
/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'madison_maybe_header_multipurpose_search' ) ) {
  /**
   * Display multipurpose search
   */
  function madison_maybe_header_multipurpose_search( $classes = 'col-5-12' ) {
    global $wp_query;

    $search_enabled = get_theme_mod( 'madison_multipurpose_search_enable' );

    if( !empty( $wp_query->wpp_search_page ) ) {
      $s = !empty( $_REQUEST['wpp_search']['s'] ) ? $_REQUEST['wpp_search']['s'] : '';
    } else {
      $s = !empty( $_REQUEST['s'] ) ? $_REQUEST['s'] : '';
    }

    if( is_array( $classes ) ) {
      $classes = implode(' ', $classes );
    }

    ob_start();

    ?>
    <section class="column multipurpose-search-wrapper <?php echo $classes; ?>">
      <?php if( !empty( $search_enabled ) ) : ?>
        <form name="multipurpose_search" action="<?php echo home_url(); ?>">
          <input type="hidden" name="mps" value="1"/>
          <input type="text" name="s" value="<?php echo !empty($s) ? $s : ''; ?>"
                 placeholder="<?php _e('Type Keywords', 'madison') ?>"/>
          <select name="post_type">
            <option value="property"><?php _e('Rentals', 'madison'); ?></option>
            <option
              value="post" <?php echo(!empty($s) && !isset($wp_query->wpp_search_page) ? 'selected="selected"' : ''); ?>><?php _e('Articles', 'madison'); ?></option>
          </select>
        </form>
      <?php else : ?>
        &nbsp;
      <?php endif; ?>
    </section>
    <?php

    return ob_get_clean();
  }
}
