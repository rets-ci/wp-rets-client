<?php
/*
UpdraftPlus Addon: fixtime:Time and Scheduling
Description: Allows you to specify the exact time at which backups will run, and create more complex retention rules
Version: 1.6
Shop: /shop/fix-time/
Latest Change: 1.11.7
*/

// TODO: Add a link to help
// TODO: Edit product page
// TODO: Also delete auto-backups if we're past any rule.

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

$updraftplus_addon_fixtime = new UpdraftPlus_AddOn_FixTime;

class UpdraftPlus_AddOn_FixTime {

	public function __construct() {
		add_filter('updraftplus_schedule_firsttime_files', array($this, 'starttime_files'));
		add_filter('updraftplus_schedule_firsttime_db', array($this, 'starttime_db'));
		add_filter('updraftplus_schedule_showfileopts', array($this, 'schedule_showfileopts'), 10, 2);
		add_filter('updraftplus_schedule_showdbopts', array($this, 'schedule_showdbopts'), 10, 2);
		add_filter('updraftplus_fixtime_ftinfo', array($this, 'return_empty_string'));
		add_filter('updraftplus_schedule_sametimemsg', array($this, 'schedule_sametimemsg'));

		// Retention rules
		add_action('updraftplus_after_filesconfig', array($this, 'after_filesconfig'));
		add_action('updraftplus_after_dbconfig', array($this, 'after_dbconfig'));
		add_filter('updraftplus_prune_or_not', array($this, 'prune_or_not'), 10, 3);

	}

