<?php
/**
 * Archive Page for Guide post type
 */

//die( '<pre>' . print_r( rdc_generate_guide_overview(), true ) . '</pre>' );

$_guide_overview = rdc_generate_guide_overview();

//die( '<pre>' . print_r( $_guide_overview , true ) . '</pre>' );
?>
<?php get_header('guide'); ?>
<div class="container-fluid content-wrapper">
  <div class="row site-content">

    <?php foreach( rdc_generate_guide_overview() as $_guide ) { ?>
    <div class="col-lg-6 guide-block" style="background-image: url('<?php echo $_guide['image']; ?>');">
      <h2 class="guide-title"><?php echo $_guide['name']; ?></h2>
      <p class="guide-description"><?php echo $_guide['description']; ?></p>
      <a class="btn btn-rdc btn-lg" href="<?php echo get_category_link( $_guide['term_id'] ); ?>"><?php _e( 'Get Started Now', 'rdc' ) ?></a>
    </div>
    <?php } ?>

  </div>
</div>
<?php get_footer('guide'); ?>