<?php

require_once get_template_directory() . '/lib/classes/class-bootstrap.php';
require_once get_template_directory() . '/lib/classes/class-widgets.php';
require_once get_template_directory() . '/lib/classes/class-property-hooks.php';
require_once get_template_directory() . '/lib/classes/class-customizer.php';
require_once get_template_directory() . '/lib/classes/class-ajax.php';

if(class_exists('SiteOrigin_Widget')) {
  require_once 'lib/widgets/rdc-post-carousel/post-carousel.php';
  require_once 'lib/widgets/rdc-hero/hero.php';
}

if(class_exists('WP_Widget')) {
  require_once 'lib/widgets/gc-widget/guide-content.php';
  require_once 'lib/widgets/rdc-callout-widget/callout.php';
}

new \UsabilityDynamics\RDC\Bootstrap();