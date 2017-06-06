<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/ADDONS/MARKUP/PAGE-HOME-BOX-VALIDATION.PHP
// -----------------------------------------------------------------------------
// Addons home page output.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Page Output
// =============================================================================

// Page Output
// =============================================================================

?>

<div class="tco-column">
  <div class="tco-box tco-box-validation" data-tco-module="x-validation">

    <input type="hidden" data-tco-module-target="preload-key" value="<?php echo X_Addons_Validation::preload_key(); ?>"/>

    <div class="tco-box-content">
      <div class="tco-validation" data-tco-module-processor>
        <div class="tco-validation-graphic">
          <?php x_tco()->admin_icon( 'locked', 'tco-validation-graphic-icon' ); ?>
          <?php x_tco()->admin_icon( 'arrow-right', 'tco-validation-graphic-icon' ); ?>
          <?php x_tco()->admin_icon( 'key', 'tco-validation-graphic-icon' ); ?>
          <?php x_tco()->admin_icon( 'arrow-right', 'tco-validation-graphic-icon' ); ?>
          <?php x_tco()->admin_icon( 'unlocked', 'tco-validation-graphic-icon' ); ?>
        </div>
        <h1 class="tco-validation-title"><?php _e( 'You&apos;re almost finished!', '__x__' ); ?></h1>
        <p class="tco-validation-text"><?php echo x_i18n( 'overview', 'site-not-validated'); ?></p>
      </div>
      <span class="tco-status-text"></span>
      <div class="tco-validation-overlay" data-tco-module-target="overlay">
        <div class="tco-vam-outer">
          <div class="tco-vam-inner">
            <p class="tco-validation-text" data-tco-module-target="message"></p>
            <a class="tco-btn tco-btn-lg" data-tco-module-target="button"></a>
          </div>
        </div>
      </div>
    </div>

    <form data-tco-module-target="form" action="">
      <input class="tco-form-control" type="text" placeholder="<?php _e( 'Input Code and Hit Enter', '__x__' ); ?>" data-tco-module-target="input">
    </form>

  </div>
</div>
