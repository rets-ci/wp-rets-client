<?php
/**
 *
 *
 * @todo Use Settings API to render messages.
 */

//echo 'WP_AMD_DIR: ' . WP_AMD_DIR;
//echo includes_url( 'plugins/wp-amd/static/scripts/wp-amd.js' );

?>
<?php if( !empty( $data[ 'msg' ] ) ) : ?>
  <div class="updated"><p><strong><?php echo $data[ 'msg' ]; ?></strong></p></div>
<?php endif; ?>
<div class="wrap">
  <h2><?php _e( 'Script Editor', get_wp_amd( 'domain' ) ); ?><span class="ajax-message"></span></h2>
  <form action="themes.php?page=amd-page-script" method="post" id="global-javascript-form">
    <?php wp_nonce_field( 'update_amd_script', 'update_amd_script_nonce' ); ?>
    <div class="metabox-holder has-right-sidebar">

      <div class="inner-sidebar">
        <?php do_meta_boxes( get_current_screen()->id, 'side', $data ); ?>
      </div>

      <div id="post-body">
        <div id="post-body-content">
          <div id="global-editor-shell" class="wp-amd-editor-shell">
            <textarea id="global-javascript" class="wp-editor-area" data-editor-status="not-ready" name="content"><?php echo $data[ 'post_content' ]; ?></textarea>
            <label for="global-javascript"></label>
          </div>
        </div>
      </div>

    </div>
  </form>
</div>