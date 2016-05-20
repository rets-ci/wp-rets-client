<div class="rdc-modal-overlay"></div>
<div class="rdc-modal-window">
  <div class="rdc-close-modal">
    <img src="<?php echo $this->widget_url() ?>/assets/icons/close.png" alt="" />
  </div>
  <h3><?php echo $instance['title']; ?></h3>
  <div class="rdc-form-wrapper">
    <?php include $this->forms_path() . $instance['form'] . '.php'; ?>
  </div>
</div>