<?php
if (!empty($title)) {
  echo '<h2 class="cfct-mod-title">'.esc_html($title).'</h2>';
}
?>
<div class="cfct-mod-content loop post-listing clearfix">
  <?php
  echo $content;

  if (!empty($pagination_url)) {
    echo '
        <div class="pagination">
          <span class="next"><a href="'.$pagination_url.'" title="Next Page">'.
      (!empty($pagination_text) ? $pagination_text : __('More', 'carrington-build').' &raquo;').
      '</a></span>
    </div>
    ';
  }
  ?>
</div>
