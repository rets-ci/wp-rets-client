<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>
<?php get_template_part('static/views/page-header'); ?>
  <div class="container-fluid upToHeader">

    <div class="row site-content">
      <?php while (have_posts()) : the_post(); ?>
        <?php
        $_permalink = get_the_permalink();
        $_careers_slug = substr($_permalink, -8, 7);

        the_content();
        ?>

      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>


<?php if ($_careers_slug == 'careers') { ?>
  <script type="text/javascript">
    jQuery(document).ready(function () {
      jQuery('body').addClass('<?php echo $_careers_slug; ?>');
    });
  </script>
<?php } ?>


<?php get_footer(); ?>