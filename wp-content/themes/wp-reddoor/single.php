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
$post_thumbnail_id = get_post_thumbnail_id( $currentId );

if(!($post_thumbnail_id)) {
  return;
}
$_url = wp_get_attachment_image_url($post_thumbnail_id, 'large');

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
        <svg class="icon icon-<?php echo $category[0]->slug; ?>"><use xlink:href="#icon-<?php echo $category[0]->slug; ?>"></use></svg>
      </div>
      <h1 class="singleTitle"><?php the_title(); ?></h1>
    </section>
  </div>
<?php } ?>
<div class="container">
  <div class="row">
    <div class="col-lg-3">
      <?php if (!dynamic_sidebar('Single-sidebar')) : ?>
        [ do default stuff if no widgets ]
      <?php endif; ?>
    </div>
    <div class="col-lg-9">
      <article class="content">
        <?php

          the_content();

        endwhile; ?>
      </article>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
      <h3>More Home Buying Articles</h3>
    </div>
    <?php
    $args = array(
      'post_type' => 'post',
      'numberposts' => '40'
    );
    $singleMorePosts = get_posts($args);
    //die( '<pre>' . print_r( $singleMorePosts, true ) . '</pre>' );
    if ( ! empty( $singleMorePosts ) ) {
    foreach( $singleMorePosts as $oneSingleMorePost ) { ?>
        <div class="col-lg-4">
          <div class="oneCategory">
            <?php
            $post_thumbnail_id = get_post_thumbnail_id( $oneSingleMorePost->ID );
            $_url = wp_get_attachment_image_url($post_thumbnail_id, 'medium');
            $allCategories = get_the_category($oneSingleMorePost->ID);
            if(is_array($allCategories)){
              $forCategorySlug = array_shift($allCategories);
            }
            //die( '<pre>' . print_r( $forCategorySlug, true ) . '</pre>' );
            ?>

            <div class="oneCategoryImg">
              <img src="<?php echo $_url ?>" alt="<?php echo $oneSingleMorePost->post_title; ?>" />
            </div>
            <div class="catIconLoop">
                  <?php if(isset($forCategorySlug)){ ?>
                  <svg class="icon icon-<?php echo $forCategorySlug->slug; ?>"><use xlink:href="#icon-<?php echo $forCategorySlug->slug; ?>"></use></svg>
                  <?php } ?>
            </div>
            <a href="<?php echo the_permalink($oneSingleMorePost->ID); ?>"><?php echo $oneSingleMorePost->post_title; ?></a>
          </div>
        </div>

    <?php } }  ?>
  </div>
  </div>
</div>

<?php get_footer(); ?>
