<div class="cfct-module-callout">
  <?php
    if (!empty($image)) {
      echo '<div class="col-md-4">'.$image.'</div>';
    }
  ?>
  <?php
    if (!empty($image)) {
      ?><div class="col-md-8"><?php
    }
    if (!empty($title)) {
      echo '<h2 class="cfct-mod-title';
      if (!empty($data[$this->get_field_id('style-title')])) {
        echo ' '.esc_attr($data[$this->get_field_name('style-title')]);
      }
      echo '">'.$title.'</h2>';
    }
  ?>
  <div class="cfct-mod-content<?php if (!empty($data[$this->get_field_id('style-content')])) { echo ' '.$data[$this->get_field_name('style-content')]; } ?>">
    <?php echo $content; ?>
  </div>
  <?php
    if (!empty($image)) {
      ?></div><?php
    }
  ?>
</div>
