=== Plugin Name ===
Contributors: StephenCronin
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=sjc@scratch99.com&currency_code=&amount=&return=&item_name=WP-FixDuplicates
Tags: duplicates, find duplicates, fix duplicates, duplicate posts, user submitted posts, classifieds
Requires at least: 2.8.0
Tested up to: 4.2.2
Stable tag: 1.0.3
Find and delete duplicates posts. There are extensions that allow you find posts with similar content, redirect duplicates to the post you are keeping, etc.

== Description ==
Do you run a site with user submitted content? Do users submit the same post again and again? Use the [Fix Duplicates plugin](http://scratch99.com/products/fix-duplicates/) to find and delete duplicate posts. 

There is also a paid [Redirection extension](http://scratch99.com/products/fix-duplicates/redirection/) that preserves the link equity of removed duplicates by 301 redirecting them to the kept item.

= Warning =
The purpose of this plugin is to delete duplicates. Extensive testing has been carried out, but you should make sure you have a backup of your database, just in case.

= Extensions =
We currently offer the following premium extensions:

* [Redirection](http://scratch99.com/products/fix-duplicates/redirection/): Gives you the ability to 301 redirect any duplicates being deleted, to the one being kept. This helps preserve your link equity, so that PageRank is passed to a single post rather than just being lost. Or to put it simply: Helps with SEO!

= Compatibility =
* This plugin requires WordPress 2.8 or above.
* I am not currently aware of any compatibility issues with any other WordPress plugins.

= Support =
The free version of this plugin is officially not supported, but if you leave a comment on the plugin's support forum, I'll try to help if I can. A much higher level of support is available for customers who purchase one of the premium extensions.

= Disclaimer =
This plugin is released under the [GPL licence](http://www.gnu.org/copyleft/gpl.html). I do not accept any responsibility for any damages or losses, direct or indirect, that may arise from using the plugin or these instructions. This software is provided as is, with absolutely no warranty. Please refer to the full version of the GPL license for more information.

== Installation ==
1. Download the plugin file and unzip it.
1. Upload the `fix-duplicates` folder to the `wp-content/plugins/` folder.
1. Activate the Fix Duplicates plugin within WordPress.

Alternatively, you can install the plugin automatically through the WordPress Admin interface by going to Plugins -> Add New and searching for Fix Duplicates.

== Screenshots ==

1. The main screen where duplicate entries are managed.
2. The main screen where duplicate entries are managed.
3. The premium Redirection extension allows for items being trashed (via the main screen) to be redirected to the item being kept.
4. Success! Items have been trashed and redirected as requested through the premium Redirection extension on the main screen.
5. The redirection management screen, which is part of the premium Redirection extension.

== Changelog ==

= 1.0.3 (12 July 2015) =
* Minor Fix: Prevent PHP warnings from occuring (by checking for the existence of GET variables before use).

= 1.0.2 (7 July 2015) =
* Change: Allow users with the `delete_pages` capability to delete duplicates (instead of admins only).

= 1.0.1 (29 April 2015) =
* Security Fix: properly escape an instance of add_query_arg in order to prevent an XSS vulnerability.

= 1.0 (5 March 2014) =
* Initial Release.
