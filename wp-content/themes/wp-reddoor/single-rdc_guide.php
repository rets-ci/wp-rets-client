<?php
/**
 *
 *
 *
 */

$_term = rdc_get_guide_category();
$currentId = get_the_ID();

if(!empty($currentId)) {
  $post_thumbnail_id = get_post_thumbnail_id($currentId);
}
if(!empty($post_thumbnail_id)) {
  $_background_url = wp_get_attachment_image_url($post_thumbnail_id, 'large');
}

?>
<?php get_header(''); ?>
  <div class="container-fluid guide-wrapper">
  <div class="row site-content">

      <div class="col-lg-6 guide-block" style="background-image: url('<?php echo $_background_url; ?>');">
        <div class="guide-block-inner">
          <h1 class="guide-article-title"><?php the_title(); ?></h1>
          <div class="guide-article-description"><?php the_excerpt(); ?></div>
        </div>

        <div class="row guide-actions">
          <div class="col-lg-6 guide-action-button navigation-black">
            <a href="<?php echo $_term->permalink; ?>" class="back-to-guide"><?php printf( __('<- Back to %s ', 'rdc' ), $_term->name ); ?></a>
          </div>
          <div class="col-lg-6 guide-action-button navigation-red">
            <?php next_post_link( '%link', __( 'Go to Next Article ->' ) ); ?>
          </div>
        </div>

      </div>

      <div class="col-lg-6 guide-article-wrapper">
        <article>
        <?php the_content(); ?>
        </article>
      </div>

    </div>

  </div>
  </div>
<?php get_footer('guide'); ?>