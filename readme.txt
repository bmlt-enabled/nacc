=== NACC WordPress Plugin ===

Contributors: magblogapi, bmltenabled, pjaudiomv
Plugin URI: https://wordpress.org/plugins/nacc-wordpress-plugin/
Tags: na, cleantime calculator, nacc, recovery, addiction
Requires PHP: 8.0
Tested up to: 6.7
Stable tag: 4.2.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This is a WordPress plugin implementation of the N.A. Cleantime Calculator.

== Description ==

This is a WordPress plugin implementation of the N.A. Cleantime Calculator.
To use this, specify [nacc] in your text code.
That text will be replaced with this cleantime calculator.

== Installation ==

1. Upload `the nacc` directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Add [nacc] shortcode to your WordPress page/post.
4. You can change the plugin settings either in the the wordpress dashboard under Settings->NACC or using shortcode attributes as explained below.
5. You can change how the plugin appears like so: `[nacc theme="NACC-BT"]`, where `theme` is currently `NACC-BT` (Dark blue and white), `NACC-GNYR2` (Light blue style customized for the Greater New York Region), or "NACC-HOLI" (Black and Red, customized for the Heart of Long Island ASC). Leave it out for default (gray).
6. You can change the language like so: `[nacc lang="es"]`, where `lang` is currently `en` (English -Default), `es` (Spanish), `zh-Hans` (Simplified Chinese), `zh-Hant` (Traditional Chinese), or `it` (Italian).
7. You can specify which layout (vertical or horizontal) you want the tags to appear in by default, like so: `[nacc layout="tabular"]`, where `layout` is `linear` (default, in a long line), or `tabular` (In a horizontal row).
8. You can specify whether the "special" tags are shown, like so: `[nacc special="1"]`, where `special` is `1` for true or `0` for false.

== Changelog ==

= 4.2.0 =

* WP Cleanups for sanitization and escaping.

= 4.1.0 =

* Cleaned up code for WP best practices.

= 4.0.5 =

* Added SEZF theme.

= 4.0.4 =

* More fixes for Italiano translation.

= 4.0.3 =

* Small fix for Italiano translations.

= 4.0.2 =

* Add Italiano to setting language dropdown.

= 4.0.1 =

* Fix for initializing NACC on pages which don't contain shortcode.

= 4.0.0 =

* Note if you are using double square brackets [[nacc]], you will want to move to just one [nacc].
* Now supports standard WordPress shortcodes and attributes [nacc].
* Added Settings Menu to WordPress dashboard.
* Refactored codebase.

= 3.1.7 =
* Fix Additional PHP warning.

= 3.1.6 =
* Fix PHP warning.

= 3.1.5 =
* January 2, 2021
* Version bump.

= 3.1.4 =
* January 20, 2020
* Added CSS to center align the legend by default.

= 3.1.3 =
* November 5, 2019
* Fixed a bug in shortcode setup.

= 3.1.2 =
* November 4, 2019
* Fixed a bug in the image directory URI.

= 3.1.1 =
* November 4, 2019
* There was a bug in the Italian translation that was fixed.

= 3.1.0 =
* November 4, 2019
* Added Italian Localization.
* Improved documentation to cover additional parameters.

= 3.0.1 =
* April 6, 2019
* Added a couple of themes.
* Fixed a warning about an unquoted string.

= 3.0.0 =
* ???
* Complete rewrite to support all JavaScript.

= 2.0.10 =
* July 29, 2010
* Fixed a bug that seems to be caused by a JavaScript issue for leap years.
* Added the ability to specify the plugin as standard WP shortcode ([[NACC]]).

= 2.0.9 =
* June 24, 2009
* Fixed some issues in the WordPress plugin that interfered with "pretty permalinks."
* Reconfigured project as a WordPress Plugin Repository project.

= 2.0.8 =
* April 5, 2009
* Fixed another calculation error in the Persian Calendar.

= 2.0.7 =
* March 19, 2009
* Fixed a calculation error in the Persian Calendar.

= 2.0.6 =
* February 6, 2009
* An error would sometimes occur when the current day is in a month, and the given
* day was in a day that would exceed the end day of the month (most easily seen in
* February).

= 2.0.5 =
* October 22, 2008
* Two of the Persian strings were transposed. This has been fixed.

= 2.0.4 =
* October 20, 2008
* Thanks to NA Iran, the Persian calendar is now almost completely localized.

= 2.0.3 =
* July 3, 2008
* Found another bug with "edge dates." It should be fixed.

