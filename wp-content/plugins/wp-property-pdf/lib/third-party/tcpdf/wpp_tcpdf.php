<?php

@include_once 'tcpdf.php';

/**
 * Class for extending of TCPDF
 *
 * @author odokienko@UD
 */
class WPP_TCPDF extends TCPDF {

  /**
   * Draws HTML list with fonts abaliable
   * @param type $args
   * @author odokienko@UD
   * @since 1.37.6
   */
  public function getHTMLFontList($args){

   $this->getFontsList();

   $defaults = array(
      'name' => 'setfont',
      'selected' => 'none',
      'fontlist' => $this->fontlist,
      'fontpath' => $this->_getfontpath(),
      'blank_selection_label' => ' - '
      );

    extract( $args = wp_parse_args( $args, $defaults ), EXTR_SKIP );

    $fontlist = array_unique($fontlist);
    natsort($fontlist);

    if(empty($id) && !empty($name)) {
      $id = $name;
    }

    ?>
      <select id="<?php echo $id ?>" name="<?php echo $name ?>" >
        <option value=""><?php echo $blank_selection_label; ?></option>
          <?php
            foreach($fontlist as $fontname) {
              //in any case $name will be owerwritten by include();
              unset($name);unset($type);
              if( $fontname === 'index' ) continue;
          ?>
            <option value='<?php echo $fontname; ?>' <?php if($selected == $fontname) echo 'selected="selected"'; ?>>
              <?php
              $font_file  = $fontpath . $fontname . '.php' ;
              if ( file_exists( $font_file ) ) {
                include( $font_file );
                echo $name . ((false !== strpos(strtolower($type),'unicode')) ? ' (Unicode)' : '');
              }else{
               echo $fontname;
              }
              ?>
            </option>
          <?php } ?>
      </select>

    <?php

  }

}


/**
 * Renders the list of available TCPDF fonts
 *
 * @author peshkov@UD
 * @since 1.37.6
 */
function wpp_tcpdf_get_HTML_font_list( $args='' ) {
  static $pdf;
  if( !is_object( $pdf ) ) {
    $pdf = new WPP_TCPDF();
  }
  $pdf->getHTMLFontList( $args );
}
?>
