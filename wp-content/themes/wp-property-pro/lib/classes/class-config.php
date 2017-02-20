<?php
/**
 * PropertyPro Config
 *
 * @version 0.1.0
 * @author Usability Dynamics
 * @namespace UsabilityDynamics
 */
namespace UsabilityDynamics\PropertyPro {

  /**
   * Property Pro Config
   *
   * @author Usability Dynamics
   */
  class Config
  {

    /**
     * @var array
     */
    public $_settings = [];

    /**
     * The constants that should be dynamically generated
     */
    protected $protectedConstants = array(
      'WP_ALLOW_MULTISITE'
    );

    /**
     * @var null
     */
    public $composer_file = null;

    /**
     * @var null
     */
    public $baseDir = null;

    /**
     * @var array
     */
    private $appliedConstants = array();

    /**
     * @var array
     */
    private $serverParameters = array();

    public function __construct()
    {

      if (is_file(get_template_directory() . '/composer.json')) {
        $this->composer_file = get_template_directory() . '/composer.json';
      }

      // Get settings
      $this->_settings = Config::parseComposer($this->composer_file);

      // Flatted nested object/aray
      $this->_settings = Config::flatten($this->_settings);

      // Fix value types.
      $this->_settings = Config::normalize($this->_settings);

      // Replace dynamic patterns
      $this->_settings = Config::replacePatterns($this->_settings, $_SERVER);

      // Fix value types.
      $this->_settings = Config::normalize($this->_settings, true);

      // Apply branch-specific composer.json configuration.
      $this->_settings = Config::apply_branch_settings($this->_settings, $this);

      // Handle Database.
      $this->parseDatabase();

      // Intersect existing settings with settings passed with server.
      $this->addServerParameters();

      // Apply consants and save them to object for debugging
      $this->applyConstants();

      // Set global variables.
      $this->applyGlobals();

      return $this;
    }

    /**
     * Parse comoser.json file for settings and extra.settings
     *
     * @param null $composer_file
     * @param string $holder_name
     * @method parseComposer
     *
     * @return array
     */
    public function parseComposer($composer_file = null, $holder_name = 'settings')
    {

      try {

        $_settings = array();

        $_composer = file_get_contents($composer_file);
        $_composer = json_decode($_composer, false, 512);

      } catch (\Exception $error) {
        // Most likely can't parse JSON file... Silently fail.
        return isset($_settings) ? $_settings : null;
      }

      if (isset($_composer->$holder_name) && is_object($_composer->$holder_name)) {
        foreach ((array)$_composer->$holder_name as $key => $value) {
          $_settings[$key] = (array)$value;
        }
      }

      if (isset($_composer->extra) && isset($_composer->extra->$holder_name) && is_object($_composer->extra->$holder_name)) {
        foreach ((array)$_composer->extra->$holder_name as $key => $value) {

          if (isset($_settings[$key])) {
            $_settings[$key] = array_merge($_settings[$key], $value);
          } else {
            $_settings[$key] = $value;
          }

        }

      }

      return (array)$_settings;

    }

    /**
     * @param array $array
     * @param string $prefix
     * @param string $seperator
     *
     * @return array
     */
    public function flatten($array = [], $prefix = '', $seperator = '_')
    {
      $result = [];

      foreach ($array as $key => $value) {

        if (is_array($value) || is_object($value)) {
          $result = $result + self::flatten($value, $prefix . $key . $seperator, $seperator);
        } else {
          $result[$prefix . $key] = $value;
        }
      }

      return $result;

    }

    /**
     * @param array $array
     *
     * @param bool $upper_key_case
     *
     * @return array
     */
    public function normalize($array = [], $upper_key_case = false)
    {

      foreach ((array)$array as $key => $value) {

        if ($value === 'false') {
          $array[$key] = false;
        }

        if ($value === 'true') {
          $array[$key] = true;
        }

        if ($value == '1') {
          $array[$key] = true;
        }

        if (is_int($value)) {
          $array[$key] = intval($value);
        }

      }

      // Remove blanks.
      $array = array_filter($array, create_function('$a', 'return $a!=="";'));

      // Set array key case
      $array = array_change_key_case($array, $upper_key_case);

      // Sort alphabetically.
      ksort($array);

      return $array;

    }

    /**
     * Perform multiple pattern match searches.
     *
     * @param array $_settings
     *
     * @param array $extraPatterns
     * @return array
     */
    public function replacePatterns($_settings = [], $extraPatterns = [])
    {

      $_found_pattern = false;
      $_patternMap = array_merge((array)$_settings, array_change_key_case($extraPatterns, false));

      foreach ((array)$_settings as $key => $value) {

        if (preg_match_all('/{([a-zA-Z\_\-]*?)}/ie', $value, $matches)) {
          $_found_pattern = true;
          $_settings[$key] = preg_replace('/{([a-zA-Z\_\-]*?)}/ie', '$_patternMap["$1"]', $value);
        }

      }

      if ($_found_pattern) {
        $_settings = self::replacePatterns($_settings);
      }

      return $_settings;

    }

