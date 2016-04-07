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

get_header();

while (have_posts()) : the_post(); ?>

  <div class="container-fluid">
    <div class="row">
      <section class="frontPageSearchBlock" <?php if(has_post_thumbnail()){ ?> style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>')" <?php } ?>>
        <h1><?php echo get_post_meta(get_the_ID(), 'home_title', 1); ?></h1>
        <h4><?php echo get_post_meta(get_the_ID(), 'home_subtitle', 1); ?></h4>
        <?php get_template_part('static/views/search-form'); ?>
      </section>
    </div>
  </div>

  <div class="container">
    <div class="row site-content">




        <?php  the_content(); ?>

      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>

<?php get_footer(); ?>