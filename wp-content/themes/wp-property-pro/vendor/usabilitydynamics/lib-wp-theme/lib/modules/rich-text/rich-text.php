<?php

/**
 * Plain Text Carrington Build Module
 * Simple plain text box that stores and displays exactly what it is given.
 * Good for displaying raw HTML and/or JavaScript
 */
if( !class_exists( 'EditorModule' ) ) {

  /**
   * Class EditorModule
   */
  class EditorModule extends cfct_build_module {

    protected $_deprecated_id = 'cfct_rich_text';

    // remove padding from the popup-content form
    protected $admin_form_fullscreen = true;

    public function __construct() {
      $opts = array(
        'description' => __( 'Provides a WYSIWYG editor.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cfct-rich-text', __( 'Editor', 'carrington-build' ), $opts );

      // set up rich text editing if user has disabled preference that will not load tinymce
      if( !user_can_richedit() ) {
        add_action( 'admin_print_footer_scripts', array( $this, 'footer_js' ), 10 );
      }
    }

    public function display( $data ) {
      $text = do_shortcode( $data[ $this->get_field_id( 'content' ) ] );

      return $this->load_view( $data, compact( 'text' ) );
    }

    public function admin_form( $data ) {
      $ret = '
				<textarea name="' . $this->get_field_name( 'content' ) . '" id="' . $this->get_field_id( 'content' ) . '">' .
        ( isset( $data[ $this->get_field_name( 'content' ) ] ) ? htmlspecialchars( $data[ $this->get_field_name( 'content' ) ] ) : null ) .
        '</textarea>
        ';
      $ret .= $this->inline_js();

      return $ret;
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

    /**
     * Add some admin CSS for formatting
     *
     * @return void
     */
    public function admin_css() {
      return '
				#' . $this->get_field_id( 'content' ) . ' {
					height: 300px;
				}
			';
    }

    public function admin_js() {
      $js = '
				// automatically set focus on the rich text editor
				cfct_builder.addModuleLoadCallback("' . $this->id_base . '",function(form) {
					tinyMCE.execCommand("mceAddControl", false, "' . $this->get_field_id( 'content' ) . '");
					setTimeout(function() {tinyMCE.execCommand("mceFocus", true, "' . $this->get_field_id( 'content' ) . '");}, 10);

					

					// properly destroy the editor on cancel
					$("#cfct-edit-module-cancel").click(function() {
						var _ed = tinyMCE.get("' . $this->get_field_id( 'content' ) . '");
						tinyMCE.remove(_ed);						
					});
				});
				
				// we have to register a save callback so that tinyMCE pushes the data
				// back to the original textarea before the submit script gathers its content		
				cfct_builder.addModuleSaveCallback("' . $this->id_base . '",function(form) {
					var _ed = tinyMCE.get("' . $this->get_field_id( 'content' ) . '");
					_ed.save();
					tinyMCE.remove(_ed);
				});
			';

      return $js;
    }

    /**
     * Add tinyMCE to the footer
     * Only happens if user has DESELECTED the rich text editing
     * option in their user preference
     *
     * @return void
     */
    public function footer_js() {
      // wp_tiny_mce();
      global $tinymce_version;
      $baseurl = includes_url( 'js/tinymce' );
      echo '
				<script type="text/javascript" src="' . $baseurl . '/tiny_mce.js?ver=' . $tinymce_version . '"></script>
				<script type="text/javascript" src="' . $baseurl . '/langs/wp-langs-en.js?ver=' . $tinymce_version . '"></script>' . PHP_EOL;
    }

    /**
     * Set up tinymce
     *
     * @return string javascript
     */
    public function inline_js() {
      $mce_locale                 = ( '' == get_locale() ) ? 'en' : strtolower( substr( get_locale(), 0, 2 ) ); // only ISO 639-1
      $mce_spellchecker_languages = apply_filters( 'mce_spellchecker_languages', '+English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr,German=de,Italian=it,Polish=pl,Portuguese=pt,Spanish=es,Swedish=sv' );

      $js = '
				<script type="text/javascript">
					//<![CDATA[
					// same as calling tinymce.EditorManager.init({});
					tinyMCE.init({ ';
      // compress output whitespace a bit...
      $js .= preg_replace( '/(\n|\t)/', '', '
						mode:"none",
						onpageload:"", 
						width:"100%", 
						theme:"advanced", 
						skin:"wp_theme", 
						theme_advanced_buttons1:"bold,italic,underline,|,bullist,numlist,blockquote,|,justifyleft,justifycenter,justifyright,|,outdent,indent,|,link,unlink,|,code,wp_help",
						theme_advanced_buttons2:"formatselect,underline,justifyfull,forecolor,|,pastetext,pasteword,removeformat,|,charmap,|,undo,redo,spellchecker", 
						theme_advanced_buttons3:"", 
						theme_advanced_buttons4:"", 
						language:"' . $mce_locale . '",
						spellchecker_languages:"' . $mce_spellchecker_languages . '",
						theme_advanced_toolbar_location:"top", 
						theme_advanced_toolbar_align:"left", 
						theme_advanced_statusbar_location:"bottom", 
						theme_advanced_resizing:"", 
						theme_advanced_resize_horizontal:"", 
						dialog_type:"modal", 
						relative_urls:"", 
						remove_script_host:"", 
						convert_urls:"", 
						apply_source_formatting:"", 
						remove_linebreaks:"0", 
						paste_convert_middot_lists:"1", 
						paste_remove_spans:"1", 
						paste_remove_styles:"1", 
						gecko_spellcheck:"1", 
						entities:"38,amp,60,lt,62,gt", 
						accessibility_focus:false, 
						tab_focus:":prev,:next", 
						save_callback:"", 
						wpeditimage_disable_captions:"", 
						plugins:"safari,inlinepopups,spellchecker,paste"
					' );
      $js .= '
					});
					//]]>
				</script>';

      return $js;
    }
  }

}
