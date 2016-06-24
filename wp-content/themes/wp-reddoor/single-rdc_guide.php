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

// check if there is a next post link
$have_next_post_link = get_next_post_link() ? true : false;

$_permalink = get_the_permalink();
$_guide_slug = explode('/', $_permalink);


?>
<?php get_header(''); ?>
  <div class="container-fluid guide-wrapper">
  <div class="row site-content">

      <div class="col-md-6 guide-block" style="background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url('<?php echo $_background_url; ?>'); background-size: cover;">
        <div class="guide-block-inner">
          <h1 class="guide-article-title"><?php the_title(); ?></h1>
          <div class="guide-article-description hidden-xs hidden-sm"><?php the_excerpt(); ?></div>
        </div>

        <div class="row guide-actions">

          <?php if( get_next_post_link() ) { ?>
          <div class="col-md-6 guide-action-button navigation-black">
            <a href="<?php echo $_term->permalink; ?>" class="back-to-guide"><?php printf( __('<- Back to %s ', 'rdc' ), $_term->name ); ?></a>
          </div>
          <div class="col-md-6 guide-action-button navigation-red">
            <?php next_post_link( '%link', __( 'Go to Next Article ->' ) ); ?>
          </div>
          <?php } else { ?>
          <div class="col-md-12 guide-action-button navigation-black">
            <a href="<?php echo $_term->permalink; ?>" class="back-to-guide"><?php printf( __('<- Back to %s ', 'rdc' ), $_term->name ); ?></a>
          </div>
          <?php } ?>

        </div>

      </div>

      <div class="col-md-6 guide-article-wrapper">
        <div class="guide-article-container">
          <article>
          <?php the_content(); ?>
          </article>
          <?php dynamic_sidebar('guide-article-footer'); ?>
        </div>

      </div>

    </div>

  </div>
  </div>
  <!--  @kavaribes -->
<?php if ($_guide_slug[4] == 'landlord'){ ?>
  <script type="text/javascript">
    jQuery(document).ready(function(){
      jQuery('.managementItem').addClass('current-menu-item');
    });
  </script>
<?php } elseif($_guide_slug[4] == 'home-sellers'){  ?>
  <script type="text/javascript">
    jQuery(document).ready(function(){
      jQuery('.sellItem').addClass('current-menu-item');
    });
  </script>
<?php } elseif($_guide_slug[4] == 'home-renters'){  ?>
  <script type="text/javascript">
    jQuery(document).ready(function(){
      jQuery('.rentBtnForm').addClass('current-menu-item');
    });
  </script>
<?php } elseif($_guide_slug[4] == 'home-buyers'){  ?>
  <script type="text/javascript">
    jQuery(document).ready(function(){
      jQuery('.buyBtnForm').addClass('current-menu-item');
    });
  </script>
<?php }   ?>
  <!-- -->
<?php get_footer('guide'); ?>