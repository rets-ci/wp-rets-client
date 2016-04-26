<?php

echo '<h2 class="tabbedWidgetTitle">' . $instance['title'] . '</h2>';

$this->render_template($instance['controls'], $instance['frames']);

?>

<div class="tabbedWidgetMobile">
  <div class="rdc-accordion">
    <?php
    $mobileDataFrames = $instance['frames'];

    if(!empty($mobileDataFrames)){
    foreach($mobileDataFrames as $value){
      //$dataImage = wp_get_attachment_image_url($value['image'], 'full');
      echo '<h3>' . siteorigin_widget_get_icon($value['svg']);
      echo '<span class="mobileFrameTitle">' . $value['content_title'] . '</span></h3>';
      echo '<div>';
      echo '<h4 class="counter">' . $value['content_title'] . '</h4>';
      echo '<p class="counter">' . $value['content'] . '</p>';
      if($value['feature_point']['icon_point'] || $value['feature_point']['feature_title'] || $value['feature_point']['feature_content'] ) {
        echo '<div class="counter mobileFeaturePoint">'; //Feature Point
        echo siteorigin_widget_get_icon($value['feature_point']['icon_point']);
        echo '<div>';
        echo '<h4>' . $value['feature_point']['feature_title'] . '</h4>';
        echo $value['feature_point']['feature_content'];
        echo '</div><div class="clear"></div>';
        echo '</div>';
      }
      if($value['feature_point2']['icon_point2'] || $value['feature_point2']['feature_title2'] || $value['feature_point2']['feature_content2'] ) {
        echo '<div class="counter mobileFeaturePoint">'; //Feature Point 2
        echo siteorigin_widget_get_icon($value['feature_point2']['icon_point2']);
        echo '<div>';
        echo '<h4>' . $value['feature_point2']['feature_title2'] . '</h4>';
        echo $value['feature_point2']['feature_content2'];
        echo '</div><div class="clear"></div>';
        echo '</div>';
      }
      if($value['feature_point3']['icon_point3'] || $value['feature_point3']['feature_title3'] || $value['feature_point3']['feature_content3'] ) {
        echo '<div class="counter mobileFeaturePoint">'; //Feature Point 3
        echo siteorigin_widget_get_icon($value['feature_point3']['icon_point3']);
        echo '<div>';
        echo '<h4>' . $value['feature_point3']['feature_title3'] . '</h4>';
        echo $value['feature_point3']['feature_content3'];
        echo '</div><div class="clear"></div>';
        echo '</div>'; // End Feature Point
      }
      if(!empty($value['image'])){
        echo '<div class="counter tabbedMobileImageArea">'.  wp_get_attachment_image ($value['image'], 'medium') .'</div>';
      }
      echo '</div>';
      }
    }
    ?>
  </div>
  <div class="clear"></div>
</div>
