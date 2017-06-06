<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/MENUS/MENU-ITEM-CUSTOM-FIELDS-MAP.PHP
// -----------------------------------------------------------------------------
// Map custom fields to the WordPress menu system.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Menu_Item_Custom_Fields_Map
//   02. Initialize
// =============================================================================

// Menu_Item_Custom_Fields_Map
// =============================================================================

class Menu_Item_Custom_Fields_Map {

  // Fields Property
  // ---------------

  protected static $fields = array();


  // Init
  // ----

  public static function init() {

    add_action( 'wp_nav_menu_item_custom_fields', array( __CLASS__, '_fields' ), 10, 4 );
    add_action( 'wp_update_nav_menu_item', array( __CLASS__, '_save' ), 10, 3 );
    add_filter( 'manage_nav-menus_columns', array( __CLASS__, '_columns' ), 99 );

    self::$fields = array(
      'anchor_graphic_icon' => array(
        'type'  => 'icon',
        'label' => __( 'Icon Primary', '__x__' ),
        'size'  => 'thin',
        'std'   => 'hand-pointer-o',
        'desc'  => '',
      ),
      'anchor_graphic_icon_alt' => array(
        'type'  => 'icon',
        'label' => __( 'Icon Secondary', '__x__' ),
        'size'  => 'thin',
        'std'   => 'hand-pointer-o',
        'desc'  => '',
      ),
      'anchor_graphic_image_src' => array(
        'type'  => 'text',
        'label' => __( 'Image Primary', '__x__' ),
        'size'  => 'thin',
        'std'   => '',
        'desc'  => '',
      ),
      'anchor_graphic_image_src_alt' => array(
        'type'  => 'text',
        'label' => __( 'Image Secondary', '__x__' ),
        'size'  => 'thin',
        'std'   => '',
        'desc'  => '',
      ),
      'anchor_graphic_image_width' => array(
        'type'  => 'text',
        'label' => __( 'Image Width (Required)', '__x__' ),
        'size'  => 'thin',
        'std'   => '',
        'desc'  => __( 'Input the unitless pixel width. E.G. If your image is 300px wide, write "300" in the input.', '__x__' ),
      ),
      'anchor_graphic_image_height' => array(
        'type'  => 'text',
        'label' => __( 'Image Height (Required)', '__x__' ),
        'size'  => 'thin',
        'std'   => '',
        'desc'  => __( 'Input the unitless pixel height. E.G. If your image is 150px tall, write "150" in the input.', '__x__' ),
      ),
    );

  }


  // Save Custom Field Value
  // -----------------------
  // 01. Sanitize.
  // 02. Do some checks here.
  // 03. Update.

  public static function _save( $menu_id, $menu_item_db_id, $menu_item_args ) {

    if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
      return;
    }

    check_admin_referer( 'update-nav_menu', 'update-nav-menu-nonce' );

    foreach ( self::$fields as $_key => $data ) {

      $key = sprintf( 'menu-item-%s', $_key );

      if ( ! empty( $_POST[$key][$menu_item_db_id] ) ) { // 01
        $value = $_POST[$key][$menu_item_db_id]; // 02
      } else {
        $value = null;
      }

      if ( ! is_null( $value ) ) { // 03
        update_post_meta( $menu_item_db_id, $key, $value );
      } else {
        delete_post_meta( $menu_item_db_id, $key );
      }

    }

  }


  // Output Fields
  // -------------

  public static function _fields( $id, $item, $depth, $args ) {

    foreach ( self::$fields as $_key => $data ) :

      $key   = sprintf( 'menu-item-%s', $_key );
      $id    = sprintf( 'edit-%s-%s', $key, $item->ID );
      $name  = sprintf( '%s[%s]', $key, $item->ID );
      $meta  = get_post_meta( $item->ID, $key, true );
      $value = ( empty( $meta ) ) ? $data['std'] : $meta;
      $class = sprintf( 'field-%s', $_key );
      $desc  = ( ! empty( $data['desc'] ) ) ? '<span class="description">' . $data['desc'] . '</span>' : '';

      if ( $data['type'] == 'select' ) :

      ?>

        <p class="description description-<?php echo $data['size']; ?> <?php echo esc_attr( $class ); ?>">
          <label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $data['label'] ); ?><br>
            <select id="<?php echo esc_attr( $id ); ?>" class="widefat <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $name ); ?>">
              <?php foreach ( $data['choices'] as $o_key => $o_value ) : ?>
                <option value="<?php echo $o_key ?>" <?php echo selected( $o_key, $value, false ); ?>><?php echo $o_value; ?></option>
              <?php endforeach; ?>
            </select>
            <?php echo $desc; ?>
          </label>
        </p>

      <?php elseif ( $data['type'] == 'icon' ) : ?>

        <p class="description description-<?php echo $data['size']; ?> <?php echo esc_attr( $class ); ?>">
          <label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $data['label'] ); ?><br>
            <select id="<?php echo esc_attr( $id ); ?>" class="widefat <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $name ); ?>">
              <!-- <option value="" <?php echo selected( '', $value, false ); ?>>&mdash; No Icon Assigned &mdash;</option> -->
              <?php foreach ( fa_all_unicode() as $fa_slug => $fa_unicode ) : ?>
                <option value="<?php echo $fa_slug ?>" <?php echo selected( $fa_slug, $value, false ); ?>><?php echo $fa_slug; ?></option>
              <?php endforeach; ?>
            </select>
            <?php echo $desc; ?>
          </label>
        </p>

      <?php elseif ( $data['type'] == 'hr' ) : ?>

        <hr style="float: none; width: 100%; height: 0; margin: 0; border: 0; padding: 0; background-color: transparent;">

      <?php else : ?>

        <p class="description description-<?php echo $data['size']; ?> <?php echo esc_attr( $class ); ?>">
          <label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $data['label'] ); ?><br>
            <input type="text" id="<?php echo esc_attr( $id ); ?>" class="widefat <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $value ); ?>">
            <?php echo $desc; ?>
          </label>
        </p>

      <?php

      endif;

    endforeach;

  }


  // Add Fields to Screen Options Toggle
  // -----------------------------------

  public static function _columns( $columns ) {

    // $new_columns = array();

    // foreach ( self::$fields as $_key => $data ) {
    //   if ( $data['type'] == 'hr' ) {
    //     continue;
    //   }
    //   $new_columns[$_key] = $data['label'];
    // }

    // $columns = array_merge( $columns, $new_columns );

    return $columns;

  }

}



// Initialize
// =============================================================================

Menu_Item_Custom_Fields_Map::init();