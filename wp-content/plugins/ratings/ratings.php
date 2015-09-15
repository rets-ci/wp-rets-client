<?php
/*
Plugin Name: Ratings
Plugin URI: ###
Description: Ratings widget - plugin to create Rating widget for website Visitors.
Version: 1.0
Author: Adminisrator
Author URI: ###
*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

if ( ! class_exists( 'Ratings' ) ) {
    class Ratings extends WP_Widget
    {
        public $plugin_name     = 'ratings';
        public $plugin_version  = '1.0';
        public $table_prefix    = 'ratings_';

        public $translate = array(
            'en'    => array(
                'title'                     => 'Widget Title',
                'count_lines'               => 'Count lines for displaying?',
                'line_title'                => 'Line details',
                'line_item_title'           => 'Title',
                'line_item_rate'            => 'Rate',
                'line_item_image'           => 'Image',
                'default_rates'             => 'Default images for rate',

                'vote_page_result'          => 'Rating result',
                'created'                   => 'Created',
                'user_ip'                   => 'User IP',
                'user_browser'              => 'User Browser',
                'referer'                   => 'Referer page',
                'widget'                    => 'Title',
                'rate'                      => 'Rate',
                'count_click'               => 'Count clicks',
                'delete'                    => 'Delete',
                'clear'                     => 'Clear',
                'select_item'               => 'Please, select one item',
            )
        );

        function __construct(){
            $options = array(
                'description' => 'A widget that displays area for voting.',
                'name' => 'Ratings area'
            );
            parent::__construct('Ratings','',$options);

            //js for admin
            add_action( 'sidebar_admin_setup', array( &$this, 'admin_setup' ) );

            //js in frontend
            if ( is_active_widget(false, false, $this->id_base) ) {
                add_action( 'wp_head', array(&$this, 'frontend_wp_head') );
            }
        }

        //ADMIN

        public function admin_setup(){
            $adminJs = plugins_url($this->plugin_name . '/assets/admin.js');
            wp_enqueue_media();
            wp_enqueue_script( 'ratings-widget', $adminJs, array( 'jquery', 'media-upload', 'media-views' ), $this->plugin_version );

            wp_register_style( 'ratings-widget', plugins_url( $this->plugin_name . '/assets/admin.css' ) );
            wp_enqueue_style( 'ratings-widget' );
        }

        public function form($instance){
            $instance['count_lines'] = (empty($instance['count_lines']) ? 1 : (int)$instance['count_lines']);
            $html = $this->getTemplate('form',array(
                'tag_prefix'    => 'ratings_widget_area',
                'instance'      => $instance,
                'defaultImg'    => plugins_url($this->plugin_name . '/assets/no_image.png'),
            ));
            echo $html;
        }

        public function result_page(){
            wp_enqueue_script( 'ratings-widget', plugins_url($this->plugin_name . '/assets/admin.js'), array( 'jquery' ), $this->plugin_version );
            wp_register_style( 'ratings-widget', plugins_url( $this->plugin_name . '/assets/admin.css' ) );
            wp_enqueue_style( 'ratings-widget' );

            //VARS
            $pageMode   = 'box';
            $url        = site_url().'/wp-admin/admin.php?page=ratings';
            $widgetGet  = @$_GET['widget_id'];
            $rateGet    = @(int)$_GET['rate'];
            $formAction = @$_POST['form_action'];
            $item_list  = @$_POST['item_list'];
            $widgetPost = @$_POST['widget_id'];

            //action - list of cotes for rate
            if( !empty($widgetGet) ){
                $widgetGet  = base64_decode(urldecode($widgetGet));
                $pageMode   = 'default';
            }

            //action - delete all votes for rate in widget
            if($formAction == 'delete_group' and !empty($item_list) ){

                //prepare
                $rateValAr = array();
                foreach($item_list as $k_item => $v_item){
                    $v_item = explode('|',$v_item);
                    if( !empty($v_item[0]) ){
                        $rateValAr[$v_item[0]][] = (int)$v_item[1];
                    }
                }

                //delete
                if( !empty($rateValAr) ){
                    foreach($rateValAr as $k_item => $v_item){
                        $this->delete_votes(array('widget_id' => $k_item, 'rate' => $v_item));
                    }
                }
            }

            //action - delete all votes for widget
            if($formAction == 'delete_box' ){
                $this->delete_votes(array('widget_id' => $widgetPost));
            }

            //action - delete votes for widget
            if($formAction == 'delete_vote' and !empty($item_list) ){

                //prepare
                $rateValAr = array();
                foreach($item_list as $k_item => $v_item){
                    $rateValAr[$widgetGet][] = (int)$v_item;
                }

                //delete
                if( !empty($rateValAr) ){
                    foreach($rateValAr as $k_item => $v_item){
                        $this->delete_votes(array('widget_id' => $k_item, 'id' => $v_item));
                    }
                }
            }


            //TEMPLATE
            $html = '';
            if($pageMode == 'group') {
                $list = $this->get_votes(array('mode' => $pageMode, 'widget_id' => $widgetGet));

                $html = $this->getTemplate('result_group',array(
                    'pluginObj'         => &$this,
                    'widgetSettings'    => $this->get_settings(),
                    'list'              => $list,
                    'url'               => $url,
                ));
            }
            if($pageMode == 'box') {
                $list = $this->get_votes(array('mode' => $pageMode, 'widget_id' => $widgetGet));
                $html = $this->getTemplate('result_box',array(
                    'pluginObj'         => &$this,
                    'widgetSettings'    => $this->get_settings(),
                    'list'              => $list,
                    'url'               => $url,
                ));
            }
            if($pageMode == 'default') {
                $list = $this->get_votes(array('mode' => $pageMode, 'widget_id' => $widgetGet, 'rate' => $rateGet));
                $html = $this->getTemplate('result_list',array(
                    'pluginObj'         => &$this,
                    'widgetSettings'    => $this->get_settings(),
                    'list'              => $list,
                    'url'               => $url,
                ));
            }

            echo $html;
        }

        public function draw_menu(){
            add_menu_page('Ratings', 'Ratings', 'manage_options', 'ratings', array(&$this, 'result_page'), '', 1);
        }

        //FRONTEND

        public function frontend_wp_head(){
            wp_enqueue_script( 'ratings-widget', plugins_url($this->plugin_name . '/assets/ratings.js'), array( 'jquery'), $this->plugin_version );

            wp_register_style( 'ratings-widget', plugins_url( $this->plugin_name . '/assets/ratings.css' ) );
            wp_enqueue_style( 'ratings-widget' );
        }

        public function widget($args, $instance){
            $instance['count_lines'] = (empty($instance['count_lines']) ? 1 : (int)$instance['count_lines']);

            //check if user vote early
            $ip         = $this->getUserIP();
            $widget_id  = $args['widget_id'];
            $votes      = $this->get_votes(array('widget_id' => $widget_id, 'ip' => $ip));
            $html       = '';

            if( empty($votes) ){
                $html = $this->getTemplate('widget',array(
                    'tag_prefix'    => 'ratings_area',
                    'args'          => $args,
                    'instance'      => $instance
                ));
            }

            echo $html;
        }

        public function js_process(){
            $mode           = @$_POST['mode'];
            $ip             = $this->getUserIP();
            $browser        = @$_SERVER['HTTP_USER_AGENT'];
            $rate           = @(int)$_POST['rate'];
            $referer        = @(string)strip_tags($_POST['referer']);
            $widget_id      = @(string)strip_tags($_POST['widget_id']);
            $created        = date('Y-m-d H:i:s');

            if( $mode == 'click' ){
                //check if user vote early
                $votes = $this->get_votes(array('widget_id' => $widget_id, 'ip' => $ip));
                if( empty($votes) ){
                    $addRes = $this->add_vote($ip, $browser, $rate, $referer, $widget_id, $created);
                    print json_encode(array('result' => $addRes));exit;
                }
            }
        }

        //DB

        public function add_vote($ip, $browser, $rate, $referer, $widget_id, $created){
            global $wpdb;

            $created = ( empty($created) ? date('Y-m-d H:i:s') : $created);

            $sql =  $wpdb->prepare(
                'INSERT INTO `'.$wpdb->base_prefix.$this->table_prefix.'result` SET
                    user_ip = %s,
                    user_browser = %s,
                    rate = %s,
                    referer = %s,
                    widget_id = %s,
                    created = %s
                ',
                $ip, $browser, $rate, $referer, $widget_id, $created
            );
            return $wpdb->query( $sql );
        }

        public function get_votes($parameters = array()){
            global $wpdb;

            $list = array();

            $mode = (empty($parameters['mode']) ? 'default' : $parameters['mode']);
            $limit = (empty($parameters['limit']) ? 50 : $parameters['limit']);
            $limit_start = (empty($parameters['limit_start']) ? 0 : $parameters['limit_start']);

            $whereAr = array();
            if( !empty($parameters['widget_id']) ){
                $whereAr['widget_id'] = 'widget_id = "'.$wpdb->_escape($parameters['widget_id']).'"';
            }
            if( !empty($parameters['ip']) ){
                $whereAr['ip'] = 'user_ip = "'.$wpdb->_escape($parameters['ip']).'"';
            }
            if( isset($parameters['rate']) and !is_null($parameters['rate']) ){
                $whereAr['rate'] = 'rate = '.(int)$parameters['rate'];
            }
            $where = ( !empty($whereAr) ? ' WHERE '.implode(' AND ',$whereAr) : '');

            if ($mode == 'default') {
                $sql = '
                    SELECT * FROM  `' . $wpdb->base_prefix . $this->table_prefix . 'result`
                    '.$where.'
                    ORDER BY
                        created DESC
                ';
                $list = $wpdb->get_results($sql);
            }

            if ($mode == 'group') {
                $sql = '
                    SELECT *, COUNT(*) AS count_lines FROM  `' . $wpdb->base_prefix . $this->table_prefix . 'result`
                    '.$where.'
                    GROUP BY widget_id, rate
                    ORDER BY
                        widget_id ASC, rate ASC
                ';
                $list = $wpdb->get_results($sql);
            }

            if ($mode == 'box') {
                $sql = '
                    SELECT *, COUNT(*) AS count_clicks FROM  `' . $wpdb->base_prefix . $this->table_prefix . 'result`
                    '.$where.'
                    GROUP BY widget_id, rate
                    ORDER BY
                        widget_id ASC, rate ASC
                ';
                $list = $wpdb->get_results($sql);
                if(!empty($list)){
                    $listTmp = array();
                    foreach($list as $k_item => $v_item){
                        $listTmp[$v_item->widget_id][$v_item->rate] = $v_item;
                    }
                    $list = $listTmp;
                }
            }

            return $list;
        }

        public function delete_votes($parameters = array()){
            global $wpdb;

            $whereAr = array();
            if( !empty($parameters['widget_id']) ){
                $whereAr['widget_id'] = 'widget_id = "'.$wpdb->_escape($parameters['widget_id']).'"';
            }
            if( !empty($parameters['rate']) ){
                $whereAr['rate'] = 'rate IN('.implode(',',$wpdb->_escape($parameters['rate'])).')';
            }
            if( !empty($parameters['id']) ){
                $whereAr['id'] = 'id IN('.implode(',',$wpdb->_escape($parameters['id'])).')';
            }
            $where = ( !empty($whereAr) ? ' WHERE '.implode(' AND ',$whereAr) : '');

            $sql = 'DELETE FROM  `' . $wpdb->base_prefix . $this->table_prefix . 'result` '.$where.'';
            $wpdb->query( $sql );
            return true;
        }

        //HELPER

        public function getTemplate($template, $vars = array()){
            $path = dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR;

            $html           = '';
            $templateFile   = $path.$template.'.php';
            if(file_exists($templateFile)){
                ob_start();
                include $templateFile;
                $html = ob_get_contents();
                ob_clean();
            }
            return $html;
        }

        public function getUserIP(){
            $user_ip = '';
            if ( getenv('REMOTE_ADDR') ){$user_ip = getenv('REMOTE_ADDR');}
            elseif ( getenv('HTTP_FORWARDED_FOR') ){$user_ip = getenv('HTTP_FORWARDED_FOR');}
            elseif ( getenv('HTTP_X_FORWARDED_FOR') ){$user_ip = getenv('HTTP_X_FORWARDED_FOR');}
            elseif ( getenv('HTTP_X_COMING_FROM') ){$user_ip = getenv('HTTP_X_COMING_FROM');}
            elseif ( getenv('HTTP_VIA') ){$user_ip = getenv('HTTP_VIA');}
            elseif ( getenv('HTTP_XROXY_CONNECTION') ){$user_ip = getenv('HTTP_XROXY_CONNECTION');}
            elseif ( getenv('HTTP_CLIENT_IP') ){$user_ip = getenv('HTTP_CLIENT_IP');}
            $user_ip = trim($user_ip);
            if ( empty($user_ip) ){return '';}
            if ( !preg_match("/^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/", $user_ip) ){return '';}
            return $user_ip;
        }

        function trans($var, $lang = 'en'){
            $text = $var;
            if( isset($this->translate[$lang]) ){
                if( isset($this->translate[$lang][$var]) ){
                    $text = $this->translate[$lang][$var];
                }elseif( isset($this->translate['en'][$var]) ){
                    $text =  $this->translate['en'][$var];
                }
            }

            return $text;
        }


        public function register_widget(){
            register_widget('Ratings');
        }

        /**
         * Activation hook
         * Create table if they don't exist and add plugin options
         */
        public static function install(){
            $pluginObj      = new Ratings();
            $table_prefix   = $pluginObj->table_prefix;

            global $wpdb;

            // Get the correct character collate
            $charset_collate = 'utf8';
            if ( ! empty( $wpdb->charset ) ) {
                $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
            }
            if ( ! empty( $wpdb->collate ) ) {
                $charset_collate .= " COLLATE $wpdb->collate";
            }

            if ( $wpdb->get_var( 'SHOW TABLES LIKE "' . $wpdb->base_prefix.$table_prefix.'result'.'" ' ) != $wpdb->base_prefix.$table_prefix.'result' ) {
                // Setup chat message table
                $sql = '
                    CREATE TABLE IF NOT EXISTS `'.$wpdb->base_prefix.$table_prefix.'result` (
                        `id` int(11) NOT NULL AUTO_INCREMENT,
                        `user_ip` varchar(40) NOT NULL DEFAULT "",
                        `user_browser` varchar(255) NOT NULL DEFAULT "",
                        `rate` int(2) NOT NULL DEFAULT "0",
                        `referer` varchar(255) NOT NULL DEFAULT "",
                        `widget_id` varchar(255) NOT NULL DEFAULT "",
                        `created` datetime DEFAULT NULL,
                        PRIMARY KEY (`id`)
                    ) ENGINE=MyISAM DEFAULT CHARSET='.$charset_collate.' AUTO_INCREMENT=1
                ;';
                $wpdb->query( $sql );
            }else{
                $sql = 'TRUNCATE TABLE `'.$wpdb->base_prefix.$table_prefix.'result`';
                $wpdb->query( $sql );
            }
        }

        /**
         * Deactivation hook
         * Clear table
         */
        public static function deactivation(){
            $pluginObj      = new Ratings();
            $table_prefix   = $pluginObj->table_prefix;
            global $wpdb;

            $sql = 'TRUNCATE TABLE `'.$wpdb->base_prefix.$table_prefix.'result`';
            $wpdb->query($sql);
        }

        /**
         * Uninstall hook
         * Remove table and plugin options
         */
        public static function uninstall(){
            $pluginObj      = new Ratings();
            $table_prefix   = $pluginObj->table_prefix;
            global $wpdb;

            //remove table
            $sql = 'DROP TABLE IF EXISTS `'.$wpdb->base_prefix.$table_prefix.'result`';
            $wpdb->query($sql);
        }
    }
}

$pluginObj      = new Ratings();
add_action('admin_menu', array($pluginObj, 'draw_menu'));
add_action( 'widgets_init', array($pluginObj, 'register_widget') );

//listen incoming request from js
add_action( 'wp_ajax_jsRatingsProcess', array( $pluginObj, 'js_process' ) );
add_action( 'wp_ajax_nopriv_jsRatingsProcess', array( $pluginObj, 'js_process' ) );

//manipulation by environments for plugin
register_activation_hook( __FILE__, array( 'Ratings', 'install' ) );
register_deactivation_hook( __FILE__, array( 'Ratings', 'deactivation' ) );
register_uninstall_hook( __FILE__, array( 'Ratings', 'uninstall' ) );