	// Backup sets will get run through this filter in age order (most recent first)
	public function prune_or_not($prune_it, $type, $backup_datestamp) {

		$debug = UpdraftPlus_Options::get_updraft_option('updraft_debug_mode');

		static $last_backup_seen_at = array();
		static $last_relevant_backup_kept_at = array();

		if (empty($last_backup_seen_at)) $last_backup_seen_at = array('db' => false, 'files' => false);
		if (empty($last_relevant_backup_kept_at)) $last_relevant_backup_kept_at = array('db' => false, 'files' => false);

		global $updraftplus;

		$wp_cron_unreliability_margin = (defined('UPDRAFTPLUS_PRUNE_MARGIN') && is_numeric(UPDRAFTPLUS_PRUNE_MARGIN)) ? UPDRAFTPLUS_PRUNE_MARGIN : 900;

		if ($debug) $updraftplus->log("dbprune examine: $backup_datestamp, entry_prune_it=$prune_it", 'debug');
		// If it's already being pruned, then we have nothing to do
		if ($prune_it) {
			$last_backup_seen_at[$type] = $backup_datestamp;
			return $prune_it;
		}

		$backup_run_time = $updraftplus->backup_time;

		static $retain_extrarules = false;
		if (!is_array($retain_extrarules)) {
			$retain_extrarules = UpdraftPlus_Options::get_updraft_option('updraft_retain_extrarules');
			if (!is_array($retain_extrarules)) $retain_extrarules = array();
			if (!isset($retain_extrarules['db'])) $retain_extrarules['db'] = array();
			if (!isset($retain_extrarules['files'])) $retain_extrarules['files'] = array();
			$db = $retain_extrarules['db'];
			$files = $retain_extrarules['files'];
			uasort($db, array($this, 'soonest_first'));
			uasort($files, array($this, 'soonest_first'));
			$retain_extrarules['db'] = $db;
			$retain_extrarules['files'] = $files;
		}

		$extra_rules = (is_array($retain_extrarules) && isset($retain_extrarules[$type])) ? $retain_extrarules[$type] : array();

		// We add on 15 minutes so that the vagaries of WP's cron system are less likely to intervene - backups that ran up to 10 minutes later than the exact time will be included
		$backup_age = $backup_run_time - $backup_datestamp + $wp_cron_unreliability_margin;

		// Find the relevant rule at this stage
		$latest_relevant_index = false;
		foreach ($extra_rules as $i => $rule) {
			// Drop broken rules
			if (!is_array($rule) || !isset($rule['after-howmany']) || !isset($rule['after-period']) || !isset($rule['every-howmany']) || !isset($rule['every-period'])) continue;
			$after_howmany = $rule['after-howmany'];
			$after_period = $rule['after-period'];
			if (!is_numeric($after_howmany) || $after_howmany < 0) continue;
			if ($after_period <3600) $after_period = 3600;
			$every_howmany = $rule['every-howmany'];
			$every_period = $rule['every-period'];
			if (!is_numeric($every_howmany) || $every_howmany < 1) continue;
			if ($every_period <3600) $every_period = 3600;
			// Finally, get the times in seconds
			$after_time = $after_howmany * $after_period;
			if ($backup_age > $after_time) {
				$latest_relevant_index = $i;
			}
		}

		if ($debug) $updraftplus->log("latest_relevant_index: $latest_relevant_index", 'debug');

		if (false === $latest_relevant_index) {
			// There are no rules which apply to this backup (it's not old enough)
			$last_backup_seen_at[$type] = $backup_datestamp;
			return false;
		}

		if ($debug) $updraftplus->log("last_relevant_backup_kept_at=$last_relevant_backup_kept_at[$type]: last_relevant_backup_kept_at=$last_relevant_backup_kept_at", 'debug');

		// Is this the first relevant (i.e. old enough) backup we've come across?
		if (!$last_backup_seen_at[$type] || !$last_relevant_backup_kept_at[$type]) {
			$last_backup_seen_at[$type] = $backup_datestamp;
			$last_relevant_backup_kept_at[$type] = $backup_datestamp;
			return false;
		}


		$rule = $extra_rules[$latest_relevant_index];

		$every_time = $rule['every-howmany'] * $rule['every-period'];

		// At this stage, we know that the backup's age is relevant to the rule, and that a previous old-enough backup has been kept. Now we just need to kept the time between them.

		$time_from_backup_to_last_kept = $last_relevant_backup_kept_at[$type] - $backup_datestamp;

		if ($debug) $updraftplus->log("time_from_backup_to_last_kept=$time_from_backup_to_last_kept", 'debug');

		// Again, apply a 15-minute margin
		if ($time_from_backup_to_last_kept > $every_time - $wp_cron_unreliability_margin) {
			// Keep it - enough time has passed
			$last_backup_seen_at[$type] = $backup_datestamp;
			$last_relevant_backup_kept_at[$type] = $backup_datestamp;
			return false;
		}

		if ($debug) $updraftplus->log("Will prune ($type): backup is older than ".$rule['after-howmany']." periods of ".$rule['after-period']." s, and a backup ".$time_from_backup_to_last_kept." s more recent was kept (which is less than the configured ".$rule['every-howmany']." periods of ".$rule['every-period']." s = ".$every_time." s)", 'debug');

		$last_backup_seen_at[$type] = $backup_datestamp;

		return true;

	}

	// WP 3.7+ has __return_empty_string() - but we support 3.2+
	public function return_empty_string($x) { return ''; }

	public function after_dbconfig() {
		echo '<div id="updraft_retain_db_rules" style="float:left;clear:both;"></div><div style="float:left;clear:both;"><a href="#" id="updraft_retain_db_addnew">'.__('Add an additional retention rule...', 'updraftplus').'</a></div>';
	}

	public function after_filesconfig() {
		add_action('admin_footer', array($this, 'admin_footer_extraretain_js'));
		echo '<div id="updraft_retain_files_rules" style="float:left;clear:both;"></div><div style="float:left;clear:both;"><a href="#" id="updraft_retain_files_addnew">'.__('Add an additional retention rule...', 'updraftplus').'</a></div>';
	}

