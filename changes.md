#### 0.3.6
* Added removing of all property attachments on property delete.
* Fixed the bug related to managing of WPP taxonomies.

#### 0.3.5
* Added flushing of cache object to all API endpoints which are managing property data (add/update/delete).
* Fixed `wpp.trashProperty`. There were different issues because of setting of trash status directly via SQL query.
* Fixed triggering of ElasticPress sync events on `wpp.deleteProperty`, `wpp.updateProperty` API requests.

#### 0.3.4
* Added WP-Property Agent matching for rets.ci listings based on [rets_id] user meta field.
* Added automatic creation of non-existing WPP attributes and WPP taxonomies on listing creation/updating if specific options enabled. 
* Added `insert_term` and `insert_terms` methods to Utility class to be used if WP-Property version with methods not available. Fixes issues with wp-property v2.2.0.2.
* Added `wrc_property_published` handler for updating published properties in a standard way.
 
#### 0.3.2
* Added `insert_media` API/RPC endpoints and improved `insert_media` utility method to wipe all old attachments.
* Allowing manual override of `ud_site_id` and `ud_site_secret_token` via constants.
* Improved support for invoking `get_schedule_listings` via wp-rets or xmlrpc.
* Added option to `skipTermCounting` when doing `wpp.editProperty`
* Changed `wpp.scheduleStats` to returns counts of only published, private and future listings. 
* Added `wpp.trashProperty` method for quicker removal.

#### 0.3.1
* Added [/wp-json/wp-rets-client/v1/systemPing] and [/wp-json/wp-rets-client/v1/getProperty] endpoints.
* Added [/wp-json/wp-rets-client/v1/scheduleListings] endpoint and [wpp.scheduleListings] xml-rpc handler.
* Added [/wp-json/wp-rets-client/v1/scheduleStats] endpoint and [wpp.scheduleStats] xml-rpc handler.
* Added [/wp-json/wp-rets-client/v1/cleanup/status] and [/wp-json/wp-rets-client/v1/cleanup/process] endpoints.

#### 0.3.0
* Updating site registration to use [usabilitydynamics/lib-wp-saas-util].

#### 0.2.1
* Added changes.md
