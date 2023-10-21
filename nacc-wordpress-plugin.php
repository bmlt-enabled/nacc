<?php

/**
 * Plugin Name: NACC WordPress Plugin
 * Plugin URI: https://wordpress.org/plugins/nacc-wordpress-plugin/
 * Contributors: BMLTGuy, pjaudiomv, bmltenabled
 * Author: bmlt-enabled
 * Description: This is a WordPress plugin implementation of the N.A. Cleantime Calculator. To use this, specify [NACC] in your text code. That text will be replaced with this cleantime calculator.
 * Version: 4.0.0
 * Install: Drop this directory in the "wp-content/plugins/" directory and activate it. You need to specify "[NACC]" in the code section of a page or a post.
 */

namespace NACCPlugin;

if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    die('Sorry, but you cannot access this page directly.');
}

/**
 * Class NACC
 * @package NACCPlugin
 */
class NACC
{
    private const SETTINGS_GROUP = 'nacc-group';
    private const DEFAULT_THEME = 'NACC-Instance';
    private const DEFAULT_LANGUAGE = 'en';
    private const DEFAULT_LAYOUT = 'linear';

    private $pluginDir;
    /**
     * Singleton instance of the class.
     *
     * @var null|self
     */
    private static ?self $instance = null;

    /**
     * Constructor method for initializing the plugin.
     */
    public function __construct()
    {
        $this->pluginDir = plugin_dir_url(__FILE__);
        // Register the 'pluginSetup' method to be executed during the 'init' action hook
        add_action('init', [$this, 'pluginSetup']);
    }

    /**
     * Setup method for initializing the plugin.
     *
     * This method checks if the current context is in the admin dashboard or not.
     * If in the admin dashboard, it registers admin-related actions and settings.
     * If not in the admin dashboard, it sets up a shortcode and associated actions.
     *
     * @return void
     */
    public function pluginSetup(): void
    {
        if (is_admin()) {
            // If in the admin dashboard, register admin menu and settings actions
            add_action('admin_menu', [static::class, 'createMenu']);
            add_action('admin_init', [static::class, 'registerSettings']);
        } else {
            // If not in the admin dashboard, set up a shortcode and associated actions
            add_action('wp_enqueue_scripts', [$this, 'assets']);
            add_shortcode('nacc', [static::class, 'setupShortcode']);
            add_filter('do_shortcode_tag', [static::class, 'triggerAfterShortcodeLoaded'], 10, 3);
            add_filter('the_content', [$this, 'naccContent']); // Support for legacy shortcodes
        }
    }

    /**
     * Setup and render the NACC shortcode.
     *
     * This method processes the attributes provided to the [nacc] shortcode and
     * sets up the necessary shortcode attributes for rendering the N.A. Cleantime
     * Calculator. If no shortcode attributes are provided, default values from
     * plugin options are used.
     *
     * @param array $atts Shortcode attributes.
     * @return string The HTML for the NACC shortcode.
     */
    public static function setupShortcode(array $atts = []): string
    {
        return '<div id="nacc_container"></div>';
    }

    /**
     * Callback function to trigger actions after the 'nacc' shortcode is loaded.
     *
     * @param string $output The output content of the shortcode.
     * @param string $tag The shortcode tag.
     * @param array $atts The attributes passed to the shortcode.
     *
     * @return string The modified output content.
     */
    public static function triggerAfterShortcodeLoaded(string $output, string $tag, array $atts): string
    {
        if ($tag === 'nacc') {
            global $shortcodeAtts;
            // add_action('wp_enqueue_scripts', [$this, 'assets']);
            // Get shortcode attributes or use default values from options
            $theme = !empty($atts['theme']) ? sanitize_text_field(strtoupper($atts['theme'])) : get_option('nacc_theme');
            $language = !empty($atts['lang']) ? sanitize_text_field(strtolower($atts['lang'])) : get_option('nacc_language');
            $layout = !empty($atts['layout']) ? sanitize_text_field(strtolower($atts['layout'])) : get_option('nacc_layout');
            $special = !empty($atts['special']) ? sanitize_text_field(strtolower($atts['special'])) : get_option('nacc_special');
            $siteURI = plugins_url('nacc2', __FILE__);
            $shortcodeAtts = [
                'theme' => $theme,
                'lang' => $language,
                'layout' => $layout,
                'special' => $special,
                'siteURI' => $siteURI
            ];
            add_action('wp_footer', function () use ($shortcodeAtts) {
                static::renderKeytags($shortcodeAtts);
            });
            return $output;
        }
        return $output;
    }

    /**
     * Render JavaScript for the shortcode.
     *
     * This method generates and adds an inline JavaScript script to initialize
     * the NACC (N.A. Cleantime Calculator) with the provided shortcode attributes.
     *
     * @return void
     */
    private static function renderKeytags(array $args): void
    {
        wp_add_inline_script('nacc-js', 'var nacc = new NACC(\'nacc_container\', "' . $args['theme'] . '", "' . $args['lang'] . '", "' . $args['layout'] . '", "' . $args['special'] . '", "' . $args['siteURI'] . '");');
    }

