<?php
/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'madison_maybe_header_multipurpose_search' ) ) {
  /**
   * Display multipurpose search
   */
  function rdc_maybe_header_multipurpose_search( $classes = 'col-5-12' ) {
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

/**
 * Prevent function redeclaration
 */
if ( !function_exists( 'rdc_social_information' ) ) {
  /**
   * Social Networks Links called in the footer.
   */
  function rdc_social_information() {
    $mods = array(
      'social' => array(
        'twitter'     => get_theme_mod( 'madison_footer_twitter' ),
        'facebook'    => get_theme_mod( 'madison_footer_facebook' ),
        'google_plus' => get_theme_mod( 'madison_footer_google' ),
        'linkedin'    => get_theme_mod( 'madison_footer_linkedin' ),
        'pinterest'   => get_theme_mod( 'madison_footer_pinterest' ),
        'instagram'   => get_theme_mod( 'madison_footer_instagram' ),
        'youtube'     => get_theme_mod( 'madison_footer_youtube' ),
      ),
    );

    $show = false;
    $show_social = false;

    // Let's see if any of the mods are set.
    foreach ( $mods as $mod ) {
      if ( is_array( $mod ) ) {
        foreach ( $mod as $item ) {
          if ( ! empty( $item ) ) {
            $show = true;
            $show_social = true;
            break;
          }
        }
      } else if ( ! empty( $mod ) ) {
        $show = true;
        break;
      }
    }

    // If all the items are empty, bail.
    if ( $show != true ) {
      return;
    }

    ob_start();

    ?>
    <section id="site-contact-information">
      <div class="section-container column-wrapper">
        <?php if ( $show_social === true ) : ?>
          <div class="site-social-info right column col-7-12">
            <?php foreach ( $mods['social'] as $network => $url ) : ?>
              <?php if ( ! empty( $url ) ) : ?>
                <a href="<?php echo esc_url( $url ); ?>" class="site-social-<?php echo str_replace( '_', '-', $network ); ?>"><i class="fa fa-<?php echo str_replace( '_', '-', $network ) ?>"></i></a>
              <?php endif; ?>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </section>
    <?php

    return ob_get_clean();
  }
}