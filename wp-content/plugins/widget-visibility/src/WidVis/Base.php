<?php
abstract class WidVis_Base {
    protected $plugin;
    
    final public function run( $plugin ) {
        $this->plugin = $plugin;
    }
}