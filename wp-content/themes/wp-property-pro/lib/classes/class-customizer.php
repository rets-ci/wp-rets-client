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
      public function get_asset_data()
      {
        $data = array();
        foreach ((array)$this->get('settings') as $setting) {
          if (is_array($setting['css']) && count($setting['css'])) {
            foreach ($setting['css'] as $rule) {

              if (isset($setting['rule-title']))
                $rule['style'] = $setting['rule-title'];

              if (!empty($rule) && $rule['style'] && $style = $this->generate_css($rule)) {
                $data[$setting['key'] . '-' . $rule['style']] = $style;
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

      /**
       * * Override base method
       * Prepares settings
       *
       * @author fq.jony@UD
       *
       * @param $i
       * @return mixed
       */
      public function prepare_setting($i)
      {

        $i = wp_parse_args($i, [
          'key' => false,
          'label' => false,
          'section' => false,
          'control' => false, // values: 'background-image', 'color', 'background-color', 'border-color', 'image'
          'selector' => false,
          'min_width' => '',
          'max_width' => '',
          'extra_controls' => false
        ]);

        try {

          $sections = $this->get('sections');
          if (!$i['section'] || !key_exists($i['section'], $sections)) {
            throw new \Exception("Name of section {$i[ 'section' ]} is undefined.");
          }

          if (empty($i['key'])) {
            throw new \Exception("Key of setting is undefined.");
          }

          if (empty($i['control'])) {
            throw new \Exception("Control for Setting is undefined.");
          }

          if (empty($i['selector'])) {
            throw new \Exception("Selector is undefined.");
          }

          /** Setup the thing we're looping */
          $to_parse = [$i];
          /** Now see if we have any extra items to parse */
          if (is_array($i['extra_controls']) && count($i['extra_controls'])) {
            $to_add = $i;
            foreach ($i['extra_controls'] as $control => $selector) {
              $to_add['control'] = $control;
              $to_add['selector'] = $selector;
              $to_add['min_width'] = $i['min_width'];
              $to_add['max_width'] = $i['max_width'];
              $to_parse[] = $to_add;
            }
          }

          /** Setup what we're returning */
          $css = [];

          foreach ($to_parse as $i) {
            //** Add CSS rules */
            $media_query = '';
            if (!empty($i['min_width']) || !empty($i['max_width'])) {
              $media_query .= 'only screen and';
              if (!empty($i['min_width'])) {
                $media_query .= ' (min-width: ' . $i['min_width'] . ')';
              }
              if (!empty($i['max_width'])) {
                $media_query .= ' (max-width: ' . $i['max_width'] . ')';
              }
            }

            $rule = [
              'mod_name' => $i['key'],
              'selector' => $i['selector'],
              'style' => false,
              'prefix' => '',
              'postfix' => '',
              'media_query' => $media_query,
              'type' => 'style', // style, image
              'important' => true, // must default to true for backwards compatibility
            ];
            switch ($i['control']) {
              case 'text':
                /** Not sure how to use this yet */
                continue;
                break;
              case 'font':
                $rule['style'] = 'font';
                break;
              case 'font-family':
                $rule['style'] = 'font-family';
                break;
              case 'image':
                $rule['type'] = 'image';
                break;
              case 'background-image':
                $rule['style'] = 'background-image';
                $rule['prefix'] = 'url(';
                $rule['postfix'] = ')';
                break;
              case 'color':
                $rule['style'] = 'color';
                break;
              case 'background-color':
                $rule['style'] = 'background-color';
                break;
              case 'border-color':
                $rule['style'] = 'border-color';
                break;
              default:
                $rule['style'] = $i['control'];
                //** Custom CSS rules must be added using the hook below. */
                $rule = apply_filters("lib-wp-theme::customizer::css::{$i[ 'control' ]}", $rule, $i);
                if (empty($rule['style'])) {
                  throw new \Exception("CSS rules are incorrect. Check control '{$i[ 'control' ]}'");
                }
                break;
            }

            /** Add on the important rule */
            if (isset($i['important'])) {
              $rule['important'] = (bool)$i['important'];
            }
            /** Add it onto the css */
            $css[] = $rule;

            /** Additional rules with additional styles */
            if (isset($i['additional_rules'])) {
              if (is_array($i['additional_rules'])) {
                foreach ($i['additional_rules'] as $add_rule) {
                  if (isset($add_rule['style']) && !empty($add_rule['style'])) {
                    $rule = [
                      'mod_name' => $i['key'],
                      'selector' => isset($add_rule['selector']) ? $add_rule['selector'] : [],
                      'style' => $add_rule['style'],
                      'prefix' => '',
                      'postfix' => '',
                      'media_query' => $media_query,
                      'type' => 'style', // style, image
                      'important' => true // must default to true for backwards compatibility
                    ];
                    /** Add on the important rule */
                    if (isset($i['important'])) {
                      $rule['important'] = (bool)$i['important'];
                    }
                    $css[] = $rule;
                  }
                }
              }
            }
          }

          /** Return it */
          $i['css'] = $css;
          return $i;

        } catch (\Exception $e) {
          $i = false;
          // Filter can be used for logs.
          do_action('lib-wp-theme::customizer::error', 'Customizer Error: ' . $e->getMessage() . " Setting '{$i['label']} ( {$i['key']} )' can not be initialized.");
        }

        return $i;
      }
    }
  }
}