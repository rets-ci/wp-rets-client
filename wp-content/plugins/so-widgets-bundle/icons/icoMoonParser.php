<?php
/**
 * Created by PhpStorm.
 * User: Kavaribes
 * Date: 22.03.2016

 * This script parses icomoons style.css file. On output we have e.g such data: 'home' => '&#xe600;',
 * First element - icon name. In second element instead of symbols '&#x'  applies value of css property 'content'.
 * Then received data we copy/past to file filter.php

 */

$styleFile = file('our styles file');

foreach($styleFile as $key => $value){
  if(preg_match( '/\.icon-([a-z,-]+):before {/', $value, $iconName)){
    preg_match('/([a-z,0-9]+)"/', $styleFile[$key+1], $content);

    echo "'" . $iconName[1] . "' => '&#x" . $content[1] . ";',\n";
  }
}