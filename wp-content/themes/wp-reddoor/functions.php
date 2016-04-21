<?php

require_once get_template_directory() . '/lib/classes/class-utils.php';
require_once get_template_directory() . '/lib/classes/class-bootstrap.php';
require_once get_template_directory() . '/lib/classes/class-widgets.php';
require_once get_template_directory() . '/lib/classes/class-property-hooks.php';
require_once get_template_directory() . '/lib/classes/class-customizer.php';
require_once get_template_directory() . '/lib/classes/class-ajax.php';

## Post Types
require_once get_template_directory() . '/lib/post-types/guide.php';

if(class_exists('SiteOrigin_Widget')) {
  require_once 'lib/widgets/rdc-post-carousel/post-carousel.php';
  require_once 'lib/widgets/rdc-hero/hero.php';
}


add_action( 'admin_enqueue_scripts', function () {
  wp_enqueue_style( 'rdc-admin', get_template_directory_uri() . '/static/styles/admin/style.css', false, '1.0.0' );
} );

new \UsabilityDynamics\RDC\Bootstrap();