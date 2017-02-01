<?php

$api_url = 'https://rets-ci-api-rets-ci-v0-5-0.c.rabbit.ci/v1/site/' . get_option('ud_site_id') . '/analysis?token=' . get_option('ud_site_secret_token');

$_analysis = json_decode( wp_remote_retrieve_body( wp_remote_get($api_url) ) );
wp_enqueue_script( 'tablesorter', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.5/js/jquery.tablesorter.min.js' );

?>

<style>

  .wp-rets-mapper-group[data-rets-mapper-group="post"],
  .wp-rets-mapper-group[data-rets-mapper-group="_standard"],
  .wp-rets-mapper-group[data-rets-mapper-group="_categorical"],
  .wp-rets-mapper-group[data-rets-mapper-group="_system"] {
    display: none;
  }

  #rets-mapper-table.widefat * {
    word-wrap: normal;
  }
</style>


<div class="wrap">
  <h3>RETS.ci Field Mapper</h3>
<p><?php echo $_analysis->message; ?>.</p>

<table id="rets-mapper-table" class="widefat fixed tablesorter">
  <thead>
  <tr>
    <th scope="col"  class="hidden">ID</th>
    <th scope="col" class="sortable"><a href="#"><span>Slug</span><span class="sorting-indicator"></span></a></th>
    <th scope="col"  class="sortable"><a href="#"><span>Count</span><span class="sorting-indicator"></span></a></th>
    <th scope="col"  class="sortable hidden"><a href="#"><span>Type</span><span class="sorting-indicator"></span></a></th>
    <th scope="col"  class="sortable"><a href="#"><span>Rate</span><span class="sorting-indicator"></span></a></th>
    <th scope="col"  class="sortable"><a href="#"><span>Group</span><span class="sorting-indicator"></span></a></th>
    <th scope="col"  class="sortable"><a href="#"><span>Values</span><span class="sorting-indicator"></span></a></th>
    <th scope="col"  class="sortable"><a href="#"><span>Alias</span><span class="sorting-indicator"></span></a></th>
  </tr>
  </thead>
  <tbody>
  <?php $c = 0; ?>
<?php foreach( $_analysis->data as $_field ) { ?>
  <?php $c++; ?>
  <tr class="wp-rets-mapper-group wp-rets-mapper-group-<?php echo $_field->group ? $_field->group : 'post'; ?>" data-rets-mapper-group="<?php echo $_field->group ? $_field->group : 'post'; ?>">
    
    <th class="hidden"><?php echo $_field->_id; ?></th>
    <th><?php echo $_field->key; ?></th>
    <td><?php echo $_field->totalCount; ?></td>
    <td class="hidden"><?php echo $_field->type; ?></td>
    <td><?php echo $_field->usageRate; ?></td>
    <td><?php echo $_field->group; ?></td>
    <td class="mapper-show-info" data-info-block="block-<?php echo $c; ?>" style="color:blue;font-weight: bold;cursor:pointer">
      <?php
      if(isset( $_field->values  )){
        echo count( $_field->values );
        $i = 0; ?>
        <div class="hidden block-<?php echo $c; ?>" style="padding: 2px;font-style: italic">
          <?php
          foreach($_field->values as $value){
            $i++;
            if($i < 5){
              echo $value->value . '<br/>';
            }
          }
          ?>
        </div>
      <?php }; ?>
    </td>
    <td><input type="text" value=""></td>

  </tr>

<?php } ?>
  </tbody>

</table>

<?php

echo( '<pre class="hidden">' . print_r( $_analysis, true ) . '</pre>' ); ?>
  </div>

<script>
  jQuery(document).ready(function()
    {
      jQuery("#rets-mapper-table").tablesorter({
        cssAsc: 'asc',
        cssDesc: 'desc',
        widthFixed: true
      });
      jQuery('.mapper-show-info').on('click', function(){
        var current_class = '.' + jQuery(this).data('info-block');
        jQuery(current_class).toggle();
      });
    }
  );


</script>
