<?php

echo '<h2 class="tabbedWidgetTitle">' . $instance['title'] . '</h2>';

$this->render_template($instance['controls'], $instance['frames']);

?>

<div class="tabbedWidgetMobile">
  <div id="accordion">
    <?php
    $mobileDataFrames = $instance['frames'];

    if(!empty($mobileDataFrames)){
    foreach($mobileDataFrames as $value){
      echo '<h3>' . siteorigin_widget_get_icon($instance['svg']); $instance['content_title'] . '</h3>';
      echo '<div>';
      echo $instance['content'];
      echo '</div>';
      }
    }
    ?>
  </div>
  <div class="clear"></div>
</div>
