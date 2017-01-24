<?php
/**
 * Basic PHP Check
 *
 * @version 1.0
 * @author potanin@UD
 */
header('cache-control:private');

function convert($size) {
  $unit=array('b','kb','mb','gb','tb','pb');
  return @round($size/pow(1024,($i=floor(log($size,1024)))),2).' '.$unit[$i];
}


die('{"ok":true,"message":"Service is online.","time":"'. time() .'","memory":"'.convert(memory_get_usage(true)).'"}');
