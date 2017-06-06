<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/WIDGETS.PHP
// -----------------------------------------------------------------------------
// Sets up the default widget areas for X.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Register Widget Areas
// =============================================================================

// Register Widget Areas
// =============================================================================

if ( ! function_exists( 'x_widgets_init' ) ) :
  function x_widgets_init() {

    register_sidebar( array(
      'name'          => __( 'Main Sidebar', '__x__' ),
      'id'            => 'sidebar-main',
      'description'   => __( 'Appears on posts and pages that include the sidebar.', '__x__' ),
      'before_widget' => '<div id="%1$s" class="widget %2$s">',
      'after_widget'  => '</div>',
      'before_title'  => '<h4 class="h-widget">',
      'after_title'   => '</h4>',
    ) );

  }
  add_action( 'widgets_init', 'x_widgets_init' );
endif;