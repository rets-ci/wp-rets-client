<?php
/**
 * The Template for displaying all single posts.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
 */
?>

<?php get_header(); ?>

  <section id="site-primary" class="content-area column col-12-12">
    <main id="site-main" class="content-area-main" role="main">

      <article>
        <div class="entry-inner">
          <header class="entry-header">
            <h1 class="entry-title"><?php _e('Browse Homes For Rent'); ?></h1>
          </header>

          <div class="entry-content">
            <?php echo do_shortcode('[property_overview columns=3 per_page=9 sort_by=post_title wpp_agents="33"]'); ?>
          </div>
        </div>
      </article>

    </main>
  </section>

<?php get_sidebar(); ?>
<?php get_footer(); ?>