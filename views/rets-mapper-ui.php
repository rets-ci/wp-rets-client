<?php
global $wp_properties;

$api_url = 'https://api.rets.ci/v2/site/' . get_option( 'ud_site_id' ) . '/analysis?token=' . get_option( 'ud_site_secret_token' );
$field_alias = array();

$_analysis = json_decode( wp_remote_retrieve_body( $api_url_response = wp_remote_get( $api_url ) ) );

// iterate over all field aliases and create our field-alias arary ONLY for fields that belong to a group. This is a way of filtering out aliases to non-existant fields.
foreach( $wp_properties[ 'field_alias' ] as $_field_key => $_field_alias ) {

  if( $_field_alias ) {
    $_attribute_data = UsabilityDynamics\WPP\Attributes::get_attribute_data( $_field_key );
    if( isset( $_attribute_data['group'])) {
      $field_alias[ $_field_alias ]  = $_field_key ;
    }
  }
}

if( get_transient( 'wp-rets-mapper-data' ) ) {
  $_analysis = get_transient( 'wp-rets-mapper-data' );
} else {

  $api_url = 'https://api.rets.ci/v2/site/' . get_option( 'ud_site_id' ) . '/analysis?token=' . get_option( 'ud_site_secret_token' );
  $_analysis = json_decode( wp_remote_retrieve_body( wp_remote_get( $api_url ) ) );
  set_transient( 'wp-rets-mapper-data', $_analysis, 90 );
}

wp_enqueue_script( 'tablesorter', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.5/js/jquery.tablesorter.min.js' );

if( isset( $api_url_response->errors ) ) {
  print_r( 'We have some errors.' );
  echo '<pre>';
  print_r( $api_url_response );
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
    <th scope="col" class="sortable" style="width: 100px"><a href="#"><span>Count</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable hidden"><a href="#"><span>Type</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable hidden"><a href="#"><span>Rate</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable"><a href="#"><span>Values</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="sortable"><a href="#"><span>Alias</span><span class="sorting-indicator"></span></a></th>
    <th scope="col" class="" style="width: 150px"><a href="#"><span>Action</span><span class="sorting-indicator"></span></a></th>

  </tr>
  </thead>
  <tbody>
  <?php $c = 0; ?>

  <?php foreach( $_analysis->data as $_field ) { ?>
    <?php $c++; ?>
    <tr class="wp-rets-mapper-group wp-rets-mapper-group-<?php echo $_field->group ? $_field->group : 'post'; ?> mapper-string-<?php echo $c; ?>" data-rets-mapper-id="<?php echo $_field->_id; ?>" data-rets-mapper-key="<?php echo $_field->key; ?>" data-rets-mapper-group="<?php echo $_field->group ? $_field->group : 'post'; ?>">
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
      <?php } else {
        echo '';
      }; ?>
    </td>

    <td class="rets-mapper-alias-cell">
      <input class="mapper-alias regular-text" style="width:100%" type="text" value="<?php echo isset( $field_alias[ $_field->key ] ) ? $field_alias[ $_field->key ] : ''; ?>" />
    </td>

    <td>
      <button class="add-alias button" data-mapper-string="mapper-string-<?php echo $c; ?>">Add</button>
      <button class="wp-rets-mapper-action button" data-action="hide">Hide</button>
    </td>

  </tr>

  <?php } ?>

  </tbody>
</table>

  <?php

  echo( '<pre class="hidden">' . print_r( $_analysis, true ) . '</pre>' ); ?>
  </div>

<pre>
  <?php echo( '<pre>' . print_r( $field_alias, true ) . '</pre>' ); ?>
</pre>

<script>

  jQuery( document ).ready( function () {

      if( !localStorage.getItem( 'wp-rets-hidden-fields' ) ) {
        localStorage.setItem( 'wp-rets-hidden-fields', JSON.stringify( [
          'tax_input.wpp_listing_category',
          'tax_input.wpp_listing_status',
          'tax_input.wpp_import_schedule_id',
          'tax_input.wpp_location',
          'meta_input.wpp::rets_pk'
        ] ) );
      }

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

        _hidden.forEach( function ( hiddenItem ) {
          jQuery( '.wp-rets-mapper-group[data-rets-mapper-id="' + hiddenItem + '"]' ).hide();
          console.info( 'wp-rets-client', 'hiding field', hiddenItem );
        } );

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

    jQuery( '.add-alias' ).on( 'click', function () {

      var self = this;

      jQuery( self ).prop( 'disabled', true );
      var _current_row = jQuery( this ).closest( 'tr.wp-rets-mapper-group' );

        jQuery.post( ajaxurl, {
          action: '/mapper/v1/add-alias',
          security: "<?php echo wp_create_nonce( "mapper-add-alias" ) ?>",
          payload: {
            id: _current_row.attr( 'data-rets-mapper-id' ),
            key: _current_row.attr( 'data-rets-mapper-key' ),
            alias: jQuery( 'input.mapper-alias', _current_row ).val()
          }
        }, function ( response ) {

          jQuery( self ).prop( 'disabled', false );

          if( response.ok ) {
            //jQuery( current_string ).remove();
          }

        } );
      } );
    }
  );


</script>
