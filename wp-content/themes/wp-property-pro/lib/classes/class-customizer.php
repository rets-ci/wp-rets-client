<?php

/**
 * Contains methods for customizing the theme customization screen.
 *
 * @link http://codex.wordpress.org/Theme_Customization_API
 * @since 0.1.0
 * author fq.jony@UD
 */
namespace UsabilityDynamics\PropertyPro {

  if (!class_exists('\UsabilityDynamics\PropertyPro\Customizer')) {

    /**
     * Class Customizer
     * @package UsabilityDynamics\PropertPro
     */
    class Customizer extends \UsabilityDynamics\Theme\Customizer
    {
      const CUSOMIZER_SCHEMA_PATH = '/static/schemas/schema.customizer.json';

      /**
       * Customizer constructor.
       */
      public function __construct()
      {

        $customizer_schema = $this->_get_system_settings();
        parent::__construct($customizer_schema);
      }

      /**
       * Get default Settings from schema
       *
       */
      public function _get_system_settings() {
        $short_path = self::CUSOMIZER_SCHEMA_PATH;
        $file = get_stylesheet_directory() . $short_path;
        if (!file_exists($file)) {
          $file = get_template_directory() . $short_path;
        }
        if (!file_exists($file)) {
          return false;
        }
        return json_decode(file_get_contents($file), true);
      }
    }
  }
}