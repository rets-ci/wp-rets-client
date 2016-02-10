<?php
/**
 * Front-end Actions
 *
 * @package     EDD
 * @subpackage  Functions
 * @copyright   Copyright (c) 2015, Pippin Williamson
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0.8.1
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Hooks EDD actions, when present in the $_GET superglobal. Every edd_action
 * present in $_GET is called using WordPress's do_action function. These
 * functions are called on init.
 *
 * @since 1.0
 * @return void
*/
add_action('init', 'tcmp_do_action');
function tcmp_do_action() {
    global $tcmp;

	if (isset($tcmp) && isset($tcmp->Utils) && $tcmp->Utils->qs('tcmp_action')) {
        $args=array_merge($_GET, $_POST, $_COOKIE, $_SERVER);
        $name='tcmp_'.$tcmp->Utils->qs('tcmp_action');
        if(has_action($name)) {
            $tcmp->Log->debug('EXECUTING ACTION=%s', $name);
            do_action($name, $args);
        } elseif(function_exists($name)) {
            $tcmp->Log->debug('EXECUTING FUNCTION=%s DATA=%s', $name, $args);
            call_user_func($name, $args);
        } elseif(strpos($tcmp->Utils->qs('tcmp_action'), '_')!==FALSE) {
            $pos=strpos($tcmp->Utils->qs('tcmp_action'), '_');
            $what=substr($tcmp->Utils->qs('tcmp_action'), 0, $pos);
            $function=substr($tcmp->Utils->qs('tcmp_action'), $pos+1);

            $class=NULL;
            switch (strtolower($what)) {
                case 'manager':
                    $class=$tcmp->Manager;
                    break;
                case 'license':
                    $class=$tcmp->License;
                    break;
                case 'cron':
                    $class=$tcmp->Cron;
                    break;
                case 'tracking':
                    $class=$tcmp->Tracking;
                    break;
                case 'properties':
                    $class=$tcmp->Options;
                    break;
            }

            if(!$class) {
                $tcmp->Log->fatal('NO CLASS FOR=%s IN ACTION=%s', $what, $tcmp->Utils->qs('tcmp_action'));
            } elseif(!method_exists ($class, $function)) {
                $tcmp->Log->fatal('NO METHOD FOR=%s IN CLASS=%s IN ACTION=%s', $function, $what, $tcmp->Utils->qs('tcmp_action'));
            } else {
                $tcmp->Log->debug('METHOD=%s OF CLASS=%s', $function, $what);
                call_user_func(array($class, $function), $args);
            }
        } else {
            $tcmp->Log->fatal('NO FUNCTION FOR==%s', $tcmp->Utils->qs('tcmp_action'));
        }
	}
}
