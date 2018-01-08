<?php
/*
Plugin Name: NACC WordPress Plugin
Plugin URI: http://magshare.org/nacc
Description: This is a WordPress plugin implementation of the N.A. Cleantime Calculator. To use this, specify &lt;!&#45;&#45; NACC &#45;&#45;&gt; or [[NACC]] in your text code. That text will be replaced with this cleantime calculator.
Version: 3.0.0
Install: Drop this directory in the "wp-content/plugins/" directory and activate it. You need to specify "<!-- NACC -->" or "[[NACC]]" in the code section of a page or a post.
*/ 

function nacc_head ( )
	{
	global $wp_query;
	$page_obj_id = $wp_query->get_queried_object_id();
	if ( $page_obj_id )
		{
		$page_obj = get_page ( $page_obj_id );
        $shortcode_obj = get_shortcode ( $page_obj->post_content );
    
        if ( $shortcode_obj )
			{
			echo "<!-- Added by the NACC plugin. -->\n";
			echo '<link rel="stylesheet" href="'.get_option('siteurl').'/wp-content/plugins/nacc-wordpress-plugin-2/nacc2/include_stripper.php?filename=nacc.css" type="text/css" />'."\n";
			echo '<script type="text/javascript" src="'.get_option('siteurl').'/wp-content/plugins/nacc-wordpress-plugin-2/nacc2/include_stripper.php?filename=nacc.js"></script>'."\n";
			}
		}
	}

function nacc_content ( $the_content )
	{
	$shortcode_obj = get_shortcode ( $the_content );
	
	if ( $shortcode_obj )
		{
		$cc_text = '<div id = "nacc_container"></div>'."\n";
		$cc_text .= '<noscript>';
		$cc_text .= '<h1 style="text-align:center">JavaScript Required</h1>';
		$cc_text .= '<h2 style="text-align:center">Sadly, you must enable JavaScript on your browser in order to use this cleantime calculator.</h2>';
        $siteURI = get_option('siteurl').'/wp-content/plugins/nacc-wordpress-plugin-2/nacc2/';
        
        if ( ($shortcode_obj !== true) && (!is_array ( $shortcode_obj )) )
            {
            $shortcode_obj = Array ( $shortcode_obj );
            }
        
		if ( is_array ( $shortcode_obj ) && (count ( $shortcode_obj ) > 0) )
		    {
		    $theme = trim(strval ( $shortcode_obj[0] ), '"');
		    $lang = 0;
		    $layout = '"linear"';
		    $showSpecial = 'true';
		    
		    if ( count ( $shortcode_obj ) > 1 )
		        {
		        $lang = '"'.strval ( $shortcode_obj[1] ).'"';
		        }
		    
		    if ( count ( $shortcode_obj ) > 2 )
		        {
		        $layout = '"'.strval ( $shortcode_obj[2] ).'"';
		        }
		    
		    if ( count ( $shortcode_obj ) > 3 )
		        {
		        $showSpecial = $shortcode_obj[3] ? 'true' : 'false';
		        }
		    
		    $cc_text .= '</noscript><script type="text/javascript">var nacc = new NACC("nacc_container", "'.$theme.'", '.$lang.', '.$layout.', '.$showSpecial.', "'.$siteURI.'");</script>'."\n";
		    }
		else
		    {
		    $cc_text .= '</noscript><script type="text/javascript">var nacc = new NACC("nacc_container", 0, 0, 0, 1, "'.$siteURI.'");</script>'."\n";
            }
        
		$the_content = replace_shortcode ( $the_content, $cc_text );
		}
	return $the_content;
	}

/************************************************************************************//**
*   \brief This will parse the given text, to see if it contains the submitted code.    *
*                                                                                       *
*   The code can be contained in EITHER an HTML comment (<!--CODE-->), OR a double-[[]] *
*   notation.                                                                           *
*                                                                                       *
*   \returns Boolean true if the code is found (1 or more instances), OR an associative *
*   array of data that is associated with the code (anything within parentheses). Null  *
*   is returned if there is no shortcode detected.                                      *
****************************************************************************************/
function get_shortcode ( $in_text_to_parse )
    {
    $ret = null;
    
    $code_regex_html = "\<\!\-\-\s?nacc\s?(\(.*?\))?\s?\-\-\>";
    $code_regex_brackets = "\[\[\s?nacc\s?(\(.*?\))?\s?\]\]";
    
    $matches = array();
  
    if ( preg_match ( '|'.$code_regex_html.'|i', $in_text_to_parse, $matches ) || preg_match ( '|'.$code_regex_brackets.'|i', $in_text_to_parse, $matches ) )
        {
        if ( !isset ( $matches[1] ) || !($ret = trim ( $matches[1], '()' )) ) // See if we have any parameters.
            {
            $ret = true;
            }
        }
    
    return $ret;
    }

/************************************************************************************//**
*   \brief This will parse the given text, to see if it contains the submitted code.    *
*                                                                                       *
*   The code can be contained in EITHER an HTML comment (<!--CODE-->), OR a double-[[]] *
*   notation.                                                                           *
*                                                                                       *
*   \returns A string, consisting of the new text.                                      *
****************************************************************************************/
function replace_shortcode ($in_text_to_parse,      ///< The text to search for shortcodes
                            $in_replacement_text    ///< The text we'll be replacing the shortcode with.
                            )
    {
    $code_regex_html = "#(\<p[^\>]*?\>)?\<\!\-\-\s?nacc\s?(\(.*?\))?\s?\-\-\>(\<\/p>)?#i";
    $code_regex_brackets = "#(\<p[^\>]*?\>)?\[\[\s?nacc\s?(\(.*?\))?\s?\]\](\<\/p>)?#i";

    $ret = preg_replace ( $code_regex_html, $in_replacement_text, $in_text_to_parse, 1 );
    $ret = preg_replace ( $code_regex_brackets, $in_replacement_text, $ret, 1 );
    
    return $ret;
    }

add_filter ( 'the_content', nacc_content );
add_action ( 'wp_head', 'nacc_head' );
?>