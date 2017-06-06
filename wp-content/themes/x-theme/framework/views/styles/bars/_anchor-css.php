<?php

// =============================================================================
// _ANCHOR-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Setup
//   02. Base
//   03. Text
//   04. Graphic
//   05. Sub Indicator
//   06. Particles
// =============================================================================

// Setup
// =============================================================================

$anchor_selector = ( isset( $anchor_selector ) && $anchor_selector != '' ) ? $anchor_selector    : '.x-anchor';
$anchor_k_pre    = ( isset( $anchor_k_pre ) && $anchor_k_pre != ''       ) ? $anchor_k_pre . '_' : '';



// Base
// =============================================================================

?>

.$_el<?php echo $anchor_selector; ?> {
  @if $<?php echo $anchor_k_pre; ?>anchor_width !== 'auto' {
    width: $<?php echo $anchor_k_pre; ?>anchor_width;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_min_width?? {
    min-width: $<?php echo $anchor_k_pre; ?>anchor_min_width;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_max_width?? {
    max-width: $<?php echo $anchor_k_pre; ?>anchor_max_width;
  }
  @if $<?php echo $anchor_k_pre; ?>anchor_height !== 'auto' {
    height: $<?php echo $anchor_k_pre; ?>anchor_height;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_min_height?? {
    min-height: $<?php echo $anchor_k_pre; ?>anchor_min_height;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_max_height?? {
    max-height: $<?php echo $anchor_k_pre; ?>anchor_max_height;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_margin?? {
    margin: $<?php echo $anchor_k_pre; ?>anchor_margin;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_border_width?? || $<?php echo $anchor_k_pre; ?>anchor_border_style?? {
    border-width: $<?php echo $anchor_k_pre; ?>anchor_border_width;
    border-style: $<?php echo $anchor_k_pre; ?>anchor_border_style;
    border-color: $<?php echo $anchor_k_pre; ?>anchor_border_color;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_border_radius?? {
    border-radius: $<?php echo $anchor_k_pre; ?>anchor_border_radius;
  }
  font-size: $<?php echo $anchor_k_pre; ?>anchor_base_font_size;
  background-color: $<?php echo $anchor_k_pre; ?>anchor_bg_color;
  @unless $<?php echo $anchor_k_pre; ?>anchor_box_shadow_dimensions?? {
    @if $<?php echo $anchor_k_pre; ?>anchor_box_shadow_color === 'transparent' {
      box-shadow: none;
    }
    @if $<?php echo $anchor_k_pre; ?>anchor_box_shadow_color !== 'transparent' {
      box-shadow: $<?php echo $anchor_k_pre; ?>anchor_box_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_box_shadow_color;
    }
  }
}


.$_el<?php echo $anchor_selector; ?> .x-anchor-content {
  -webkit-flex-direction: $<?php echo $anchor_k_pre; ?>anchor_flex_direction;
          flex-direction: $<?php echo $anchor_k_pre; ?>anchor_flex_direction;
  -webkit-justify-content: $<?php echo $anchor_k_pre; ?>anchor_flex_justify;
          justify-content: $<?php echo $anchor_k_pre; ?>anchor_flex_justify;
  -webkit-align-items: $<?php echo $anchor_k_pre; ?>anchor_flex_align;
          align-items: $<?php echo $anchor_k_pre; ?>anchor_flex_align;
  @if $anchor_flex_wrap === true {
    -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
    -webkit-align-content: $<?php echo $anchor_k_pre; ?>anchor_flex_align;
            align-content: $<?php echo $anchor_k_pre; ?>anchor_flex_align;
  }
  @unless $<?php echo $anchor_k_pre; ?>anchor_padding?? {
    padding: $<?php echo $anchor_k_pre; ?>anchor_padding;
  }
}


.$_el<?php echo $anchor_selector; ?>[class*="active"] {
  @unless $<?php echo $anchor_k_pre; ?>anchor_border_width?? || $<?php echo $anchor_k_pre; ?>anchor_border_style?? {
    border-color: $<?php echo $anchor_k_pre; ?>anchor_border_color_alt;
  }
  background-color: $<?php echo $anchor_k_pre; ?>anchor_bg_color_alt;
  @unless $<?php echo $anchor_k_pre; ?>anchor_box_shadow_dimensions?? {
    @if $<?php echo $anchor_k_pre; ?>anchor_box_shadow_color_alt === 'transparent' {
      box-shadow: none;
    }
    @if $<?php echo $anchor_k_pre; ?>anchor_box_shadow_color_alt !== 'transparent' {
      box-shadow: $<?php echo $anchor_k_pre; ?>anchor_box_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_box_shadow_color_alt;
    }
  }
}



<?php

// Text
// =============================================================================

?>

@unless $<?php echo $anchor_k_pre; ?>anchor_text === false {

  .$_el<?php echo $anchor_selector; ?> .x-anchor-text {
    @unless $<?php echo $anchor_k_pre; ?>anchor_text_margin?? {
      margin: $<?php echo $anchor_k_pre; ?>anchor_text_margin;
    }
  }

  @if $<?php echo $anchor_k_pre; ?>anchor_text_overflow === true {
    .$_el<?php echo $anchor_selector; ?> .x-anchor-text-primary,
    .$_el<?php echo $anchor_selector; ?> .x-anchor-text-secondary {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .$_el<?php echo $anchor_selector; ?> .x-anchor-text-primary {
    font-family: $<?php echo $anchor_k_pre; ?>anchor_primary_font_family;
    font-size: $<?php echo $anchor_k_pre; ?>anchor_primary_font_size;
    font-style: $<?php echo $anchor_k_pre; ?>anchor_primary_font_style;
    font-weight: $<?php echo $anchor_k_pre; ?>anchor_primary_font_weight;
    line-height: $<?php echo $anchor_k_pre; ?>anchor_primary_line_height;
    @unless $<?php echo $anchor_k_pre; ?>anchor_primary_letter_spacing?? {
      letter-spacing: $<?php echo $anchor_k_pre; ?>anchor_primary_letter_spacing;
      margin-right: calc($<?php echo $anchor_k_pre; ?>anchor_primary_letter_spacing * -1);
    }
    @unless $<?php echo $anchor_k_pre; ?>anchor_primary_text_align?? {
      text-align: $<?php echo $anchor_k_pre; ?>anchor_primary_text_align;
    }
    @unless $<?php echo $anchor_k_pre; ?>anchor_primary_text_decoration?? {
      text-decoration: $<?php echo $anchor_k_pre; ?>anchor_primary_text_decoration;
    }
    @unless $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_dimensions?? {
      @if $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_color === 'transparent' {
        text-shadow: none;
      }
      @if $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_color !== 'transparent' {
        text-shadow: $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_color;
      }
    }
    @unless $<?php echo $anchor_k_pre; ?>anchor_primary_text_transform?? {
      text-transform: $<?php echo $anchor_k_pre; ?>anchor_primary_text_transform;
    }
    color: $<?php echo $anchor_k_pre; ?>anchor_primary_text_color;
  }

  .$_el<?php echo $anchor_selector; ?>[class*="active"] .x-anchor-text-primary {
    @unless $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_dimensions?? {
      @if $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_color_alt === 'transparent' {
        text-shadow: none;
      }
      @if $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_color_alt !== 'transparent' {
        text-shadow: $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_primary_text_shadow_color_alt;
      }
    }
    color: $<?php echo $anchor_k_pre; ?>anchor_primary_text_color_alt;
  }

  @if $<?php echo $anchor_k_pre; ?>anchor_has_template === true {

    @unless $<?php echo $anchor_k_pre; ?>anchor_text_secondary_content === '' {

      .$_el<?php echo $anchor_selector; ?> .x-anchor-text-secondary {
        @if $<?php echo $anchor_k_pre; ?>anchor_text_reverse === true {
          margin-bottom: $<?php echo $anchor_k_pre; ?>anchor_text_spacing;
        }
        @if $<?php echo $anchor_k_pre; ?>anchor_text_reverse === false {
          margin-top: $<?php echo $anchor_k_pre; ?>anchor_text_spacing;
        }
        font-family: $<?php echo $anchor_k_pre; ?>anchor_secondary_font_family;
        font-size: $<?php echo $anchor_k_pre; ?>anchor_secondary_font_size;
        font-style: $<?php echo $anchor_k_pre; ?>anchor_secondary_font_style;
        font-weight: $<?php echo $anchor_k_pre; ?>anchor_secondary_font_weight;
        line-height: $<?php echo $anchor_k_pre; ?>anchor_secondary_line_height;
        @unless $<?php echo $anchor_k_pre; ?>anchor_secondary_letter_spacing?? {
          letter-spacing: $<?php echo $anchor_k_pre; ?>anchor_secondary_letter_spacing;
          margin-right: calc($<?php echo $anchor_k_pre; ?>anchor_secondary_letter_spacing * -1);
        }
        @unless $<?php echo $anchor_k_pre; ?>anchor_secondary_text_align?? {
          text-align: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_align;
        }
        @unless $<?php echo $anchor_k_pre; ?>anchor_secondary_text_decoration?? {
          text-decoration: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_decoration;
        }
        @unless $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_dimensions?? {
          @if $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_color === 'transparent' {
            text-shadow: none;
          }
          @if $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_color !== 'transparent' {
            text-shadow: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_color;
          }
        }
        @unless $<?php echo $anchor_k_pre; ?>anchor_secondary_text_transform?? {
          text-transform: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_transform;
        }
        color: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_color;
      }

      .$_el<?php echo $anchor_selector; ?>[class*="active"] .x-anchor-text-secondary {
        @unless $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_dimensions?? {
          @if $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_color_alt === 'transparent' {
            text-shadow: none;
          }
          @if $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_color_alt !== 'transparent' {
            text-shadow: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_secondary_text_shadow_color_alt;
          }
        }
        color: $<?php echo $anchor_k_pre; ?>anchor_secondary_text_color_alt;
      }

    }

  }

}



<?php

// Graphic
// =============================================================================

?>

@if $<?php echo $anchor_k_pre; ?>anchor_has_template === true && $<?php echo $anchor_k_pre; ?>anchor_graphic === true {

  .$_el<?php echo $anchor_selector; ?> .x-anchor-graphic {
    @unless $<?php echo $anchor_k_pre; ?>anchor_graphic_margin?? {
      margin: $<?php echo $anchor_k_pre; ?>anchor_graphic_margin;
    }
  }

  @if $<?php echo $anchor_k_pre; ?>anchor_graphic_type === 'icon' {

    .$_el<?php echo $anchor_selector; ?> .x-anchor-graphic [data-x-icon] {
      @if $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_width !== 'auto' {
        width: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_width;
      }
      @if $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_height !== 'auto' {
        height: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_height;
        line-height: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_height;
      }
      font-size: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_font_size;
      @unless $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_dimensions?? {
        @if $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_color === 'transparent' {
          text-shadow: none;
        }
        @if $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_color !== 'transparent' {
          text-shadow: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_color;
        }
      }
      color: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_color;
    }

    .$_el<?php echo $anchor_selector; ?>[class*="active"] .x-anchor-graphic [data-x-icon] {
      @unless $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_dimensions?? {
        @if $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_color_alt === 'transparent' {
          text-shadow: none;
        }
        @if $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_color_alt !== 'transparent' {
          text-shadow: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_text_shadow_color_alt;
        }
      }
      color: $<?php echo $anchor_k_pre; ?>anchor_graphic_icon_color_alt;
    }

  }

  @if $<?php echo $anchor_k_pre; ?>anchor_graphic_type === 'toggle' {

    <?php include( '_toggle-css.php' ); ?>

  }

}



<?php

// Sub Indicator
// =============================================================================

?>

@if $<?php echo $anchor_k_pre; ?>anchor_has_template === true && $<?php echo $anchor_k_pre; ?>anchor_type === 'menu-item' && $<?php echo $anchor_k_pre; ?>anchor_sub_indicator === true {

  .$_el<?php echo $anchor_selector; ?> .x-anchor-sub-indicator {
    @if $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_width !== 'auto' {
      width: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_width;
    }
    @if $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_height !== 'auto' {
      height: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_height;
      line-height: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_height;
    }
    @unless $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_margin?? {
      margin: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_margin;
    }
    font-size: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_font_size;
    @unless $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_dimensions?? {
      @if $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_color === 'transparent' {
        text-shadow: none;
      }
      @if $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_color !== 'transparent' {
        text-shadow: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_color;
      }
    }
    color: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_color;
  }

  .$_el<?php echo $anchor_selector; ?>[class*="active"] .x-anchor-sub-indicator {
    @unless $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_dimensions?? {
      @if $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_color_alt === 'transparent' {
        text-shadow: none;
      }
      @if $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_color_alt !== 'transparent' {
        text-shadow: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_dimensions $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_text_shadow_color_alt;
      }
    }
    color: $<?php echo $anchor_k_pre; ?>anchor_sub_indicator_color_alt;
  }

}



<?php

// Particles
// =============================================================================

?>

@if $<?php echo $anchor_k_pre; ?>anchor_primary_particle === true {

  <?php

  $particle_selector = $anchor_selector . ' .x-anchor-particle-primary';
  $particle_k_pre    = $anchor_k_pre . 'anchor_primary';

  include( '_particle-css.php' );

  ?>

}

@if $<?php echo $anchor_k_pre; ?>anchor_secondary_particle === true {

  <?php

  $particle_selector = $anchor_selector . ' .x-anchor-particle-secondary';
  $particle_k_pre    = $anchor_k_pre . 'anchor_secondary';

  include( '_particle-css.php' );

  ?>

}
