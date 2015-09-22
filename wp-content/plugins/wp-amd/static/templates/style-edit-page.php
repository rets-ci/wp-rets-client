<?php
/**
 *
 * @todo Use Settings API to render messages.
 */
?>
<?php if( !empty( $data[ 'msg' ] ) ) : ?>
  <div class="updated"><p><strong><?php echo $data[ 'msg' ]; ?></strong></p></div>
<?php endif; ?>
<div class="wrap">
  <h2><?php _e( 'Style Editor', get_wp_amd( 'domain' ) ); ?><span class="ajax-message"></span></h2>
  <form action="themes.php?page=amd-page-style" method="post" id="global-stylesheet-form">
    <?php wp_nonce_field( 'update_amd_style', 'update_amd_style_nonce' ); ?>
    <div class="metabox-holder has-right-sidebar">

      <div class="inner-sidebar">
        <?php do_meta_boxes( get_current_screen()->id, 'side', $data ); ?>
      </div> <!-- .inner-sidebar -->

      <div id="post-body">
        <div id="post-body-content">
          <div id="global-editor-shell" class="wp-amd-editor-shell">
            <textarea id="global-stylesheet" class="wp-editor-area" data-editor-status="not-ready" name="content"><?php echo $data[ 'post_content' ]; ?></textarea>
            <label for="global-stylesheet"></label>
          </div>
        </div> <!-- #post-body-content -->
      </div> <!-- #post-body -->

    </div> <!-- .metabox-holder -->
  </form>
</div> <!-- .wrap -->