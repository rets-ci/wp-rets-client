<?php get_header(); ?>

<div class="container-fluid upToHeader page404">
    <div class="row no-padding">
        <?php
            global $wp_query;

            if($wp_query->is_404){

                query_posts('page_id=5573968');
        if ( have_posts() ) : while ( have_posts() ) : the_post();

            the_content();
         endwhile;
        endif;
                wp_reset_query();

            }

        ?>
    </div>
</div>


<?php get_footer(); ?>