= 2.0.2 =
* June 16, 2008
* The Persian calendar returned the wrong days of the month. This has been fixed.

= 2.0.1 =
* June 15, 2008
* Fixed some calculation bugs.

= 2.0 =
* June 14, 2008
* Added support for a Persian (Solar) calendar, thanks to NA Iran.

= 1.7.5 =
* June 4, 2008
*T he old bug briefly reappeared. It has been re-quashed.

= 1.7.4 =
* June 4, 2008
* There were reports of issues with 1.7.3. This attempts to address them.

= 1.7.3 =
* June 3, 2008
* Fixed a bug in the main calculator that manifested itself on "edge dates."

= 1.7.2 =
* May 21, 2008
* Fixed a bug in the decades calculator.

= 1.7.1 =
* May 19, 2008
* Fixed a bug in the decades calculator.

= 1.7 =
* May 18, 2008
* Added the Decades tag and also removed the fancy "stripping" we did for JS.

= 1.6.10 =
* January 6, 2008
* Minor JS tweak to improve validation -no big deal.

= 1.6.9 =
* October 7, 2007
* Fixed another date calculation error.

= 1.6.8 =
* October 6, 2007
* Fixed another date calculation error.

= 1.6.7 =
* September 1, 2007
* There were still issues in the date calculations. These should be fixed.

= 1.6.6 =
* September 1, 2007
* There were still issues in the date calculations at edges. These should be fixed.

= 1.6.5 =
* August 31, 2007
* Fixed a second "Last Month of the Year" bug.

= 1.6.4 =
* August 31, 2007
* Fixed a minor "last day of the month" bug.

= 1.6.3 =
* August 11, 2007
* Added a new theme line to the WordPress Plugin code.

= 1.6.2 =
* August 9, 2007
* Fixed minor WAI AA validation issue: nested headings in the <noscript> element were incorrect.

= 1.6.1 =
* July 30, 2007
* Fixed minor issue with iCab 3 browser -NACC_browser () needs to have its return checked for false.

= 1.6.0 =
* July 20, 2007
* Added base param to parseInt() calls
* Changed how private methods/functions are defined
* Reworked anonymous functions for form onsubmit(), reset link onclick(), and change layout link oncick()
* For FillYearSelect(), FillMonthSelect() and FillDaySelect() functions changed "onchange = '';" to "onchange = null;"

= 1.5.11 =
* July 19, 2007
* Added the new "FIPT Correct" tag artwork.

= 1.5.10 =
* July 15, 2007
* Created the documentation, and upped the version number in "nacc.php."

= 1.5.9 =
* July 12, 2007
* CSS Tweak for table top layout
* RenderMessage() and RenderKeyTags() now check to see if their relevant <divs> exist before creating them

= 1.5.8 =
* July 11, 2007
* Improved Peekabo Bug Fix

= 1.5.7 =
* July 11, 2007
* Fixed Peekaboo bug that has cropped up in IE7

= 1.5.6 =
* July 11, 2007
* Reversion back to browser sniffing for IE <=6
* Added browser sniffing function
* Added param to NACC_CleanTime() to hide key tag display
* Converted <img> tags to <span> tags for IE5/6
* Attempt to mitigate IE6 background image not caching issue
* Modified CSS file to support above

= 1.5.5 =
* July 10, 2007
* Slight change to nacc_keytag_img_tabletop style to improve tabletop appearance.
* Temporary change to the code to make up for issue with IE browser detection.

= 1.5.4 =
* July 7, 2007
* Initial documentation.

= 1.5.3 =
* July 7, 2007
* Fixed CSS display bug.

= 1.5.2 =
* July 6, 2007
* Minor optimization tweaks to base CSS.
* Darkened the "shadowed" insets for the "inset" rects.

= 1.5.1 =
* July 6, 2007
* Changed with of wrapper div to 532px
* Fixed bugs in FillYearSelect(), FillMonthSelect() and FillDaySelect()
* Reduced amount of CSS created via DOM to minimal and added it to CSS file
* Removed floating on key tag images

= 1.5.0 =
* July 6, 2007
* Created changelog file
* Redesigned UI
* Changed name of CSS file
* Modified CSS for new UI
* Added rudimentary CSS theme support
* Modified documentation to reflect most changes
* Added more documentation
* Pulled DOM and display code from CalcCleantime() and other functions where it wasn't necessary
* Major reworking of various things to encapsulate stuff
* Modified localization section
* Increased support for multiple languages (except BuildCleantimeMessage() function)
