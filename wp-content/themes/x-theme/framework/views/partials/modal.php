<?php

// =============================================================================
// VIEWS/PARTIALS/MODAL.PHP
// -----------------------------------------------------------------------------
// Modal partial.
// =============================================================================

$mod_id               = ( isset( $mod_id )               ) ? $mod_id : '';
$modal_close_location = ( isset( $modal_close_location ) ) ? explode( '-', $modal_close_location ) : explode( '-', 'top-right' );


// Prepare Attr Values
// -------------------

$classes_modal       = x_attr_class( array( $mod_id, 'x-modal', $class ) );
$classes_modal_close = x_attr_class( array( 'x-modal-close', 'x-modal-close-' . $modal_close_location[0], 'x-modal-close-' . $modal_close_location[1] ) );


// Prepare Atts
// ------------

$atts_modal = array(
  'class'             => $classes_modal,
  'role'              => 'dialog',
  'tabindex'          => '-1',
  'data-x-toggleable' => $mod_id,
  'data-x-scrollbar'  => '{"suppressScrollX":true}',
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts_modal['id'] = $id . '-modal';
}

$atts_modal_close = array(
  'class'               => $classes_modal_close,
  'data-x-toggle-close' => true,
  'aria-label'          => 'Close'
);

$atts_modal_content = array(
  'class' => 'x-modal-content',
  'role'  => 'document'
);


// Output
// ------

?>

<div <?php echo x_atts( $atts_modal ); ?>>

  <span class="x-modal-bg"></span>

  <button <?php echo x_atts( $atts_modal_close ); ?>>
    <span>&times;</span>
  </button>

  <div class="x-modal-content-outer">
    <div class="x-modal-content-inner">
      <div <?php echo x_atts( $atts_modal_content ); ?>>
        <?php echo do_shortcode( $modal_content ); ?>
      </div>
    </div>
  </div>

</div>
