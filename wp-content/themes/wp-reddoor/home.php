<?php
/**
 * Root blog page template
 *
 * @package
 * @subpackage WP-Reddoor
 * @since Wp-reddoor 1.0
 */

get_header();

?>

<?php get_template_part('static/views/masthead') ?>

<?php get_template_part('static/views/blog-content') ?>

<?php get_footer(); ?>
