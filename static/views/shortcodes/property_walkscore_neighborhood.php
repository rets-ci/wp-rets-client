<?php
/**
 * [property_walkscore] template
 *
 * To modify it, copy it to your theme's root.
 */
?>

<script type='text/javascript'>
  var ws_wsid = '<?php echo $api_key; ?>';
  var ws_lat = "<?php echo $latitude; ?>";
  var ws_lon = "<?php echo $longitude; ?>";
  var ws_width = '600';
  var ws_height = '444';
  var ws_layout = 'horizontal';
  var ws_commute = 'true';
  var ws_transit_score = 'true';
  var ws_map_modules = 'all';
</script>

<div id='ws-walkscore-tile'></div>
<script type='text/javascript' src='//www.walkscore.com/tile/show-walkscore-tile.php'></script>


