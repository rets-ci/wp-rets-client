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
<?php get_template_part('templates/page-header'); ?>
  <div class="container">
    <div class="row site-content">
      <?php while (have_posts()) : the_post(); ?>
        <?php
        if(is_home) {
          the_content();
        }
        else{
          get_template_part('templates/content-main');
        }
        ?>
      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>

<?php get_footer(); ?>