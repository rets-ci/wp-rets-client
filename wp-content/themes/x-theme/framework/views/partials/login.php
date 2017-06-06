<?php

// =============================================================================
// VIEWS/PARTIALS/LOGIN.PHP
// -----------------------------------------------------------------------------
// Login partial.
// =============================================================================

GLOBAL $user_login;


// Prepare Attr Values
// -------------------

$action       = esc_url( site_url( 'wp-login.php' ) );
$value_user   = esc_attr( $user_login );
$value_submit = esc_html__( 'Login', '__x__' );
$value_hidden = esc_url( get_permalink() );


// Prepare Atts
// ------------

$atts_form = array(
  'class'  => 'x-login',
  'action' => $action,
  'method' => 'post'
);

$atts_input_user = array(
  'type'  => 'text',
  'name'  => 'log',
  'id'    => 'log',
  'value' => $value_user
);

$atts_input_pass = array(
  'type' => 'password',
  'name' => 'pwd',
  'id'   => 'pwd'
);

$atts_input_submit = array(
  'class' => 'x-login-submit',
  'type'  => 'submit',
  'name'  => 'submit',
  'value' => $value_submit
);

$atts_input_hidden = array(
  'type'  => 'hidden',
  'name'  => 'redirect_to',
  'value' => $value_hidden
);


// Output
// ------

?>

<form <?php echo x_atts( $atts_form ); ?>>
  <h4 class="x-login-title">Login</h4>
  <div>
    <label><?php esc_html__( 'Username', '__x__' ); ?></label>
    <input <?php echo x_atts( $atts_input_user ); ?>>
  </div>
  <div>
    <label><?php esc_html__( 'Password', '__x__' ); ?></label>
    <input <?php echo x_atts( $atts_input_pass ); ?>>
  </div>
  <div>
    <input <?php echo x_atts( $atts_input_submit ); ?>>
  </div>
  <input <?php echo x_atts( $atts_input_hidden ); ?>>
</form>