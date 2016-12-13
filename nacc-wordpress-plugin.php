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
		if ( preg_match ( "/<!--\s?NACC\s?-->/", $page_obj->post_content ) || preg_match ( "/\[\[\s?NACC\s?\]\]/", $page_obj->post_content ) )
			{
			echo "<!-- Added by the NACC plugin. -->\n";
			echo '<link rel="stylesheet" href="'.get_option('siteurl').'/wp-content/plugins/nacc-wordpress-plugin/nacc.css" type="text/css" />'."\n";
			echo '<script type="text/javascript" src="'.get_option('siteurl').'/wp-content/plugins/nacc-wordpress-plugin/nacc2/nacc.js"></script>';
			}
		}
	}

function nacc_content ( $the_content )
	{
	if ( preg_match ( "/<!--\s?NACC\s?-->/", $the_content) || preg_match ( "/\[\[\s?NACC\s?\]\]/", $page_obj->post_content ) )
		{
		$cc_text = '<div id = "nacc_container"></div>'."\n";
		$cc_text .= '<noscript>';
		$cc_text .= '<h1 style="text-align:center">JavaScript Required</h1>';
		$cc_text .= '<h2 style="text-align:center">Sadly, you must enable JavaScript on your browser in order to use this cleantime calculator.</h2>';
		$cc_text .= '</noscript><script type="text/javascript">NACC("nacc_container", 0, 0, 0, 1, "'.get_option('siteurl').'/wp-content/plugins/nacc-wordpress-plugin/nacc2/");</script>'."\n";
		$the_content = preg_replace ( "/(<p.*?>)?<!--\s?NACC\s?-->(<\/p>)?/", $cc_text, $the_content);
		$the_content = preg_replace ( "/(<p.*?>)?\[\[\s?NACC\s?\]\](<\/p>)?/", $cc_text, $the_content);
		}
	return $the_content;
	}

add_filter ( 'the_content', nacc_content );
add_action ( 'wp_head', 'nacc_head' );
?>