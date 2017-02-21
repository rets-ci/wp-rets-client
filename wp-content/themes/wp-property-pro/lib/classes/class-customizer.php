<?php

/**
 * Contains methods for customizing the theme customization screen.
 *
 * @link http://codex.wordpress.org/Theme_Customization_API
 * @since 0.1.0
 * author fq.jony@UD
 */
namespace UsabilityDynamics\PropertyPro {

  use WP_Customize_Manager;

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

        return $this;
      }

      /**
       * Override base method
       * Try to register setting, its section and control.
       *
       * @param WP_Customize_Manager $wp_customize
       * @param array $i
       *
       * @author fq.jony@UD
       */
      public function register_instance($wp_customize, $i)
      {
        //** Add Section if it has not been added yet. */
        $sections = $this->get('sections');
        if (!$wp_customize->get_section($i['section'])) {
          $section = wp_parse_args($sections[$i['section']], [
            'title' => __('No Name'),
            'priority' => 100,
          ]);
          $wp_customize->add_section($i['section'], $section);
        }

        $settings_args = [
          'capability' => 'edit_theme_options',
          'transport' => 'postMessage',
        ];

        if (isset($i['default']))
          $settings_args['default'] = $i['default'];

        //** Add Setting */
        $wp_customize->add_setting($i['key'], $settings_args);

        //** Add Control */
        $control_args = [
          'label' => (!empty($i['label']) ? $i['label'] : $i['key']),
          'section' => $i['section'],
          'settings' => $i['key'],
          'priority' => (!empty($i['priority']) ? $i['priority'] : 999),
        ];
        switch ($i['control']) {
          case 'text':
          case 'font':
          case 'font-family':
            $wp_customize->add_control(new \WP_Customize_Control($wp_customize, $i['key'], $control_args));
            break;
          case 'image':
          case 'background-image':
            $wp_customize->add_control(new \WP_Customize_Image_Control($wp_customize, $i['key'], $control_args));
            break;
          case 'color':
          case 'background-color':
          case 'border-color':
            $wp_customize->add_control(new \WP_Customize_Color_Control($wp_customize, $i['key'], $control_args));
            break;
          case 'menus_select':
            $i['choices'] = [
              'Make a choice'
            ];

            foreach (get_terms('nav_menu', array('hide_empty' => true)) as $menu)
              $i['choices'][$menu->term_id] = $menu->name;

            $i['control'] = 'select';
          case 'select':
            $control_args = array_merge($control_args, [
              'choices' => $i['choices'],
              'type' => $i['control']
            ]);
            $wp_customize->add_control($i['key'], $control_args);
            break;
          default:
            //** Custom Control must be added using the hook below. */
            if (has_action("lib-wp-theme::customizer::control::{$i[ 'control' ]}")) {
              do_action("lib-wp-theme::customizer::control::{$i[ 'control' ]}", $i);
            } else {
              $wp_customize->add_control(new \WP_Customize_Control($wp_customize, $i['key'], $control_args));
            }
            break;
        }

      }

      /**
       * Override base method
       * Dynamic Rules
       *
       * @param array $rules
       *
       * @author fq.jony@UD
       *
       * @return array
       */
      public function update_option_rewrite_rules($rules)
      {

        if ($rules)
          $rules = ['^' . $this->get('permalink') => 'index.php?' . $this->query_vars[0] . '=1'] + $rules;

        return $rules;
      }

      /**
       * * Override base method
       * Return styles
       *
       * @author fq.jony@UD
       *
       * @return array
       */
      public function get_asset_data() {
        $data = array();
        foreach( (array)$this->get( 'settings' ) as $setting ) {
          if( is_array( $setting[ 'css' ] ) && count( $setting[ 'css' ] ) ){
            foreach( $setting[ 'css' ] as $rule ){

              if(isset($setting['rule-title']))
                $rule['style'] = $setting['rule-title'];

              if( !empty( $rule ) && $rule[ 'style' ] && $style = $this->generate_css( $rule ) ) {
                $data[ $setting[ 'key' ] . '-' . $rule[ 'style' ] ] = $style;
              }
            }
          }
        }
        return $data;
      }

      /**
       * Get default Settings from schema
       *
       */
      public function _get_system_settings()
      {
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