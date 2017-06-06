<?php

// =============================================================================
// VIEWS/PARTIALS/INPUT.PHP
// -----------------------------------------------------------------------------
// Input partial.
// =============================================================================

?>

<div class="x-form-control" data-x-form-control="text|radio|checkbox|select|submit">

  <?php if ( 'input_type' === 'text' || 'input_type' === 'password' ) : ?>

    <label for="input_name">Username</label>
    <input type="text" name="input_name" value="" id="input_name">

  <?php elseif ( 'input_type' === 'radio' ) : ?>

    <label for="radio_name">
      <input type="radio" name="radio_name" value="y" id="radio_name_1"> Yes
      <input type="radio" name="radio_name" value="n" id="radio_name_2"> No
    </label>

  <?php elseif ( 'input_type' === 'checkbox' ) : ?>

    <label for="checkbox_name">
      <input type="checkbox" name="checkbox_name" value="y" id="checkbox_name_1"> Yes
    </label>

  <?php elseif ( 'input_type' === 'select' ) : ?>

    <label for="select_name">Username</label>
    <select name="select_name">
      <option value="1">Option #1</option>
      <option value="2">Option #2</option>
      <option value="3">Option #3</option>
    </select>

  <?php elseif ( 'input_type' === 'submit' ) : ?>

    <button type="submit">
      Verify
      <span class="x-form-processing"><span>Processing...</span></span>
    </button>

  <?php endif; ?>

</div>