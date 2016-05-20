<?php
/**
 * The Template for displaying all single posts.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
 */

global $wp_query;
?>

<?php get_header('agent'); ?>

  <section id="site-primary" class="content-area column col-12-12">
    <main id="site-main" class="content-area-main" role="main">

      <section class="agent-hero">
        <div class="background-image"></div>
        <div class="agent-card container">
          <div class="row">
            <div class="col-md-4">
              <img class="img-responsive agent-photo" src="<?php echo class_agents::get_agent_images($wp_query->agent->ID)[0]['src']; ?>" title="<?php echo $wp_query->agent->display_name; ?>" alt="<?php echo $wp_query->agent->display_name; ?>">
            </div>
            <div class="col-md-8">
              <h2 class="agent-name"><?php echo $wp_query->agent->display_name; ?></h2>
              <p class="agent-bio">
                <?php echo get_user_meta( $wp_query->agent->ID, 'widget_bio', 1 ); ?>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="agent-info-line">
        <div class="container">
          <div class="col-md-offset-4 col-md-8 col-sm-4 phone">
            <i class="fa fa-phone"></i>
            <p><?php echo preg_replace( '/(x.+)/', '<b>$1</b>', get_user_meta( $wp_query->agent->ID, 'phone_number', 1 ) ); ?></p>
          </div>
        </div>
      </section>

      <article class="container">
        <div class="entry-inner ">
          <header class="entry-header">
            <h1 class="entry-title"><?php _e('Browse Homes For Rent'); ?></h1>
          </header>

          <div class="entry-content">
            <?php echo do_shortcode('[property_overview columns=3 per_page=9 sort_by=post_title wpp_agents='.get_query_var('agent').']'); ?>
          </div>
        </div>
      </article>

    </main>
  </section>

<?php get_footer(); ?>