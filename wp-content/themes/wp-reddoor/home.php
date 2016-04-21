<?php
/**
 * Root blog page template
 *
 * @package
 * @subpackage WP-Reddoor
 * @since Wp-reddoor 1.0
 */


// Detect which post/page is used as the "page for posts" to get its meta later. - potanin@UD
$_page_for_posts = get_option('page_for_posts');

get_header();

?>
<div class="container-fluid ftrdImgGoTop">
  <section class="archiveImageHeader" style="<?php if( has_post_thumbnail( $_page_for_posts ) ) { ?>background-image: url('<?php echo get_the_post_thumbnail_url( $_page_for_posts, 'full' ); ?>'); "<?php } ?>>
    <h1><?php echo $_page_for_posts ? get_post_meta($_page_for_posts , 'rdcPageTitle', 1) : ''; ?></h1>
    <h3><?php echo $_page_for_posts ? get_post_meta($_page_for_posts , 'rdcPageSubtitle', 1) : ''; ?></h3>
    <div class="hero-overlay"></div>
  </section>
</div>

<?php get_template_part('static/views/blog-content') ?>

<?php get_footer(); ?>
