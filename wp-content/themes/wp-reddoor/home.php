<?php
/**
 * The main template file.
 * @package
 * @subpackage Wp-reddoor
 * @since Wp-reddoor 1.0
 */
get_header();

$heroImageUrl = wp_get_attachment_url(get_field('hero_image', 8), 'full');
?>


<div class="container-fluid ftrdImgGoTop">
  <section class="archiveImageHeader" style="background-image: url('<?php echo $heroImageUrl; ?>'); ">
    <h1><?php echo get_post_meta(8, 'rdcPageTitle', 1); ?></h1>
    <h3><?php echo get_post_meta(8, 'rdcPageSubtitle', 1); ?></h3>
    <div class="hero-overlay"></div>
  </section>
</div>

<?php get_template_part('static/views/blog-content') ?>


<?php get_footer(); ?>
