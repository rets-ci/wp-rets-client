<?php
/**
 * Archive Page for Guide post type
 */

//die( '<pre>' . print_r( rdc_generate_guide_overview(), true ) . '</pre>' );

$_guide_overview = rdc_generate_guide_overview();

//die( '<pre>' . print_r( $_guide_overview , true ) . '</pre>' );
?>
<?php get_header(''); ?>
<div class="container-fluid guide-wrapper">
  <div class="row site-content">

    <?php foreach( rdc_generate_guide_overview() as $_guide ) { ?>
    <div class="col-md-6 guide-block" style="background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url('<?php echo $_guide['image']; ?>'); background-size: cover;">
      <div class="guide-block-inner">
        <h2 class="guide-title"><?php echo $_guide['name']; ?></h2>
        <p class="guide-description"><?php echo $_guide['description']; ?></p>
        <a class="btn btn-rdc btn-lg" href="<?php echo get_category_link( $_guide['term_id'] ); ?>"><?php _e( 'Get Started Now', 'rdc' ) ?></a>
      </div>
    </div>
    <?php } ?>

  </div>
</div>
<?php get_footer('guide'); ?>