	public function soonest_first($a, $b) {
		if (!is_array($a)) {
			if (!is_array($b)) return 0;
			return 1;
		} elseif (!is_array($b)) {
			return -1;
		}
		$after_howmany_a = isset($a['after-howmany']) ? absint($a['after-howmany']) : 0;
		$after_howmany_b = isset($b['after-howmany']) ? absint($b['after-howmany']) : 0;
		$after_period_a = isset($a['after-period']) ? absint($a['after-period']) : 0;
		$after_period_b = isset($b['after-period']) ? absint($b['after-period']) : 0;
		$after_a = $after_howmany_a * $after_period_a;
		$after_b = $after_howmany_b * $after_period_b;
		if ($after_a == $after_b) return 0;
		return ($after_a < $after_b) ? -1 : 1;
	}

	public function admin_footer_extraretain_js() {
		$extra_rules = UpdraftPlus_Options::get_updraft_option('updraft_retain_extrarules');
		if (!is_array($extra_rules)) $extra_rules = array();
		?>
		<script>
		jQuery(document).ready(function() {
			var db_index = 0;
			var files_index = 0;
			<?php
				if (isset($extra_rules['files']) && is_array($extra_rules['files'])) {
					$this->javascript_print_retain_rules($extra_rules['files'], 'files');
				}
				if (isset($extra_rules['db']) && is_array($extra_rules['db'])) {
					$this->javascript_print_retain_rules($extra_rules['db'], 'db');
				}
			?>
			jQuery('#updraft_retain_db_addnew').click(function(e) {
				e.preventDefault();
				add_rule('db', db_index, 12, 2419200, 1, 2419200);
			});
			jQuery('#updraft_retain_files_addnew').click(function(e) {
				e.preventDefault();
				add_rule('files', files_index, 12, 2419200, 1, 2419200);
			});
			jQuery('#updraft_retain_db_rules, #updraft_retain_files_rules').on('click', '.updraft_retain_rules_delete', function() {
				jQuery(this).parent('.updraft_retain_rules').slideUp(function() {jQuery(this).remove();});
			});
			function add_rule(type, index, howmany_after, period_after, howmany_every, period_every) {
				var selector = 'updraft_retain_'+type+'_rules';
				if ('db' == type) {
					db_index = index + 1;
				} else {
					files_index = index + 1;
				}
				jQuery('#'+selector).append(
					'<div style="float:left; clear:left;" class="updraft_retain_rules '+selector+'_entry">'+
					updraftlion.forbackupsolderthan+' '+rule_period_selector(type, index, 'after', howmany_after, period_after)+' keep no more than 1 backup every '+rule_period_selector(type, index, 'every', howmany_every, period_every)+
					' <span title="'+updraftlion.deletebutton+'" class="updraft_retain_rules_delete">X</span></div>'
				)
			}
			function rule_period_selector(type, index, which, howmany_value, period) {
				var nameprefix = "updraft_retain_extrarules["+type+"]["+index+"]["+which+"-";
				var ret = '<input type="number" min="1" step="1" style="width:48px;" name="'+nameprefix+'howmany]" value="'+howmany_value+'"> \
				<select name="'+nameprefix+'period]">\
				<option value="3600"';
				if (period == 3600) { ret += ' selected="selected"'; }
				ret += '>'+updraftlion.hours+'</option>\
				<option value="86400"';
				if (period == 86400) { ret += ' selected="selected"'; }
				ret += '>'+updraftlion.days+'</option>\
				<option value="2419200"';
				if (period == 2419200) { ret += ' selected="selected"'; }
				ret += '>'+updraftlion.weeks+'</option>\
				</select>';
				return ret;
			}
		});
		</script>
		<?php
	}