    /**
     * Allow composer.json to include branch-specific settings, e.g. settings_staging
     *
     * Ported out of DDP.
     *
     * @param $settings
     * @param $instance
     *
     * @return array|mixed
     * @internal param $array
     *
     */
    public function apply_branch_settings($settings, $instance)
    {

      if (defined('WP_CLI') && isset($_SERVER['GIT_BRANCH']) && $_SERVER['GIT_BRANCH']) {
        $_branch = strtolower($_SERVER['GIT_BRANCH']);
      }

      // Get branch specific settings (they can override general settings)
      if (!isset($_branch) || !$_branch && (isset($_SERVER['HTTP_X_SELECTED_BRANCH']) && $_SERVER['HTTP_X_SELECTED_BRANCH'])) {
        $_branch = strtolower($_SERVER['HTTP_X_SELECTED_BRANCH']);
      }

      if (!isset($_branch) || !$_branch) {
        return $settings;
      }

      // Try to load branch-specific settings.
      $env_settings = Config::parseComposer($instance->composer_file, 'settings_' . $_branch);

      if ($env_settings) {
        $env_settings = Config::flatten($env_settings);
        $env_settings = Config::normalize($env_settings);
        $env_settings = Config::replacePatterns($env_settings, $_SERVER);
        $env_settings = Config::normalize($env_settings, true);
        $settings = array_merge($settings, $env_settings);
      }

      return $settings;

    }

    /**
     *
     */
    private function parseDatabase()
    {

      // Single database, do nothing.
      if (isset($this->_settings['DB_HOST']) && $this->_settings['DB_HOST']) {
        return;
      }

      // Multiple databases.
      if (isset( $this->_settings['DB_0_HOST'] ) && $this->_settings['DB_0_HOST']) {

        foreach (Config::find_by_prefix($this->_settings, 'DB_0') as $_key => $_value) {

          $this->_settings[str_replace('_0', '', $_key)] = $_value;
          unset($this->_settings[$_key]);
        }

      }

    }

    /**
     * @param $arr_main_array
     * @param string $prefix
     *
     * @return array
     */
    public function find_by_prefix($arr_main_array, $prefix = '')
    {

      $arr_result = [];
      foreach ($arr_main_array as $key => $value) {
        //$exp_key = explode('_', $key);
        if (strpos($key, $prefix) === 0) {
          $arr_result[$key] = $value;
        }
      }

      return $arr_result;
    }

    /**
     * Add Server Parameters
     *
     * @return $this
     */
    private function addServerParameters()
    {

      // Create an array of existing settings as well as accepted settings that may be set via $_SERVER even if not set in comoser.json
      $_acceptedKeys = array_merge($this->_settings, [
        'WP_DEBUG' => null,
        'WP_SITEURL' => null,
        'WP_HOME' => null,
        'WP_DEBUG_LOG' => null,
        'WP_DEBUG_DISPLAY' => null,
        'WP_STATELESS_MEDIA_MODE' => null,
        'DB_HOST' => null,
        'DB_USER' => null,
        'DB_NAME' => null,
        'DB_PASSWORD' => null,
        'DB_PREFIX' => null,
        'WP_CACHE' => null,
        'WP_ELASTIC_SERVERS' => null,
        'WP_ELASTIC_INDEX' => null,
      ]);

      // Extract valid server parameters that match available keys
      $this->serverParameters = array_intersect_key(Config::normalize($_SERVER, true), $_acceptedKeys);

      // Override extracted server parameters into settings
      $this->_settings = array_merge($this->_settings, $this->serverParameters);

      return $this;

    }

    /**
     * Loop through them, declaring them if they don't already previously exist
     *
     * @param $_settings
     *
     * @return array
     */
    private function applyConstants($_settings = null)
    {

      // Save original consants.
      $_originalConstants = get_defined_constants();

      $_settings = isset($_settings) ? $_settings : $this->_settings;
      foreach ((array)$_settings as $key => $value) {

        /** Ensure protected constants are not defined before the configs */
        if (in_array($key, $this->protectedConstants)) {
          continue;
        }

        if (!defined($key)) {
          define($key, $value);
        }

      }

      return $this->appliedConstants = array_diff_assoc(get_defined_constants(), $_originalConstants);

    }

    /**
     * @internal param array $_settings
     */
    private function applyGlobals()
    {
      global $table_prefix;

      /** Is this needed? */
      if (!isset($table_prefix) || !$table_prefix) {
        $table_prefix = defined('DB_PREFIX') && DB_PREFIX ? DB_PREFIX : 'wp_';
      }

    }
  }
}
