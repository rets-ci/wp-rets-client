var CronJob = require('cron').CronJob;
var request = require('request');
var util = require('util');
var exec = require('child_process').exec;


/**
 *
 * Executes 'wp retsci update' task
 * every 12 hours
 *
 * It's updating the data tied to RETSCI imports:
 * - updates terms counts
 */
new CronJob({
  //cronTime: '0 */12 * * *', // run every 12 hours
  cronTime: '*/5 * * * *',
  start: true,
  timeZone: 'America/New_York',
  onTick: function() {

    console.log('[%s] Updating data tied to RETSCI', getDateTime());

    exec('wp retsci update', execCallback );

  }
});

/**
 * Exec Callback
 *
 * @param error
 * @param stdout
 * @param stderr
 */
function execCallback(error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
}


/**
 * Get Timestamp for log.
 *
 * @returns {string}
 */
function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}