    /** Begin Code to Support Legacy non standard shortcode syntax IE. `<!-- NACC -->` or `[[NACC]]` */

    /**
     * Process content and replace a shortcode with CleanTime Calculator HTML.
     *
     * @param string $theContent The content to process.
     *
     * @return string The modified content with CleanTime Calculator HTML.
     */
    public function naccContent(string $theContent): string
    {
        // Initialize default values for shortcode parameters
        $theme = '';
        $lang = 'en';
        $layout = 'linear';
        $showSpecial = 'true';
        $siteURI = plugins_url('nacc2', __FILE__);

        // Get the shortcode and decode it
        $shortcode = html_entity_decode($this->getShortcode($theContent) ?? '');


        // Check if a shortcode was found
        if (!empty($shortcode)) {
            // Initialize the CleanTime Calculator text
            $ccText = '<div id="nacc_container"></div>' . "\n";
            $ccText .= '<noscript>';
            $ccText .= '<h1 style="text-align:center">JavaScript Required</h1>';
            $ccText .= '<h2 style="text-align:center">Sadly, you must enable JavaScript on your browser in order to use this cleantime calculator.</h2>';

            // Parse shortcode parameters
            $shortcodeObj = explode(',', $shortcode);
            if (count($shortcodeObj) > 0) {
                $theme = trim(trim($shortcodeObj[0]), "'");

                if (count($shortcodeObj) > 1) {
                    $langTemp = trim(trim($shortcodeObj[1]), "'");
                    if ($langTemp) {
                        $lang = $langTemp;
                    }
                }

                if (count($shortcodeObj) > 2) {
                    $layout = trim(trim($shortcodeObj[2]), "'");
                }

                if (count($shortcodeObj) > 3) {
                    $showSpecial = trim(trim($shortcodeObj[3]), "'");
                }
            }
            $ccText .= '</noscript>' . "\n";
            // Replace the shortcode in the content with CleanTime Calculator HTML
            $theContent = $this->replaceShortcode($theContent, $ccText);
        }

        // Prepare parameters for rendering
        $params = [
            'theme' => $theme,
            'layout' => $layout,
            'lang' => $lang,
            'special' => $showSpecial,
            'siteURI' => $siteURI
        ];

        // Add an action to render legacy keytags in wp_footer
        add_action('wp_footer', function () use ($params) {
            static::renderKeytags($params);
        });

        return $theContent;
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
     * @param string $inTextToParse
     * @param string $inReplacementText
     * @return string|null
     */
    private function replaceShortcode(
        string $inTextToParse,      ///< The text to search for shortcodes
        string $inReplacementText    ///< The text we'll be replacing the shortcode with.
    ): string | null {
        // Define the regular expressions for shortcode in HTML and brackets
        $codeRegexHtml = "/(\<p[^\>]*?\>)?<!--\s?nacc\s?(\(.*?\))?\s?-->(\<\/p>)?/i";
        $codeRegexBrackets = "/(\<p[^\>]*?\>)?\[\[\s?nacc\s?(\(.*?\))?\s?]](\<\/p>)?/i";

        // Replace shortcodes in both formats with the replacement text
        $ret = preg_replace($codeRegexHtml, $inReplacementText, $inTextToParse, 1);
        $ret = preg_replace($codeRegexBrackets, $inReplacementText, $ret, 1);

        return $ret;
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
     * @param string $inTextToParse
     * @return mixed
     */
    private function getShortcode(string $inTextToParse)
    {
        // Define the regular expressions for shortcode in HTML and brackets
        $codeRegexHtml = "/<!--\s?nacc\s?(\(.*?\))?\s?-->/i";
        $codeRegexBrackets = "/\[\[\s?nacc\s?(\(.*?\))?\s?]]/i";

        // Initialize the result
        $ret = null;

        // Try to match the shortcode using both regular expressions
        if (preg_match($codeRegexHtml, $inTextToParse, $matches) || preg_match($codeRegexBrackets, $inTextToParse, $matches)) {
            // Check if there are any parameters and extract them
            if (!empty($matches[1])) {
                $ret = trim($matches[1], '()');
            } else {
                $ret = true; // No parameters, set to true
            }
        }

        return $ret;
    }

    /** End Code to Support Legacy */

    /**
     * Enqueue plugin styles and scripts.
     *
     * This method is responsible for enqueueing the necessary CSS and JavaScript
     * files for the NACC plugin to function correctly.
     *
     * @return void
     */
    public function assets(): void
    {
        // Enqueue plugin styles and scripts
        wp_enqueue_style("nacc-css", $this->pluginDir . "nacc2/nacc.css", false, filemtime(plugin_dir_path(__FILE__) . "nacc2/nacc.css"), false);
        wp_enqueue_script('nacc-js', $this->pluginDir . "nacc2/nacc.js", [], '4.0', true);
    }

    /**
     * Register plugin settings with WordPress.
     *
     * This method registers the plugin settings with WordPress using the
     * `register_setting` function. It defines the settings for 'nacc_theme',
     * 'nacc_language', 'nacc_layout', and 'nacc_special'.
     *
     * @return void
     */
    public static function registerSettings(): void
    {
        // Register plugin settings with WordPress
        register_setting(self::SETTINGS_GROUP, 'nacc_theme', [
            'type' => 'string',
            'default' => self::DEFAULT_THEME,
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting(self::SETTINGS_GROUP, 'nacc_language', [
            'type' => 'string',
            'default' => self::DEFAULT_LANGUAGE,
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting(self::SETTINGS_GROUP, 'nacc_layout', [
            'type' => 'string',
            'default' => self::DEFAULT_LAYOUT,
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting(self::SETTINGS_GROUP, 'nacc_special', [
            'type' => 'boolean',
            'sanitize_callback' => 'wp_validate_boolean',
        ]);
    }

    /**
     * Create the plugin's settings menu in the WordPress admin.
     *
     * This method adds the NACC plugin's settings page to the WordPress admin menu.
     * It also adds a settings link in the list of plugins on the plugins page.
     *
     * @return void
     */
    public static function createMenu(): void
    {
        // Create the plugin's settings page in the WordPress admin menu
        add_options_page(
            esc_html__('NACC Settings'), // Page Title
            esc_html__('NACC'),          // Menu Title
            'manage_options',            // Capability
            'nacc',                      // Menu Slug
            [static::class, 'drawSettings']      // Callback function to display the page content
        );
        // Add a settings link in the plugins list
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), [static::class, 'settingsLink']);
    }

    /**
     * Add a "Settings" link for the plugin in the WordPress admin.
     *
     * This method adds a "Settings" link for the NACC plugin in the WordPress admin
     * under the plugins list.
     *
     * @param array $links An array of plugin action links.
     *
     * @return array An updated array of plugin action links.
     */
    public static function settingsLink(array $links): array
    {
        // Add a "Settings" link for the plugin in the WordPress admin
        $settings_url = admin_url('options-general.php?page=nacc');
        $links[] = "<a href='{$settings_url}'>Settings</a>";
        return $links;
    }

    /**
     * Display the plugin's settings page.
     *
     * This method renders and displays the settings page for the NACC plugin in the WordPress admin.
     * It includes form fields for configuring plugin settings such as theme, language, layout, and special keytags.
     *
     * @return void
     */
    public static function drawSettings(): void
    {
        // Display the plugin's settings page
        $naccTheme = esc_attr(get_option('nacc_theme'));
        $naccSpecial = get_option('nacc_special');
        $naccLanguage = get_option('nacc_language');
        $naccLayout = get_option('nacc_layout');
        ?>
        <div class="wrap">
            <h2>NACC Settings</h2>
            <form method="post" action="options.php">
                <?php settings_fields('nacc-group'); ?>
                <?php do_settings_sections('nacc-group'); ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Theme</th>
                        <td>
                            <?php echo static::renderSelectOption('nacc_theme', $naccTheme, [
                                'NACC-BT' => 'BT',
                                'NACC-CRNA' => 'CRNA',
                                'NACC-Instance' => 'Default',
                                'NACC-GNYR2' => 'GNYR2',
                                'NACC-HOLI' => 'HOLI',
                                'NACC-NERNA' => 'NERNA',
                            ]); ?>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Language</th>
                        <td>
                            <?php echo static::renderSelectOption('nacc_language', $naccLanguage, [
                                'en' => 'English',
                                'es' => 'Español',
                                'zh-Hans' => 'zh-Hans',
                                'zh-Hant' => 'zh-Hant',
                            ]); ?>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Layout</th>
                        <td>
                            <?php echo static::renderSelectOption('nacc_layout', $naccLayout, [
                                'tabular' => 'Tabular',
                                'linear' => 'Linear',
                            ]); ?>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Show Special Keytags</th>
                        <td>
                            <input type="checkbox" name="nacc_special" value="1" <?php checked(1, $naccSpecial); ?> />
                            <label for="nacc_special">If true, then the "specialty" (over 2 years) tags are displayed. Default is false.</label>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    /**
     * Render a dropdown select input for plugin settings.
     *
     * This method generates the HTML markup for a dropdown select input field with the specified name
     * and options. It also preselects the option that matches the provided selected value.
     *
     * @param string $name          The name attribute for the select input.
     * @param string $selectedValue The value to be preselected in the dropdown.
     * @param array  $options       An associative array of options (value => label) for the dropdown.
     *
     * @return string The generated HTML markup for the select input.
     */
    private static function renderSelectOption(string $name, string $selectedValue, array $options): string
    {
        // Render a dropdown select input for settings
        $selectHtml = "<select id='$name' name='$name'>";
        foreach ($options as $value => $label) {
            $selected = selected($selectedValue, $value, false);
            $selectHtml .= "<option value='$value' $selected>$label</option>";
        }
        $selectHtml .= "</select>";

        return $selectHtml;
    }

    /**
     * Get an instance of the NACC plugin class.
     *
     * This method ensures that only one instance of the NACC class is created during the plugin's lifecycle.
     *
     * @return self An instance of the NACC class.
     */
    public static function getInstance(): self
    {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}

NACC::getInstance();
