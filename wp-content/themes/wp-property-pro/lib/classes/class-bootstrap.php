<?php
/**
 * PropertyPro Bootstrap
 *
 * @version 0.1.0
 * @author Usability Dynamics
 * @namespace UsabilityDynamics
 */
namespace UsabilityDynamics\PropertyPro {

  use UsabilityDynamics\PropertyPro;

  /**
   * Property Pro Bootstrap
   *
   * @author Usability Dynamics
   */
  final class Bootstrap
  {

    /**
     * Instance.
     *
     * @var $instance
     */
    static private $instance;

    /**
     * Class Initializer
     *
     * @author Usability Dynamics
     * @since 0.1.0
     */
    public function __construct()
    {

      if (!class_exists('\UsabilityDynamics\PropertyPro')) {
        wp_die('<h1>Fatal Error</h1><p>PropertyPro Theme not found.</p>');
      }

      // Instantaite Theme.
      $this->theme = new PropertyPro();

    }

    /**
     * Determine if instance already exists and Return Theme Instance
     *
     */
    public static function get_instance()
    {
      return null === self::$instance ? self::$instance = new self() : self::$instance->theme;
    }

  }

}
