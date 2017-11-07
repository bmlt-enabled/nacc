=== NACC WordPress Plugin 2 ===
Contributors: magblogapi
Tags: na, cleantime calculator, nacc, recovery, addiction, webservant
Requires at least: 2.0
Tested up to: 4.7
Stable tag: 3.0.0

== Description ==

This is a WordPress plugin implementation of the N.A. Cleantime Calculator.
To use this, specify <!-- NACC --> in your text code.
That text will be replaced with this cleantime calculator.

== Installation ==

1. Upload `the nacc` directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Place `<!-- NACC -->`in the HTML view, or `[[NACC]]` in either view, of a page. It will be replaced by the plugin.

== Screenshots ==

1. The initial screen
2. The vertical tag layout
3. The horizontal tag layout

== Changelog ==

Version 3.0.0- TBD
	Complete rewrite to support all JavaScript.

Version 2.0.10- July 29, 2010
	Fixed a bug that seems to be caused by a JavaScript issue for leap years.
	Added the ability to specify the plugin as standard WP shortcode ([[NACC]]).

Version 2.0.9- June 24, 2009
	Fixed some issues in the WordPress plugin that interfered with "pretty permalinks."
	Reconfigured project as a WordPress Plugin Repository project.
	
Version 2.0.8- April 5, 2009
	Fixed another calculation error in the Persian Calendar.
	
Version 2.0.7- March 19, 2009
	Fixed a calculation error in the Persian Calendar.
	
Version 2.0.6- February 6, 2009
	An error would sometimes occur when the current day is in a month, and the given
	day was in a day that would exceed the end day of the month (most easily seen in
	February).
	
Version 2.0.5- October 22, 2008
	Two of the Persian strings were transposed. This has been fixed.
	
Version 2.0.4- October 20, 2008
	Thanks to NA Iran, the Persian calendar is now almost completely localized.
	
Version 2.0.3- July 3, 2008
	Found another bug with "edge dates." It should be fixed.
	
Version 2.0.2- June 16, 2008
	The Persian calendar returned the wrong days of the month. This has been fixed.
	
Version 2.0.1- June 15, 2008
	Fixed some calculation bugs.
	
Version 2.0- June 14, 2008
	Added support for a Persian (Solar) calendar, thanks to NA Iran.
	
Version 1.7.5- June 4, 2008
    The old bug briefly reappeared. It has been re-quashed.
    
Version 1.7.4- June 4, 2008
    There were reports of issues with 1.7.3. This attempts to address them.
    
Version 1.7.3- June 3, 2008
    Fixed a bug in the main calculator that manifested itself on "edge dates."
    
Version 1.7.2- May 21, 2008
    Fixed a bug in the decades calculator.
    
Version 1.7.1- May 19, 2008
    Fixed a bug in the decades calculator.
    
Version 1.7- May 18, 2008
    Added the Decades tag and also removed the fancy "stripping" we did for JS.
    
Version 1.6.10- January 6, 2008
    Minor JS tweak to improve validation -no big deal.
    
Version 1.6.9- October 7, 2007
    Fixed another date calculation error.
    
Version 1.6.8- October 6, 2007
    Fixed another date calculation error.
    
Version 1.6.7- September 1, 2007
    There were still issues in the date calculations. These should be fixed.
    
Version 1.6.6- September 1, 2007
    There were still issues in the date calculations at edges. These should be fixed.
    
Version 1.6.5- August 31, 2007
    Fixed a second "Last Month of the Year" bug.
    
Version 1.6.4- August 31, 2007
    Fixed a minor "last day of the month" bug.
    
Version 1.6.3- August 11, 2007
    Added a new theme line to the WordPress Plugin code.
    
Version 1.6.2- August 9, 2007
    Fixed minor WAI AA validation issue: nested headings in the <noscript> element were incorrect.
    
Version 1.6.1- July 30, 2007
    Fixed minor issue with iCab 3 browser -NACC_browser () needs to have its return checked for false.
    
Version 1.6.0- July 20, 2007
	Added base param to parseInt() calls
	Changed how private methods/functions are defined
	Reworked anonymous functions for form onsubmit(), reset link onclick(), and change layout link oncick()
	For FillYearSelect(), FillMonthSelect() and FillDaySelect() functions changed "onchange = '';" to "onchange = null;"

Version 1.5.11- July 19, 2007
	Added the new "FIPT Correct" tag artwork.
	
Version 1.5.10- July 15, 2007
	Created the documentation, and upped the version number in "nacc.php."

Version 1.5.9- July 12, 2007
	CSS Tweak for table top layout
	RenderMessage() and RenderKeyTags() now check to see if their relevant <divs> exist before creating them

Version 1.5.8- July 11, 2007
	Improved Peekabo Bug Fix

Version 1.5.7- July 11, 2007
	Fixed Peekaboo bug that has cropped up in IE7

Version 1.5.6- July 11, 2007
	Reversion back to browser sniffing for IE <=6
	Added browser sniffing function
	Added param to NACC_CleanTime() to hide key tag display
	Converted <img> tags to <span> tags for IE5/6
	Attempt to mitigate IE6 background image not caching issue
	Modified CSS file to support above

Version 1.5.5- July 10, 2007
	Slight change to nacc_keytag_img_tabletop style to improve tabletop appearance.
	Temporary change to the code to make up for issue with IE browser detection.

Version 1.5.4- July 7, 2007
	Initial documentation.

Version 1.5.3- July 7, 2007
	Fixed CSS display bug.

Version 1.5.2- July 6, 2007
	Minor optimization tweaks to base CSS.
	Darkened the "shadowed" insets for the "inset" rects.

Version 1.5.1- July 6, 2007
	Changed with of wrapper div to 532px
	Fixed bugs in FillYearSelect(), FillMonthSelect() and FillDaySelect()
	Reduced amount of CSS created via DOM to minimal and added it to CSS file
	Removed floating on key tag images

Version 1.5.0- July 6, 2007
	Created changelog file
	Redesigned UI
	Changed name of CSS file
	Modified CSS for new UI
	Added rudimentary CSS theme support
	Modified documentation to reflect most changes
	Added more documentation
	Pulled DOM and display code from CalcCleantime() and other functions where it wasn't necessary
	Major reworking of various things to encapsulate stuff
	Modified localization section
	Increased support for multiple languages (except BuildCleantimeMessage() function)
