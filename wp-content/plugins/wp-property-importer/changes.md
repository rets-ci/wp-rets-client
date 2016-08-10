### 5.1.4 ( July 28, 2016 )
* Compatibility fixes with PHP 5.6
* Alternative Cron fixes added.

### 5.1.3.1 ( June 23, 2016 )
* Fix - critical bug in lib-wp-bootstrap. Library updated to 1.2.1.

### 5.1.3 ( June 23, 2016 )
* Feature - Added support for setting "POST Method" for RETS clients that require it.
* Feature - Added helpful RETS Classification and RETS Query fields to the schedule overview.
* Feature - Added two new dynamic DMQL query tags [yesterday] and [this_week] which can be used to query dynamic dates.
* Fix - Bug with built-in "Country" field not saving when updating mapping for a schedule.
* Fix - Issue with importing images from not-verified SSL sources.
* Dev - Made license/activation nags easier to dismiss, updated lib-wp-bootstrap to 1.2.0

### 5.1.2 ( December 7, 2015 )
* Added ability to enable property comments (inquiries) by default on importing properties.
* Added ability to assign more than one Real Estate Agent to property on importing.
* Added matches functionality for Property Agent field.
* Added 'free_list' inline function for xPath field which allows to set multiple values for attribute via commas.
* Improved "Set the image as the thumbnail" option. Now, it allows to set first or last image as the thumbnail.
* Fixed the issue with checkbox and multi-checkbox attributes on importing properties.
* Fixed duplicated values bug on importing properties.
* Fixed compatibility with Mandrill plugin.

### 5.1.1 ( October 7, 2015 )
* Fixed initialisation logic of plugin.

### 5.1.0 ( September 22, 2015 )
* Added ability to replace values on import with custom values using matches map.

### 5.0.2 ( September 18, 2015 )
* Added warning message near 'Cron Command' section on Schedules overview page in case schedule's ID is not valid and schedule must be re-saved.
* Fixed the bug when attributes were being dropped from Attributes Map.
* Fixed the bug when attributes bulk unchecking did not work on Attributes Map.

### 5.0.1 ( August 6, 2015 )
* Fixed Fatal Error which prevented loading Schedule Settings page.
* Fixed Warnings on running Preview Raw Data which were breaking output and Attribute Map.

### 5.0.0 ( August 3, 2015 )
* Added Cron Manager and UI interface to manage XMLI cron processes.
* Added search filter by XML schedule on All Properties page on admin panel.
* Fixed HTTP response headers to set proper Cache Control on imports. 
* Fixed critical bug on import related to DB connection
* Moved feature to separate plugin.
* Fixed Warnings
