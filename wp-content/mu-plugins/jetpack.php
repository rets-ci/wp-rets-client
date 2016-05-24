<?php

if ( !empty( $_SERVER['HTTP_X_SELECTED_BRANCH'] ) && $_SERVER['HTTP_X_SELECTED_BRANCH'] != 'production' ) {
  define( 'JETPACK_DEV_DEBUG', true );
}