<?php

// =============================================================================
// VIEWS/RENEW/TEMPLATE-BLANK-7.PHP (Container | No Header, Footer)
// -----------------------------------------------------------------------------
// A blank page for creating unique layouts.
// =============================================================================

?>

<?php

if ( apply_filters( 'x_legacy_cranium_headers', true ) ) {
  x_get_view( 'global', '_header' );
} else {
  get_header();
}

?>

  <div class="x-container max width offset">
    <div class="x-main full" role="main">

      <?php while ( have_posts() ) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
          <?php x_get_view( 'global', '_content', 'the-content' ); ?>
        </article>

      <?php endwhile; ?>

    </div>
  </div>

<?php get_footer(); ?>