<?php
/**
 */
?><!DOCTYPE html>
<html>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width">
    <title><?php wp_title(); ?></title>
  <?php wp_head(); ?>
    <!-- Google Analytics -->
    <script type="text/javascript">
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    </script>
    <script type="text/javascript">
        ga('create', '<?php echo GOOGLE_ANALYTICS_API_KEY; ?>', 'auto');
    </script>
</head>

<body <?php body_class(); ?>>