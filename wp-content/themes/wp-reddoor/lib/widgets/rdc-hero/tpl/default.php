<?php

echo '<h2 class="tabbedWidgetTitle">' . $instance['title'] . '</h2>';

$this->render_template($instance['controls'], $instance['frames']);
