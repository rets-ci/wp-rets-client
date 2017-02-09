<div class="sidebarBox cfct-mod-content">
  <h2><?php echo $title; ?></h2>
  <?php echo $before_list; ?>
  <?php if ( !empty($attachements) ): ?>
  <ul>
    <?php foreach( $attachements as $attachement ): ?>
    <li>
      <a href="<?php echo $attachement['url'] ?>"><?php echo $attachement['title'].'.'.$attachement['data']['ext']; ?></a>
    </li>
    <?php endforeach; ?>
  </ul>
  <?php else: ?>
  <p><?php _e( 'No files available.', 'carrington-build' ); ?></p>
  <?php endif; ?>
  <?php echo $after_list; ?>
</div>