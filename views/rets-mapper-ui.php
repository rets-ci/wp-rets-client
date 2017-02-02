<?php
global $wp_properties;


$api_url = 'https://rets-ci-node-client-service-latest.c.rabbit.ci/' . get_option('ud_site_id') . '/analysis?token=' . get_option('ud_site_secret_token');

$_analysis = json_decode( wp_remote_retrieve_body( $api_url_response = wp_remote_get($api_url) ) );

$field_alias = isset( $wp_properties['field_alias'] ) && is_array( $wp_properties['field_alias'] ) ? array_flip( $wp_properties['field_alias'] ) : array();

if( get_transient( 'wp-rets-mapper-data' ) ) {
  $_analysis = get_transient( 'wp-rets-mapper-data' );
} else {

  $api_url = 'https://api.rets.ci/v2/site/' . get_option( 'ud_site_id' ) . '/analysis?token=' . get_option( 'ud_site_secret_token' );
  $_analysis = json_decode( wp_remote_retrieve_body( wp_remote_get( $api_url ) ) );
  set_transient( 'wp-rets-mapper-data', $_analysis, 90 );
}


wp_enqueue_script( 'tablesorter', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.5/js/jquery.tablesorter.min.js' );

if($api_url_response->errors){
  print_r('We have some errors.');
  echo '<pre>';
  print_r($api_url_response);
  echo '</pre>';
}

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
    <th scope="col" class="hidden">ID</th>

    <th scope="col" class="sortable"><a href="#"><span>Storage Type</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable"><a href="#"><span>Slug</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable"><a href="#"><span>Count</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable hidden"><a href="#"><span>Type</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable hidden"><a href="#"><span>Rate</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable"><a href="#"><span>Values</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable"><a href="#"><span>Alias</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class=""><a href="#"><span>Action</span><span class="sorting-indicator"></span></a></th>

  </tr>
  </thead>
  <tbody>
  <?php $c = 0; ?>

  <?php foreach( $_analysis->data as $_field ) { ?>
    <?php $c++; ?>
    <tr class="wp-rets-mapper-group wp-rets-mapper-group-<?php echo $_field->group ? $_field->group : 'post'; ?> mapper-string-<?php echo $c; ?>" data-rets-mapper-id="<?php echo $_field->_id; ?>" data-rets-mapper-group="<?php echo $_field->group ? $_field->group : 'post'; ?>">
    <th class="hidden"><?php echo $_field->_id; ?></th>
    <td><?php echo $_field->group; ?></td>
    <th class="mapper-slug"><?php echo $_field->key; ?></th>
    <td><?php echo $_field->totalCount; ?></td>
    <td class="hidden"><?php echo $_field->type; ?></td>
    <td class="hidden"><?php echo $_field->usageRate; ?></td>
    <td class="mapper-show-info" data-info-block="block-<?php echo $c; ?>" style="color:blue;font-weight: bold;cursor:pointer">
      <?php
      if( isset( $_field->values ) ) {
        echo count( $_field->values );
        $i = 0; ?>
        <div class="hidden block-<?php echo $c; ?>" style="padding: 2px;font-style: italic; color: #000">
          <?php
          foreach( $_field->values as $value ) {
            $i++;
            if( $i < 10 ) {
              echo $value->value . '<br/>';
            }
          }
          ?>
        </div>
      <?php } else { echo '-'; }; ?>
    </td>
<!--
    <td><input class="mapper-alias" type="text" value=""></td>
    <td><button class="add-alias" data-mapper-string="mapper-string-<?php //echo $c; ?>">Add</button></td>
  </tr>
<?php //} ?>
-->
    <td><?php echo isset( $field_alias[ $_field->key ] ) ? $field_alias[ $_field->key ] : '-'; ?></td>
    <td><a class="wp-rets-mapper-action" data-action="hide">Hide</a></td>

  </tr>

  <?php } ?>

  </tbody>
</table>

  <?php

  echo( '<pre class="hidden">' . print_r( $_analysis, true ) . '</pre>' ); ?>
  </div>

<script>

  jQuery( document ).ready( function () {
      jQuery( ".wp-rets-mapper-action" ).click( function () {

        var _id = jQuery( this ).closest( '.wp-rets-mapper-group' ).data( 'rets-mapper-id' );

        jQuery( this ).closest( '.wp-rets-mapper-group' ).hide();

        var _hidden;

        try {

          _hidden = JSON.parse( localStorage.getItem( 'wp-rets-hidden-fields' ) ) || [];

        } catch( error ) {
          _hidden = [];
        }

        if( 'string' === typeof _hidden ) {
          _hidden = [ _hidden ];
        }

        _hidden.push( _id );

        localStorage.setItem( 'wp-rets-hidden-fields', JSON.stringify( _hidden ) );

      } );

    // Hide hidden fields
    if( localStorage.getItem( 'wp-rets-hidden-fields' ) ) {
      var _hidden = JSON.parse( localStorage.getItem( 'wp-rets-hidden-fields' ) );

      _hidden.forEach(function( hiddenItem ) {
        jQuery( '.wp-rets-mapper-group[data-rets-mapper-id="' + hiddenItem +'"]' ).hide();
        console.info( 'wp-rets-client', 'hiding field', hiddenItem );
      });

    }

      jQuery( "#rets-mapper-table" ).tablesorter( {
        cssAsc: 'asc',
        cssDesc: 'desc',
        widthFixed: true
      } );
      jQuery( '.mapper-show-info' ).on( 'click', function () {
        var current_class = '.' + jQuery( this ).data( 'info-block' );
        jQuery( current_class ).toggle();
      } );
    jQuery('.add-alias').on('click', function(){
      var current_string = '.' + jQuery(this).data('mapper-string');

      var mapper_slug = jQuery(current_string + ' .mapper-slug').text();
      var mapper_alias = jQuery(current_string + ' .mapper-alias').text();

      jQuery.post( ajaxurl, {
        action: 'mapper_add_alias',
        security: <?php echo wp_create_nonce( "mapper-add-alias" ) ?>,
        payload: {
          slug: mapper_slug,
          alias: mapper_alias
        }
      }, function( response ){

        if ( response.ok ) {
          jQuery(current_string).remove();
        }

      });
    });
    }
  );


</script>