	private function javascript_print_retain_rules($extra_rules, $type) {
		if (!is_array($extra_rules)) return;
		uasort($extra_rules, array($this, 'soonest_first'));
		foreach ($extra_rules as $i => $rule) {
			if (!is_array($rule) || !isset($rule['after-howmany']) || !isset($rule['after-period']) || !isset($rule['every-howmany']) || !isset($rule['every-period'])) continue;
			$after_howmany = $rule['after-howmany'];
			$after_period = $rule['after-period'];
			// Best not to just drop the rule if it is invalid 
			if (!is_numeric($after_howmany) || $after_howmany < 0) continue;
			if ($after_period <3600) $after_period = 3600;
			if ($after_period != 3600 && $after_period != 86400 && $after_period != 2419200) continue;
			$every_howmany = $rule['every-howmany'];
			$every_period = $rule['every-period'];
			// Best not to just drop the rule if it is invalid 
			if (!is_numeric($every_howmany) || $every_howmany < 1) continue;
			if ($every_period <3600) $every_period = 3600;
			if ($every_period != 3600 && $every_period != 86400 && $every_period != 2419200) continue;
			echo "add_rule('$type', $i, $after_howmany, $after_period, $every_howmany, $every_period);\n";
		}
	}

	public function schedule_sametimemsg() {
		return htmlspecialchars(__('(at same time as files backup)', 'updraftplus'));
	}

	public function starttime_files($val) {
		return $this->compute('files');
	}

	public function starttime_db($val) {
		return $this->compute('db');
	}

	private function parse($start_time) {
		preg_match("/^(\d+):(\d+)$/", $start_time, $matches);
		if (empty($matches[1]) || !is_numeric($matches[1]) || $matches[1]>23) {
			$start_hour = 0;
		} else {
			$start_hour = (int)$matches[1];
		}
		if (empty($matches[2]) || !is_numeric($matches[2]) || $matches[1]>59) {
			$start_minute = 5;
			if ($start_minute>60) {
				$start_minute = $start_minute-60;
				$start_hour++;
				if ($start_hour>23) $start_hour=0;
			}
		} else {
			$start_minute = (int)$matches[2];
		}
		return array($start_hour, $start_minute);
	}

	private function compute($whichtime) {
		// Returned value should be in UNIX time.

		$unixtime_now = time();
		// Convert to date
		$now_timestring_gmt = gmdate('Y-m-d H:i:s', $unixtime_now);

		// Convert to blog's timezone
		$now_timestring_blogzone = get_date_from_gmt($now_timestring_gmt, 'Y-m-d H:i:s');

		$int_key = ('db' == $whichtime) ? '_database' : '';
		$sched = (isset($_POST['updraft_interval'.$int_key])) ? $_POST['updraft_interval'.$int_key] : 'manual';

		// HH:MM, in blog time zone
		// This function is only called from the options validator, so we don't read the current option
		//$start_time = UpdraftPlus_Options::get_updraft_option('updraft_starttime_'.$whichtime);
		$start_time = (isset($_POST['updraft_starttime_'.$whichtime])) ? $_POST['updraft_starttime_'.$whichtime] : '00:00';

		list ($start_hour, $start_minute) = $this->parse($start_time);

		// Was a particular week-day specified?
		if (isset($_POST['updraft_startday_'.$whichtime]) && ('weekly' == $sched || 'monthly' == $sched || 'fortnightly' == $sched)) {
			// All the monthly stuff is done here, since it has different logic
			if ('monthly' == $sched) {
				// Get specified day of the month in range 1-28
				$startday = min(absint($_POST['updraft_startday_'.$whichtime]), 28);
				if ($startday < 1) $startday = 1;
				// Get today's day of month in range 1-31
// 				$day_today_blogzone = get_date_from_gmt($now_timestring_gmt, 'j');

				$thismonth_timestring = 'Y-m-'.sprintf("%02d", $startday).' '.sprintf("%02d:%02d", $start_hour, $start_minute).':00';

				$thismonth_time = get_date_from_gmt($now_timestring_gmt, $thismonth_timestring);
				$thismonth_unixtime = get_gmt_from_date($thismonth_time, 'U');

				// Is that in the past? If so, then wind on a month.
				if ($thismonth_unixtime < $unixtime_now) {
					return strtotime("@".$thismonth_unixtime." + 1 month");
				} else {
					return $thismonth_unixtime;
				}
			} else {
				// Get specified day of week in range 0-6
				$startday = min(absint($_POST['updraft_startday_'.$whichtime]), 6);
				// Get today's day of week in range 0-6
				$day_today_blogzone = get_date_from_gmt($now_timestring_gmt, 'w');
				if ($day_today_blogzone != $startday) {
					if ($startday<$day_today_blogzone) $startday+=7;
					$new_startdate_unix = $unixtime_now + ($startday-$day_today_blogzone)*86400;
					$now_timestring_blogzone = get_date_from_gmt(gmdate('Y-m-d H:i:s', $new_startdate_unix), 'Y-m-d H:i:s');
				}
			}
		}

		// Now, convert the start time HH:MM from blog time to UNIX time
		$start_time_unix = get_gmt_from_date(substr($now_timestring_blogzone,0,11).sprintf('%02d', $start_hour).':'.sprintf('%02d', $start_minute).':00', 'U');

		// That may have already passed for today
		if ($start_time_unix<time()) {
			if  ('weekly' == $sched || 'fortnightly' == $sched) {
				$start_time_unix = $start_time_unix + 86400*7;
			} elseif ('monthly' == $sched) {
				error_log("This code path is impossible, or so I thought!");
			} else {
				$start_time_unix=$start_time_unix+86400;
			}
		}

		return $start_time_unix;
	}

