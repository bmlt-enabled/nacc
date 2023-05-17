<?php
/*
Plugin Name: NACC WordPress Plugin
Plugin URI: https://github.com/bmlt-enabled/nacc
Description: This is a WordPress plugin implementation of the N.A. Cleantime Calculator. To use this, specify &lt;!&#45;&#45; NACC &#45;&#45;&gt; or [[NACC]] in your text code. That text will be replaced with this cleantime calculator.
Version: 3.1.7
Install: Drop this directory in the "wp-content/plugins/" directory and activate it. You need to specify "<!-- NACC -->" or "[[NACC]]" in the code section of a page or a post.
*/

function nacc_head()
{
    global $wp_query;
    $page_obj_id = $wp_query->get_queried_object_id();
    if ($page_obj_id) {
        $page_obj = get_page($page_obj_id);
        $shortcode_obj = get_shortcode($page_obj->post_content ?? "");
    
        if ($shortcode_obj) {
            echo "<!-- Added by the NACC plugin. -->\n";
            echo '<link rel="stylesheet" href="'.plugin_dir_url(__FILE__).'nacc2/nacc.css" type="text/css" />'."\n";
            echo '<script type="text/javascript" src="'.plugin_dir_url(__FILE__).'nacc2/nacc.js"></script>'."\n";
        }
    }
}

function nacc_content($the_content)
{
    $shortcode_obj = explode(',', html_entity_decode(get_shortcode($the_content) ?? ''));

    if ($shortcode_obj) {
        $cc_text = '<div id = "nacc_container"></div>'."\n";
        $cc_text .= '<noscript>';
        $cc_text .= '<h1 style="text-align:center">JavaScript Required</h1>';
        $cc_text .= '<h2 style="text-align:center">Sadly, you must enable JavaScript on your browser in order to use this cleantime calculator.</h2>';
        $siteURI = '"'.plugins_url('nacc2', __FILE__).'"';
        
        if (($shortcode_obj !== true) && (!is_array($shortcode_obj))) {
            $shortcode_obj = array ( $shortcode_obj );
        }
        
        if (is_array($shortcode_obj) && (count($shortcode_obj) > 0)) {
            $theme = '"'.trim(strval($shortcode_obj[0]), '\'"').'"';
            $lang = '"en"';
            $layout = '"linear"';
            $showSpecial = 'true';
            
            if (count($shortcode_obj) > 1) {
                $lang_temp = '"'.trim(strval($shortcode_obj[1]), '\'"').'"';
                
                if ($lang_temp) {
                    $lang = $lang_temp;
                }
            }
            
            if (count($shortcode_obj) > 2) {
                $layout = '"'.trim(strval($shortcode_obj[2]), '\'"').'"';
            }
            
            if (count($shortcode_obj) > 3) {
                $showSpecial = trim(strval($shortcode_obj[3]), '\'"');
            }
                
            $cc_text .= '</noscript><script type="text/javascript">var nacc = new NACC("nacc_container", '.$theme.', '.$lang.', '.$layout.', '.$showSpecial.', '.$siteURI.');</script>'."\n";
        } else {
            $cc_text .= '</noscript><script type="text/javascript">var nacc = new NACC("nacc_container", 0, 0, 0, 1, '.$siteURI.');</script>'."\n";
        }
        
        $the_content = replace_shortcode($the_content, $cc_text);
    }
    return $the_content;
}

/************************************************************************************/
/**
 *   \brief This will parse the given text, to see if it contains the submitted code.    *
 *                                                                                       *
 *   The code can be contained in EITHER an HTML comment (<!--CODE-->), OR a double-[[]] *
 *   notation.                                                                           *
 *                                                                                       *
 *   \returns Boolean true if the code is found (1 or more instances), OR an associative *
 *   array of data that is associated with the code (anything within parentheses). Null  *
 *   is returned if there is no shortcode detected.                                      *
 ***************************************************************************************
 * @param $in_text_to_parse
 * @return bool|string|null
 */
function get_shortcode($in_text_to_parse)
{
    $ret = null;
    
    $code_regex_html = "\<\!\-\-\s?nacc\s?(\(.*?\))?\s?\-\-\>";
    $code_regex_brackets = "\[\[\s?nacc\s?(\(.*?\))?\s?\]\]";
    
    $matches = array();
  
    if (preg_match('|'.$code_regex_html.'|i', $in_text_to_parse, $matches) || preg_match('|'.$code_regex_brackets.'|i', $in_text_to_parse, $matches)) {
        if (!isset($matches[1]) || !($ret = trim($matches[1], '()'))) { // See if we have any parameters.
            $ret = true;
        }
    }
    
    return $ret;
}

/************************************************************************************/
/**
 *   \brief This will parse the given text, to see if it contains the submitted code.    *
 *                                                                                       *
 *   The code can be contained in EITHER an HTML comment (<!--CODE-->), OR a double-[[]] *
 *   notation.                                                                           *
 *                                                                                       *
 *   \returns A string, consisting of the new text.                                      *
 ***************************************************************************************
 * @param $in_text_to_parse
 * @param $in_replacement_text
 * @return string|string[]|null
 */
function replace_shortcode(
    $in_text_to_parse,      ///< The text to search for shortcodes
    $in_replacement_text    ///< The text we'll be replacing the shortcode with.
) {
    $code_regex_html = "#(\<p[^\>]*?\>)?\<\!\-\-\s?nacc\s?(\(.*?\))?\s?\-\-\>(\<\/p>)?#i";
    $code_regex_brackets = "#(\<p[^\>]*?\>)?\[\[\s?nacc\s?(\(.*?\))?\s?\]\](\<\/p>)?#i";

    $ret = preg_replace($code_regex_html, $in_replacement_text, $in_text_to_parse, 1);
    $ret = preg_replace($code_regex_brackets, $in_replacement_text, $ret, 1);
    
    return $ret;
}

add_filter('the_content', 'nacc_content');
add_action('wp_head', 'nacc_head');
