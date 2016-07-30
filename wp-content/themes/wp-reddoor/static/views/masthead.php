<?php

/* For single pages */

if(is_single()){

if( is_home() ) {
    $currentId = get_option( 'page_for_posts' );
}else{
    $currentId = get_the_ID();
}

if(!empty($currentId)) {
    $post_thumbnail_id = get_post_thumbnail_id($currentId);
}
if(!empty($post_thumbnail_id)) {
    $_url = wp_get_attachment_image_url($post_thumbnail_id, 'large');
}

 if(!(empty($_url))) { ?>
    <div class="container-fluid ftrdImgGoTop">
        <section class="featuredImageHeader" style="background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url('<?php echo $_url; ?>');">
            <?php $category = get_the_category(); ?>
            <div class="singleHeroIcon">
                <span class="icon-rdc-<?php echo $category && $category[0] ? $category[0]->slug : ''; ?>"></span>
            </div>
            <h1 class="singleTitle"><?php the_title(); ?></h1>
            <h4 class="singleExcerpt hidden-xs">
                <?php

                $_single_excerpt = get_the_excerpt();
                $tags = array("<p>", "</p>");
                $_single_excerpt = str_replace($tags, '', $_single_excerpt);
                echo $_single_excerpt;

                ?>
            </h4>
            <?php echo do_shortcode( '[share_this_article]' ); ?>

        </section>
    </div>
<?php } }

    /* For category pages */

    elseif(is_category() || is_archive()){
?>
        <div class="container-fluid ftrdImgGoTop">
            <section class="archiveImageHeader" style="background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url(<?php echo UsabilityDynamics\RDC\Utils::get_a_post_image_for_archive(); ?>); opacity: 1;">
                <h1><?php single_cat_title(); ?></h1>
                <h3><?php echo category_description(); ?></h3>
            </section>
        </div>

<?php }

    /* For blog page */

    elseif(is_home()){
        // Detect which post/page is used as the "page for posts" to get its meta later. - potanin@UD
        $_page_for_posts = get_option('page_for_posts');
    ?>
        <div class="container-fluid ftrdImgGoTop">
            <section class="archiveImageHeader" style="<?php if( has_post_thumbnail( $_page_for_posts ) ) { ?>background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url('<?php echo get_the_post_thumbnail_url( $_page_for_posts, 'full' ); ?>'); "<?php } ?>>
                <h1><?php echo $_page_for_posts ? get_post_meta($_page_for_posts , 'rdcPageTitle', 1) : ''; ?></h1>
                <h3><?php echo $_page_for_posts ? get_post_meta($_page_for_posts , 'rdcPageSubtitle', 1) : ''; ?></h3>
                <div class="hero-overlay"></div>
            </section>
        </div>

    <?php
        }
    ?>