	private function day_selector($id, $selected_interval = 'manual') {
		global $wp_locale;

		$day_selector = '<select name="'.$id.'" id="'.$id.'">';

		$opt = UpdraftPlus_Options::get_updraft_option($id, 0);

		$start_from = ('monthly' == $selected_interval) ? 1 : 0;
		$go_to = ('monthly' == $selected_interval) ? 28 : 6;

		for ($day_index = $start_from; $day_index <= $go_to; $day_index++) :
			$selected = ($opt == $day_index) ? 'selected="selected"' : '';
			$day_selector .= "\n\t<option value='" . $day_index . "' $selected>";
			$day_selector .= ('monthly' == $selected_interval) ? $day_index : $wp_locale->get_weekday($day_index);
			$day_selector .= '</option>';
		endfor;
		$day_selector .= '</select>';
		return $day_selector;
	}

	public function starting_widget($start_hour, $start_minute, $day_selector_id, $time_selector_id, $selected_interval = 'manual') {
		return __('starting from next time it is','updraftplus').' '.$this->day_selector($day_selector_id, $selected_interval).'<input title="'.__('Enter in format HH:MM (e.g. 14:22).','updraftplus').' '.htmlspecialchars(__('The time zone used is that from your WordPress settings, in Settings -> General.', 'updraftplus')).'" type="text" style="width: 48px;" maxlength="5" name="'.$time_selector_id.'" value="'.sprintf('%02d', $start_hour).':'.sprintf('%02d', $start_minute).'">';
	}

	public function schedule_showdbopts($disp, $selected_interval) {
		$start_time = UpdraftPlus_Options::get_updraft_option('updraft_starttime_db');
		list ($start_hour, $start_minute) = $this->parse($start_time);
		return $this->starting_widget($start_hour, $start_minute, 'updraft_startday_db', 'updraft_starttime_db', $selected_interval);
	}

	public function schedule_showfileopts($disp, $selected_interval) {
		$start_time = UpdraftPlus_Options::get_updraft_option('updraft_starttime_files');
		list ($start_hour, $start_minute) = $this->parse($start_time);
		return $this->starting_widget($start_hour, $start_minute, 'updraft_startday_files', 'updraft_starttime_files', $selected_interval);
	}

}

?>
