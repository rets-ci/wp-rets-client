<?php
class WidVis_Plugin implements ArrayAccess, Iterator {
    protected $container;
    protected $position;
    
    public function __construct() {
        $this->container = array();
        $this->position = 0;
    }
    
    public function run(){ 
        // Loop on contents
        foreach($this as $key=>$content){
            if( is_object($content) ){
                $reflection = new ReflectionClass(get_class($content));
                if($reflection->hasMethod('run')){
                    $content->run( $this ); // Call run method if it is an object with a run method()
                    if($reflection->hasMethod('bootstrap')){
                        $content->bootstrap(); // Call run method if it is an object with a bootstrap method()
                    }
                }
            }
        }
    }
    
    // Array Access
    public function offsetSet($offset, $value) {
        $this->container[$offset] = $value;
    }

    public function offsetExists($offset) {
        return isset($this->container[$offset]);
    }

    public function offsetUnset($offset) {
        unset($this->container[$offset]);
    }

    public function offsetGet($offset) {
        return isset($this->container[$offset]) ? $this->container[$offset] : null;
    }
    
    // Iterator
    public function rewind() {
        reset($this->container);
    }

    public function current() {
        return current($this->container);
    }

    public function key() {
        return key($this->container);
    }

    public function next() {
        return next($this->container);
    }

    public function valid() {
        return key($this->container) !== null;
    }
    
}