<?php
/**
 * The main template file.
 * @package
 * @subpackage Wp-reddoor
 * @since Wp-reddoor 1.0
 */
get_header(); ?>

<script type="text/javascript">
  jQuery(document).ready(function(){
    jQuery('.featuredImageHeader').css('height', jQuery(window).height()-132);
  });
</script>
<div class="container-fluid ftrdImgGoTop">
  <section class="archiveImageHeader">
    <h1><?php _e('Our Articles'); ?></h1>
    <h3></h3>
  </section>
</div>

<?php get_template_part('static/views/blog-content') ?>


<?php get_footer(); ?>
