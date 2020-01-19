<?php
/***********************************************************************/
/** 	\file	include_stripper.php

    NACC is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    NACC is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this code.  If not, see <http://www.gnu.org/licenses/>.
*/
//define ( '__DEBUG_MODE__', 1 ); // Uncomment to make the CSS and JavaScript easier to trace (and less efficient).
	$pathname = $_GET['filename'];
	if ( !preg_match ( "|/|", $pathname ) ) {
		if ( preg_match ( "/.*?\.(js|css)$/", $pathname ) ) {
			$pathname = dirname ( __FILE__ )."/$pathname";
			$opt = file_get_contents ( $pathname );
			if ( !defined ( '__DEBUG_MODE__' ) ) {
                $opt = preg_replace( "|\/\*.*?\*\/|s", "", $opt );
                $opt = preg_replace( '#(?<!:)\/\/.*?\n#s', "", $opt );
                $opt = preg_replace( "|\s+|", " ", $opt );
            }
		    if ( preg_match ( "/.*?\.js$/", $pathname ) ) {
			    header ( "Content-type: text/javascript" );
			} else {
			    header ( "Content-type: text/css" );	
			}
			if ( zlib_get_coding_type() === false ) {
				ob_start("ob_gzhandler");
			} else {
				ob_start();
			}

			echo $opt;
			ob_end_flush();
		} else {
			echo "FILE MUST BE A .JS OR .CSS FILE!";
		}
    } else {
        echo "YOU CANNOT LEAVE THE DIRECTORY!";
    }
?>