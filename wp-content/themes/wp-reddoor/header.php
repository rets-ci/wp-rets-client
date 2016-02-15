<?php
/**
 */
?><!DOCTYPE html>
<html>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width">
  <title><?php bloginfo('name'); ?><?php wp_title(); ?></title>
  <link rel="stylesheet/less" type="text/css"
        href="<?php echo get_stylesheet_directory_uri(); ?>/static/styles/src/style.less"/>
  <link href='https://fonts.googleapis.com/css?family=Poppins:400,300,500,700' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="https://i.icomoon.io/public/524f31be7a/rdc/style-svg.css">
  <script src="https://i.icomoon.io/public/524f31be7a/rdc/svgxuse.js"></script>
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div class="container">
  <div class="row">
    <header>
      <?php if (get_theme_mod('themeslug_logo')) : ?>
        <div class='site-logo'>
          <a href='<?php echo esc_url(home_url('/')); ?>'
             title='<?php echo esc_attr(get_bloginfo('name', 'display')); ?>' rel='home'><img
              src='<?php echo esc_url(get_theme_mod('themeslug_logo')); ?>'
              alt='<?php echo esc_attr(get_bloginfo('name', 'display')); ?>'></a>
        </div>
      <?php else : ?>
        <hgroup>
          <h1 class='site-title'><a href='<?php echo esc_url(home_url('/')); ?>'
                                    title='<?php echo esc_attr(get_bloginfo('name', 'display')); ?>'
                                    rel='home'><?php bloginfo('name'); ?></a></h1>
          <h2 class='site-description'><?php bloginfo('description'); ?></h2>
        </hgroup>
      <?php endif; ?>
      <?php wp_nav_menu(array('menu' => 'Header')); ?>
      <div class="head-popups">
        <a href="#">Contact</a>
        <a href="#">Login</a>
      </div>
    </header>
  </div>
</div>

