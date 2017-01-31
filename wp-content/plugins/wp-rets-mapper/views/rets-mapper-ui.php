<?php

$_analysis = json_decode( wp_remote_retrieve_body( wp_remote_get('https://rets-ci-api-rets-ci-v0-5-0.c.rabbit.ci/v1/site/616bf200-b814-4a8b-816e-a4405061e3b8/analysis?token=40f95eaadca4472e7213f1f7d6ead1a7') ) );

wp_enqueue_script( 'tablesorter', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.5/js/jquery.tablesorter.min.js' );
?>
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
<?php  foreach( $_analysis->data as $_field ) { ?>
  <tr>

    <th class="hidden"><?php echo $_field->_id; ?></th>
    <th><?php echo $_field->key; ?></th>
    <td><?php echo $_field->totalCount; ?></td>
    <td class="hidden"><?php echo $_field->type; ?></td>
    <td><?php echo $_field->usageRate; ?></td>
    <td><?php echo $_field->group; ?></td>
    <td><?php echo isset( $_field->values  ) ? count( $_field->values ) : ''; ?></td>
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
    }
  );


</script>
<style>
  #rets-mapper-table.widefat * {
    word-wrap: normal;
  }
</style>
