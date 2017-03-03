<?php
/**
 *
 *
 */
global $wp_properties;

$_terms = array(
  "property-overview" => get_term_by( 'slug', 'property-overview', 'wpp_layout_type' ),
  "term-overview" => get_term_by( 'slug', 'term-overview', 'wpp_layout_type' ),
  "single-property" => get_term_by( 'slug', 'single-property', 'wpp_layout_type' ),
  "layout-api" => get_term_by( 'slug', 'layout-api', 'wpp_layout_api' ),
);

if( !isset( $post ) ) {
  return;
}


$properties = get_posts( array(
  'post_type' => 'property',
  'orderby' => 'date',
  'order' => 'desc',
  'post_status' => 'publish',
  'per_page' => 1
) );

$property_id = $properties[ 0 ]->ID;

$_preview_layout_id = get_post_meta( $post, 'wpp_preview_layout_id', true );

if( !$_preview_layout_id ) {
  $_preview_layout_id = $post->ID;
}

if( has_term( 'single-property', 'wpp_layout_type', $post->ID ) ) {
  $property_url = get_permalink( $property_id );
} else if( has_term( 'property-overview', 'wpp_layout_type', $post->ID ) ) {
  $property_url = home_url( $wp_properties[ 'configuration' ][ 'base_slug' ] );
} else {
  $property_url = home_url();
}


?>

<div class="misc-publishing-actions">

  <div class="misc-pub-section">
    <input value="" type="hidden" name="tax_input[wpp_layout_type][]" />

    <label class="selectit">
      <input data-type="property-overview" value="<?php echo $_terms['property-overview']->term_id; ?>" type="radio" name="tax_input[wpp_layout_type][]" <?php checked( has_term( $_terms['property-overview']->term_id, 'wpp_layout_type', $post ) ); ?>>Results Page
    </label>

    </div>
    <div class="misc-pub-section">

    <label class="selectit">
      <input data-type="term-overview" value="<?php echo $_terms['term-overview']->term_id; ?>" type="radio" name="tax_input[wpp_layout_type][]" <?php checked( has_term( $_terms['term-overview']->term_id, 'wpp_layout_type', $post ) ); ?>>Landing Page
    </label>

    </div>
    <div class="misc-pub-section">

    <label class="selectit">
      <input data-type="single-property" value="<?php echo $_terms['single-property']->term_id; ?>" type="radio" name="tax_input[wpp_layout_type][]" <?php checked( has_term( $_terms['single-property']->term_id, 'wpp_layout_type', $post ) ); ?>>Property Page
    </label>

  </div>

  <?php if( isset( $capabilities ) && $capabilities->can_publish == 'true' ) { ?>
    <input value="" type="hidden" name="tax_input[wpp_layout_api][]" />

  <label class="selectit">
    <input value="<?php echo $_terms['layout-api']->term_id; ?>" type="checkbox" readonly="readonly" name="tax_input[wpp_layout_api][]" <?php checked( has_term( $_terms['layout-api']->term_id, 'wpp_layout_type', $post ) ); ?>>Published To API
  </label>

  <?php } ?>

</div>

<div id="major-publishing-actions">

  <div id="publishing-action">
    <a class="preview button" href="<?php echo $property_url . '?wpp_preview_layout_id=' . $_preview_layout_id; ?>" target="wpp-layout-preview-<?php echo $_preview_layout_id; ?>">Preview Layout</a>
  </div>

  <?php if( isset( $property_url ) ) { ?>
  <?php } ?>

  <div class="clear"></div>
</div>

