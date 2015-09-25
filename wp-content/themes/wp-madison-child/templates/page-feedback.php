<?php
/**
 * Template Name: Page Feedback
 */
?>

<?php get_header(); ?>

<section id="site-primary" class="content-area column col-8-12">
  <main id="site-main" class="content-area-main" role="main">

    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
      <div class="entry-inner">
        <header class="entry-header">
          <h1 class="entry-title"><?php the_title(); ?></h1>
        </header>

        <div class="entry-content">
          <?php get_template_part( 'static/views/rdc-feedback', 'form' ); ?>
        </div>
      </div>
    </article>

  </main>
</section>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
