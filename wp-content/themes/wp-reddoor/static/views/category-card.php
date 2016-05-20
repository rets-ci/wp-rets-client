<?php
/**
 *
 *
 *
 */
?>

<div class="oneCategory" data-template="static/views/category-card" data-post-id="<?php echo $post->ID; ?>">
<?php
    $post_thumbnail_id = get_post_thumbnail_id( $post->ID );
    $_url = wp_get_attachment_image_url( $post_thumbnail_id, 'medium' );
    $allCategories = get_the_category( $post->ID );
    if( is_array( $allCategories ) ) {
      $forCategorySlug = array_shift( $allCategories );
    }
    //die( '<pre>' . print_r( $forCategorySlug, true ) . '</pre>' );
    ?>

  <div class="oneCategoryImg">
    <a href="<?php the_permalink( $post->ID ); ?>"><img src="<?php echo $_url ?>" alt="<?php echo $post->post_title; ?>" class="category-image"/></a>
  </div>
  <div class="catIconLoop">
    <?php if( isset( $forCategorySlug ) ) { ?>
      <span class="icon icon-rdc-<?php echo $forCategorySlug->slug; ?>"></span>
    <?php } ?>
  </div>
  <a href="<?php the_permalink( $post->ID ); ?>" class="oneCategoryTitle"><?php echo $post->post_title; ?></a>

</div>

