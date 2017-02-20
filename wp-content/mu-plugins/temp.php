<?php

add_action('admin_init', function() {

  if( $_GET['test'] !== 'term-test' ) {
    return;
  }

  $_result = WPP_F::insert_terms(1231323, array(
    array(
      '_id' => '2342323432',
      '_type' => 'wpp_agency_agent',
      'name' => 'John Smith 233',
      'slug' => 'john-smith',
      'description' => 'General, default description of agent.',
      'meta' => array(
        'first_name' => 'John',
        'last_last' => 'Smith',
        'role' => 'some-agent'
      ),
      'post_meta' => array(
        'description' => 'This is a big room for this particular property',
        'role' => 'primary_agent'
      )
    ),
    array(
      '_id' => '233242343',
      '_type' => 'wpp_agency_agent',
      'description' => 'Description of term.',
      'name' => 'John Smith'
    ),
    array(
      '_type' => 'wpp_agency_agent',
      'description' => 'Description of term.',
      'name' => 'John Doe',
      'meta' => array(
        'first_name' => 'John',
        'last_last' => 'Smith'
      )
    )
  ));

  die( '<pre>' . print_r( $_result , true ) . '</pre>' );
});
