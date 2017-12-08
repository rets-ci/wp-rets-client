<?php
/**
 */
?><!DOCTYPE html>
<html>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,400i,700|Playfair+Display:400" />
    <link rel="manifest" href="/wp-content/themes/wp-property-pro/static/scripts/src/manifest.json">
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
    <title><?php wp_title(); ?></title>
  <?php wp_head(); ?>
    <noscript><p class="no-js-header">This site uses Javascript extensively to work. Please enable Javascript on your browser to continue!</p></noscript>
    <!-- Google Analytics -->
    <script type="text/javascript">
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    </script>
  <?php if(defined('WP_PROPERTY_PRO_GOOGLE_ANALYTICS_API_KEY')): ?>
    <script type="text/javascript">
        ga('create', '<?php echo WP_PROPERTY_PRO_GOOGLE_ANALYTICS_API_KEY; ?>', 'auto');
    </script>
  <?php endif; ?>
</head>

<body <?php body_class(); ?>>
