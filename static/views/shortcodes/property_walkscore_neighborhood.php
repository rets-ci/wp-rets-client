<?php
/**
 * [property_walkscore] template
 *
 * To modify it, copy it to your theme's root.
 */
?>

<script type='text/javascript'>
  <?php foreach( $data as $k => $v ) {
    if( in_array( $k, array( 'property_id' ) ) ) continue;
    // Set default values for required parameters or ignore optional ones if they do not have values.
    if( empty( $v ) ) {
      switch( $k ) {
        case "width":
          $v = '100%';
          break;
        case "height":
          $v = '400';
          break;
        case "layout":
          $v = 'horizontal';
          break;
        case "map_modules":
          $v = 'default';
          break;
      }
    }
    if( !empty( $v ) ) echo "var ws_{$k}=\"{$v}\";";
  } ?>
</script>

<div id='ws-walkscore-tile'></div>
<script type='text/javascript' src='//www.walkscore.com/tile/show-walkscore-tile.php'></script>


