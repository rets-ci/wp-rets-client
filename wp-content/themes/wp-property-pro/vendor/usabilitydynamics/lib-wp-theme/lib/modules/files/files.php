<?php
if( !class_exists( 'FilesModule' ) && class_exists( 'cfct_build_module' ) ) {

  /**
   *
   */
  class FilesModule extends cfct_build_module {

    /**
     *
     */
    public function __construct() {

      $opts = array(
        'description' => __( 'Uploaded Files', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      parent::__construct( 'nc-module-uploaded-files', __( 'Uploaded Files', 'carrington-build' ), $opts );

    }

    /**
     *
     * @param type $data
     *
     * @return type
     */
    public function display( $data ) {
      global $post;

      $title       = $data[ $this->get_field_name( 'title' ) ];
      $before_list = $data[ $this->get_field_name( 'before_list' ) ];
      $after_list  = $data[ $this->get_field_name( 'after_list' ) ];

      $query = new WP_Query(
        array(
          'post_status'    => 'any',
          'post_type'      => 'attachment', // only get "attachment" type posts
          'post_parent'    => $post->ID, // only get attachments for current post/page
          'posts_per_page' => -1 // get all attachments
        )
      );

      $attachements = array();
      foreach( $query->posts as $attachment ) {
        $type = wp_check_filetype( wp_get_attachment_url( $attachment->ID ) );
        if( !strstr( $type[ 'type' ], 'image' ) )
          $attachements[ ] = array( 'data' => $type, 'title' => $attachment->post_title, 'url' => wp_get_attachment_url( $attachment->ID ) );
      }

      return $this->load_view( $data, compact( 'attachements', 'title', 'before_list', 'after_list' ) );
    }

    /**
     *
     * @param type $data
     *
     * @return string
     */
    public function admin_form( $data ) {
      ob_start();
      ?>
      <fieldset>
        <ul>
          <li>
            <label for="<?php echo $this->get_field_id( 'title' ); ?>_id"><?php _e( 'Title', 'carrington-build' ); ?></label>
            <input id="<?php echo $this->get_field_id( 'title' ); ?>_id" name="<?php echo $this->get_field_name( 'title' ) ?>" type="text" value="<?php echo $data[ $this->get_field_name( 'title' ) ] ?>"/>
          </li>
          <li>
            <label for="<?php echo $this->get_field_id( 'before_list' ); ?>_id"><?php _e( 'Before File List', 'carrington-build' ); ?></label>
            <textarea id="<?php echo $this->get_field_id( 'before_list' ); ?>_id" name="<?php echo $this->get_field_name( 'before_list' ) ?>"><?php echo $data[ $this->get_field_name( 'before_list' ) ] ?></textarea>
          </li>
          <li>
            <label for="<?php echo $this->get_field_id( 'after_list' ); ?>_id"><?php _e( 'After File List', 'carrington-build' ); ?></label>
            <textarea id="<?php echo $this->get_field_id( 'after_list' ); ?>_id" name="<?php echo $this->get_field_name( 'after_list' ) ?>"><?php echo $data[ $this->get_field_name( 'after_list' ) ] ?></textarea>
          </li>
        </ul>
      </fieldset>
      <?php
      return ob_get_clean();
    }

    /**
     * Return a textual representation of this module.
     *
     * @param array $data
     *
     * @return string
     */
    public function text( $data ) {
      return strip_tags( $data[ $this->get_field_name( 'content' ) ] );
    }

    /**
     * Modify the data before it is saved, or not
     *
     * @param array $new_data
     * @param array $old_data
     *
     * @return array
     */
    public function update( $new_data, $old_data ) {
      return $new_data;
    }

  }

}
