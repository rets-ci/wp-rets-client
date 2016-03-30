<?php
/**
 */
?><!DOCTYPE html>
<html>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width">
  <title><?php bloginfo('name'); ?><?php wp_title(); ?></title>
  <link href='https://fonts.googleapis.com/css?family=Poppins:400,300,500,700' rel='stylesheet' type='text/css'>
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div class="container-fluid headerTopMenu">
  <div id="header" class="container">
    <div class="row">
      <header>
        <span class="toggle"><svg class="icon icon-list"><use xlink:href="#icon-list"></use></svg></span>
        <?php if (get_theme_mod('rdc_logo')) : ?>
          <div class='site-logo'>
            <a href='<?php echo esc_url(home_url('/')); ?>'
               title='<?php echo esc_attr(get_bloginfo('name', 'display')); ?>' rel='home'><img
                src='<?php echo esc_url(get_theme_mod('rdc_logo')); ?>'
                alt='<?php echo esc_attr(get_bloginfo('name', 'display')); ?>'></a>
          </div>
        <?php else : ?>
            <div class='site-logo'>
              <a href='<?php echo esc_url(home_url('/')); ?>' title='<?php echo esc_attr(get_bloginfo('name', 'display')); ?>' rel='home'><?php bloginfo('name'); ?></a>
            </div>
        <?php endif; ?>
        <div class="head-popups">
          <?php wp_nav_menu(array('menu' => 'RightSide Menu', 'menu_class' => 'contactMenu')); ?>
        </div>
      </header>
    </div>
  </div>
</div>

