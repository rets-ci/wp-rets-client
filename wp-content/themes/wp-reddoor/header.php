<?php
/**
 */
?><!DOCTYPE html>
<html>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width">
    <title><?php bloginfo('name'); ?><?php wp_title(); ?></title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <link rel="stylesheet/less" type="text/css" href="<?php bloginfo('stylesheet_directory'); ?>/static/styles/src/style.less"/>
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div class="container">
    <div class="row">
        <header>
            <?php wp_nav_menu(array('menu' => 'Header')); ?>
        </header>
    </div>

