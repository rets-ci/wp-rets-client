<?php
/**
 * The main template file.
 * @package
 * @subpackage Wp-reddoor
 * @since Wp-reddoor 1.0
 */

get_header(); ?>
<?php

//die( '<pre>' . print_r( $post, true ) . '</pre>' );
if( is_home() ) {
  $currentId = get_option( 'page_for_posts' );
}else{
  $currentId = get_the_ID();
}

if(!empty($currentId)) {
  $post_thumbnail_id = get_post_thumbnail_id($currentId);
}
if(!empty($post_thumbnail_id)) {
  $_url = wp_get_attachment_image_url($post_thumbnail_id, 'large');
}
?>
  <?php
  // Start the Loop.
  while ( have_posts() ) : the_post(); $property = prepare_property_for_display( get_the_ID() );

    ?>
<?php if(!(empty($_url))) { ?>
  <div class="container-fluid ftrdImgGoTop">
    <section class="featuredImageHeader" style="background: url('<?php echo $_url; ?>');">
      <?php $category = get_the_category(); ?>
      <div class="singleHeroIcon">
        <span class="icon-rdc-<?php echo $category[0]->slug; ?>"></span>
      </div>
      <h1 class="singleTitle"><?php the_title(); ?></h1>
      <h4 class="singleExcerpt"><?php the_excerpt(); ?></h4>
      <ul class="singleSocialBlock">
        <li><a target="_blank" class="icon-wpproperty-social-facebook-symbol" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_the_permalink()); ?>"></a></li>
        <li><a target="_blank" class="icon-wpproperty-social-twitter-symbol" href="https://twitter.com/home?status=<?php echo urlencode(get_the_title()); ?><?php echo urlencode(' ' . get_the_permalink()); ?>"></a></li>
        <li><a target="_blank" class="icon-wpproperty-social-googleplus-symbol" href="https://plus.google.com/share?url=<?php echo urlencode(get_the_permalink()); ?>"></a></li>
      </ul>
      <div class="hero-overlay"></div>
    </section>
  </div>
<?php } ?>
<div class="container">
  <div class="row">
    <div class="col-lg-4">
      <?php if (!dynamic_sidebar('Single-sidebar')) : ?>
        [ do default stuff if no widgets ]
      <?php endif; ?>
    </div>
    <div class="col-lg-8">
      <article class="content">
        <?php the_content(); endwhile; ?>
        <ul class="singleSocialBlock">
          <li><a target="_blank" class="icon-wpproperty-social-facebook-symbol" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_the_permalink()); ?>"></a></li>
          <li><a target="_blank" class="icon-wpproperty-social-twitter-symbol" href="https://twitter.com/home?status=<?php echo urlencode(get_the_title()); ?><?php echo urlencode(' ' . get_the_permalink()); ?>"></a></li>
          <li><a target="_blank" class="icon-wpproperty-social-googleplus-symbol" href="https://plus.google.com/share?url=<?php echo urlencode(get_the_permalink()); ?>"></a></li>
        </ul>
      </article>
    </div>
  </div>
  <div class="row loadMoreBlockSeparate">
    <div class="col-lg-12">
      <h3><?php $category = get_the_category($post->ID);  _e('More ' . $category[0]->name . ' Articles'); ?></h3>
    </div>

    <?php

    query_posts(array(
      'post_type' => 'post',
      'posts_per_page' => '3',
      'category' => $category[0]->term_id
    ));

    if (have_posts()) : while (have_posts()) : the_post(); ?>
    <div class="col-lg-4" data-element-kind="singleCategoryCard">
      <?php get_template_part('static/views/category-card') ?>
    </div>
    <?php endwhile; endif; ?>


    <?php rewind_posts(); ?>

  </div>

  <div class="row loadMoreContainer">
    <div class="col-lg-4 col-lg-offset-5">
      <button type="button" class="btn btn-lg	btn-rdc" data-kind="singleCategoryCard" data-handler="load-more" data-action="categoryCard" data-category="<?php echo $category[0]->term_id; ?>"><?php _e( 'Load More' ); ?></button>
    </div>
  </div>

</div>

<?php get_footer(); ?>
