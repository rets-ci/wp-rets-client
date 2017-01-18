<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "site-content" div and all content after.
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */
?>

<?php wp_footer(); ?>
<script type="text/javascript">
  var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
</script>
<script type="text/babel" src="<?php echo get_stylesheet_directory_uri(); ?>/app.jsx"></script>

</body>
</html>

