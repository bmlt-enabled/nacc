<!DOCTYPE html>
<html lang="en">
    <head>
        <!--
            **********************************************************
            *           The NA Cleatime Calculator (NACC)            *
            **********************************************************
            This is an example of an entirely browser-based NA Cleantime Calculator (NACC).
            You need to include the "nacc.js" and "nacc.css" files, as well as the "images"
            directory, into the same directory as this file.
            This PHP file also requires that you also add the "include-stripper.php" file.

            This file is exactly the same as the index.html file, with the
            exception that it includes the JS and CSS files through a PHP
            script that optimizes them (reduces the page load).
            
            In the case of the JavaScript file, it reduces the file load
            from over 65K to 1.3K.
            
            NACC is free software: you can redistribute it and/or modify
            it under the terms of the GNU General Public License as published by
            the Free Software Foundation, either version 3 of the License, or
            (at your option) any later version.

            NACC is distributed in the hope that it will be useful,
            but WITHOUT ANY WARRANTY; without even the implied warranty of
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
            GNU General Public License for more details.

            You should have received a copy of the GNU General Public License
            along with this code. If not, see <http://www.gnu.org/licenses/>.

            **********************************************************
            *                   HTML HEADER STUFF                    *
            **********************************************************
        -->
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
        <meta http-equiv="Content-Style-Type" content="text/css" />
        <meta http-equiv="Content-Script-Type" content="text/javascript" />
        <title>NACC 2</title>
        <!-- These two includes are different from the "index.html" file. Note the "include-stripper.php?filename=". -->
        <link rel="stylesheet" type="text/css" href="include-stripper.php?filename=nacc.css" />
        <script type="text/javascript" src="include-stripper.php?filename=nacc.js"></script>
    </head>
    <body>
        <!--
            This will be the element that will contain the NACC. It is populated by JavaScript.
            The element will have its class changed to ".NACC-Instance". If a "theme" has been
            chosen, then an additional class will be added to indicate the theme.
            
            For example, for the default (gray) theme, the classname will be "NACC-Instance".
            for the BT theme (Blue and white), the class will be "NACC-Instance NACC-BT".
            
            If you have already specified a class name, then that will be honored.
            
            This example simply 
        -->
        <div id="nacc-container" class="NACC-Linear"><noscript style="font-size: x-large; font-weight:bold; text-align:center">THIS WILL NOT WORK WITHOUT JAVASCRIPT ENABLED!</noscript></div>
        <!--
            This is where the JavaScript implementation is called.
            
            Here are the parameters that you can use (This example only passes in the first one):
                new NACC
                    (
                    inContainerElementID    A DOM ID to the DOM element that will contain this instance. It will usually be an empty div element, but can be any block-level DOM element.
                    inStyle                 This is the style (leave blank/null for default gray. The "BT" style would be 'NA-BT', as that is the CSS name it has been given).
                    inLang                  A string, with the language selector (Example: 'en' -the default-, 'es' -Spanish-, etc.).
                    inTagLayout             The tag layout (either 'linear' or 'tabular' -default is 'linear')
                    inShowSpecialTags       If true, then the "specialty" (over 2 years) tags are displayed. Default is false.
                    inDirectoryRoot         This is a path (relative to the execution path) to the main directory. Leave as '' or null for standard implementations.
                    inYear                  An initial calculation year (integer -entire year, like '1953'). If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
                    inMonth                 An initial calculation month (integer 1-12). If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
                    inDay                   An initial calculation day (integer 1-31). If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
                    );
        -->
        <script type="text/javascript">new NACC('nacc-container');</script>
    </body>
</html>
