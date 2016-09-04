DESCRIPTION
===========
This version of the NA Cleantime Calculator has been redesigned from the ground up to be entirely browser-based.
That means that no PHP server is required (good for site builders, like Wix and SquareSpace).

It is extremely fast and complete.

The site visitor uses three popup menus to select a clean date, and then they activate a "Calculate" button.

At that point, they are presented with a statement that summarizes their cleantime (how many total days, years, months and days, accounting for the intervening years).

They are also shown a list of the tags they would have earned by now. There are two layout for these tags:

- Linear, in which the tag front (usually a simple NA logo) is displayed.
- Tabular, in which all of the tags are laid out side-by-side, and this layout displays the rear of the tags (with the text).

The NACC is localized. The current version supports only the standard [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar) (so that means it is not useful for Iran).
The tag images are provided for the given localization.

There are a number of new "specialty" tags, for long-term cleantime (like the purple "Decades" tag). The visitor can choose to display these.

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
In order to use this, you import the "nacc.js" file, and link to the "nacc.css" file:

    <head>
        .
        .
        <script type="text/javascript" src="nacc.js"></script>
        <link rel="stylesheet" type="text/css" href="nacc.css" />
        .
        .
    </head>

You then create an empty block-level element (usually a &lt;div&gt;), with a unique page ID, then reference that ID upon instantiating a new NACC() instance.

Example:

    <body>
        .
        .
        <div id="nacc-container" class="NACC-Linear"></div>
        <script type="text/javascript">new NACC('nacc-container')</script>
        .
        .
    </body>

Look at the "index.html" file for a more verbose version of this.

You can call it with a number of input parameters:

- A string, with the DOM ID of the DOM element that will contain this instance. It will usually be an empty div element, but can be any block-level DOM element. This is the only required parameter.
- A string, indicating the style. Leave blank/null for default gray. The "BT" style would be 'NA-BT', as that is the CSS name it has been given.                                 
- A string, with the language selector (Example: 'en' -the default-, 'es' -Spanish-, etc.). Currently, these languages are supported:
    - English ('en'). This is also the default.
    - Spanish ('es').
    - Simplified Chinese ('zh-Hans').
    - Traditional Chinese ('zh-Hant').      
- A string, with the tag layout (either 'linear' or 'tabular' -default is 'linear').     
- A Boolean ('1' or '' or '0'). If true, then the "specialty" (over 2 years) tags are displayed. Default is false.     
- A string, containing a path (relative to the execution path) to the main directory. Leave as '' or null for standard implementations.                             
- If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
    - An initial calculation year (integer -entire year, like '1953').
    - An initial calculation month (integer 1-12).
    - An initial calculation day (integer 1-31).
        
You can also call the file with GET (not POST) parameters:

- "NACC-style" for Style
- "NACC-lang" for Language
- "NACC-tag-layout" for Tag Layout
- "NACC-special-tags" for Show Special Tags
- "NACC-dir-root" for the Directory Root
- "NACC-year" for Year
- "NACC-month" for Month
- "NACC-day" for Day

If these are provided, they will override any parameters passed into the function when it was created.

If You Have A PHP Server
------------------------
If you have a PHP server available, you can optimize the page load by using the PHP "file optimizer script," which is invoked from the &lt;head&gt; elements, like so:

    <head>
        .
        .
        <script type="text/javascript" src="include_stripper.php?filename=nacc.js"></script>
        <link rel="stylesheet" type="include_stripper.php?filename=text/css" href="nacc.css" />
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
This is a [GPL V3](http://www.gnu.org/licenses/licenses.html#GPL) license. It is 100% open source, and the repository is available in full on [Bitbucket](https://bitbucket.org/bmlt/nacc2).

CHANGELIST
==========
***Version 2.0.0* ** *-TBD*

- Initial Version