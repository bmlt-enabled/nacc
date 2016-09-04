DESCRIPTION
===========
This version of the NA Cleantime Calculator has been redesigned from the ground up to be entirely browser-based, which means that no PHP server is required (good for site builders, like [Wix](http://wix.com), [Weebly](http://weebly.com), [Sitebuilder](http://sitebuilder.com) or [SquareSpace](http://squarespace.com)).

It is extremely fast and complete.

The site visitor uses three popup menus to select a clean date, and then they activate a "Calculate" button.

At that point, they are presented with a statement that summarizes their cleantime (how many total days, years, months and days, accounting for the intervening years).

They are also shown a list of the tags they would have earned by now. There are two layout for these tags:

- Linear, in which the tag front (usually a simple NA logo) is displayed.
- Tabular, in which all of the tags are laid out side-by-side, and this layout displays the rear of the tags (with the text).

The NACC is localized. The current version supports only the standard [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar) (so that means it is not useful for Iran).
The tag images are provided for the given localization.

There are a number of new "specialty" tags, for long-term cleantime (like the purple "Decades" tag). The visitor can choose to display these.

[You can see it in action here.](http://littlegreenviper.net/nacc/index.html)

IMPORTANT NOTE
==============
The name "Narcotics Anonymous" and the stylized NA symbol (displayed on the front of the tags) are registered trademarks of [Narcotics Anonymous World Services, Inc. (NAWS)](http://na.org), and cannot be used without [permission from NAWS](http://na.org/?ID=legal-bulletins-fipt). If you are using this Web app as part of a registered Service body site, then this permission is implicit. However, be aware that any other use needs permission from NAWS.

Basically, you need to be a Registered NA Service Body to use this Web app as is. If you are not a Registered NA Service Body, then you should replace the "*XX*_Front.png" files with the equivalent "*XX*.png" file in order to prevent display of the tag fronts, which contain the trademarked NA Symbol.

NACC is not, in itself, an official NA Service, but is designed specifically to be implemented by NA Service bodies.

REQUIREMENTS
============
This requires a late-version browser. It doesn't have a lot of frou-frou to support older browsers.
It does not require an active-tech server (like [PHP](http://php.net) or [ASP](http://asp.net)), but will allow you to use PHP to optimize the page load.
If you like, you can certainly overload the CSS to support older browsers. It would not be so easy to modify the JavaScript.

INSTALLATION
============
Standard Installation
---------------------
This is a "pure browser" implementation of NACC. It requires absolutely no server-based components (but will support PHP, if provided).
In order to use this, you link to the "nacc.css"  and import the "nacc.js" file in the `<head>` element:

    <head>
        .
        .
        <link rel="stylesheet" type="text/css" href="nacc.css" />
        .
        .
        <script type="text/javascript" src="nacc.js"></script>
        .
        .
    </head>

In the `<body>` element, you then create an empty block-level element (usually a div), with a unique page ID, then reference that ID upon instantiating a new NACC() instance.

Example:

    <body>
        .
        .
        <div id="nacc-container" class="NACC-Linear"></div>
        .
        .
        <script type="text/javascript">new NACC('nacc-container')</script>
        .
        .
    </body>

Look at the "index.html" file for a more verbose version of this.

You can call it with up to 7 input parameters, which must be called in the following order:

1. A string, with the DOM ID of the DOM element that will contain this instance. It will usually be an empty `<div>` element, but can be any block-level DOM element. This is the only **required** parameter.
2. A string, indicating the style. Leave blank/null for default gray. The "BT" style would be 'NA-BT', as that is the CSS name it has been given.                                 
3. A string, with the language selector (Example: 'en' -the default-, 'es' -Spanish-, etc.). Currently, these languages are supported:
    - English ("en"). This is also the default.
    - Spanish ("es").
    - Simplified Chinese ("zh-Hans").
    - Traditional Chinese ("zh-Hant").      
4. A string, with the tag layout (either "linear" or "tabular" -default is "linear").     
5. A Boolean ("1", '' or "0"). If true, then the "specialty" (over 2 years) tags are displayed. Default is false.     
6. A string, containing a path (relative to the execution path) to the main directory. Leave as '' or null for standard implementations.                             
7. If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
    - An initial calculation year (integer -entire year, like "1953").
    - An initial calculation month (integer 1-12).
    - An initial calculation day (integer 1-31).
    
You can leave unused _successive_ parameters out, but _interim_ ones need to be specified as empty, 0 or null.

For example, these are all valid:

    NACC('some_DOM_ID');
    NACC('some_DOM_ID', 'NA-BT');
    NACC('some_DOM_ID', 'NA-BT', 'es');
    NACC('some_DOM_ID', 'NA-BT', 'es', 'tabular', 1);
    NACC('some_DOM_ID', null, 'es');
    NACC('some_DOM_ID', '', 'es');
    NACC('some_DOM_ID', null, 'es', 'tabular', 1);
    NACC('some_DOM_ID', null, '', 'tabular', 1);
    NACC('some_DOM_ID', 0, '', null, 1);
    
But these are not:

    NACC('some_DOM_ID', 'es');
    NACC('some_DOM_ID', 'tabular');
    NACC('some_DOM_ID', 'NA-BT', 'es', 1);
        
You can also call the file with GET (not POST) parameters (These can be provided in any order):

- "NACC-style" for Style
- "NACC-lang" for Language
- "NACC-tag-layout" for Tag Layout
- "NACC-special-tags" for Show Special Tags
- "NACC-dir-root" for the Directory Root
- "NACC-year" for Year
- "NACC-month" for Month
- "NACC-day" for Day

If these are provided, they will override any parameters passed into the function when it was created.

Here is an example: [http://littlegreenviper.net/nacc/index.html?NACC-style=NACC-BT&NACC-tag-layout=tabular&NACC-special-tags=1](http://littlegreenviper.net/nacc/index.html?NACC-style=NACC-BT&NACC-tag-layout=tabular&NACC-special-tags=1)

If You Have A PHP Server
------------------------
If you have a PHP server available, you can optimize the page load by using the PHP "file optimizer script," which is invoked from the `<head>` elements, like so:

    <head>
        .
        .
        <link rel="stylesheet" type="include_stripper.php?filename=text/css" href="nacc.css" />
        .
        .
        <script type="text/javascript" src="include_stripper.php?filename=nacc.js"></script>
        .
        .
    </head>

Look at the "index.php" file for a more verbose version of this.
    
For security reasons, this script must be in the same directory as the files it will include.

It can substantially reduce the size of the transmitted JavaScript and CSS files.

TESTING
=======

There is a very simple unit test file available. This is the "unit_test.html" file.
It tests the NACC by sending GET parameters.

LICENSING
=========
Most of the project is a [GPL V3](http://www.gnu.org/licenses/licenses.html#GPL) license. It is 100% open source, and the repository is available in full on [Bitbucket](https://bitbucket.org/bmlt/nacc2).

Please read the "IMPORTANT NOTE", above, for information about [NA trademarks](http://na.org/?ID=legal-bulletins-fipt). These cannot be reassigned via the GPL.

NACC is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by [the Free Software Foundation](http://fsf.org/), either version 3 of the License, or (at your option) any later version.

NACC is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See [the GNU General Public License](http://www.gnu.org/licenses/licenses.html#GPL) for more details.

You should have received a copy of the GNU General Public License along with the code. If not, see [the GPL License Page](http://www.gnu.org/licenses/).

CHANGELIST
==========
***Version 2.0.0* ** *-TBD*

- Initial Version