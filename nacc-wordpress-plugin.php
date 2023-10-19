<?php

/**
 * Plugin Name: NACC WordPress Plugin
 * Plugin URI: https://wordpress.org/plugins/nacc-wordpress-plugin/
 * Contributors: BMLTGuy, pjaudiomv, bmltenabled
 * Author: bmlt-enabled
 * Description: This is a WordPress plugin implementation of the N.A. Cleantime Calculator. To use this, specify &lt;!&#45;&#45; NACC &#45;&#45;&gt; or [[NACC]] in your text code. That text will be replaced with this cleantime calculator.
 * Version: 4.0.0
 * Install: Drop this directory in the "wp-content/plugins/" directory and activate it. You need to specify "<!-- NACC -->" or "[[NACC]]" in the code section of a page or a post.
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
    /**
     * Singleton instance of the class.
     *
     * @var null|self
     */
    private static $instance = null;

    /**
     * Constructor method for initializing the plugin.
     */
    public function __construct()
    {
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
            add_action('admin_menu', [$this, 'createMenu']);
            add_action('admin_init', [$this, 'registerSettings']);
        } else {
            // If not in the admin dashboard, set up a shortcode and associated actions
            add_action('wp_enqueue_scripts', [$this, 'assets']);
            add_shortcode('nacc', [$this, 'setupShortcode']);
            add_filter('do_shortcode_tag', [$this, 'triggerAfterShortcodeLoaded'], 10, 3);
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
    public function setupShortcode($atts): string
    {
        return '<div id="nacc_container"></div>';
    }

    /**
     * Callback function to trigger actions after the 'nacc' shortcode is loaded.
     *
     * @param string $output The output content of the shortcode.
     * @param string $tag The shortcode tag.
     * @param array $attr The attributes passed to the shortcode.
     *
     * @return string The modified output content.
     */
    public function triggerAfterShortcodeLoaded($output, $tag, $atts): string
    {
        if ($tag === 'nacc') {
            global $shortcodeAtts;
            // add_action('wp_enqueue_scripts', [$this, 'assets']);
            // Get shortcode attributes or use default values from options
            $theme = !empty($atts['theme']) ? sanitize_text_field(strtoupper($atts['theme'])) : get_option('nacc_theme');
            $language = !empty($atts['lang']) ? sanitize_text_field(strtolower($atts['lang'])) : get_option('nacc_language');
            $layout = !empty($atts['layout']) ? sanitize_text_field(strtolower($atts['layout'])) : get_option('nacc_layout');
            $special = !empty($atts['special']) ? sanitize_text_field(strtolower($atts['special'])) : get_option('nacc_special');
            $shortcodeAtts = [
                'theme' => $theme,
                'lang' => $language,
                'layout' => $layout,
                'special' => $special,
            ];
            add_action('wp_footer', [$this, 'renderKeytags']);
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
    public function renderKeytags(): void
    {
        global $shortcodeAtts;
        $args = $shortcodeAtts;
        // Get the plugin's URI for scripts
        $siteURI = '"' . plugins_url('nacc2', __FILE__) . '"';
        // Add JavaScript inline script
        wp_add_inline_script('nacc-js', 'var nacc = new NACC(\'nacc_container\', "' . $args['theme'] . '", "' . $args['lang'] . '", "' . $args['layout'] . '", "' . $args['special'] . '", ' . $siteURI . ');');
    }

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
        wp_enqueue_style("nacc-css", plugin_dir_url(__FILE__) . "nacc2/nacc.css", false, filemtime(plugin_dir_path(__FILE__) . "nacc2/nacc.css"), false);
        wp_enqueue_script('nacc-js', plugin_dir_url(__FILE__) . "nacc2/nacc.js", [], '4.0', true);
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
    public function registerSettings(): void
    {
        // Register plugin settings with WordPress
        register_setting('nacc-group', 'nacc_theme', [
            'type' => 'string',
            'default' => 'NACC-Instance',
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting('nacc-group', 'nacc_language', [
            'type' => 'string',
            'default' => 'en',
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting('nacc-group', 'nacc_layout', [
            'type' => 'string',
            'default' => 'linear',
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        register_setting('nacc-group', 'nacc_special', [
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
    public function createMenu(): void
    {
        // Create the plugin's settings page in the WordPress admin menu
        add_options_page(
            esc_html__('NACC Settings'), // Page Title
            esc_html__('NACC'),          // Menu Title
            'manage_options',            // Capability
            'nacc',                      // Menu Slug
            [$this, 'drawSettings']      // Callback function to display the page content
        );
        // Add a settings link in the plugins list
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), [$this, 'settingsLink']);
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
    public function settingsLink(array $links): array
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
    public function drawSettings(): void
    {
        // Display the plugin's settings page
        $nacc_theme = esc_attr(get_option('nacc_theme'));
        $nacc_special = get_option('nacc_special');
        $nacc_language = get_option('nacc_language');
        $nacc_layout = get_option('nacc_layout');
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
                            <?php echo $this->renderSelectOption('nacc_theme', $nacc_theme, [
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
                            <?php echo $this->renderSelectOption('nacc_language', $nacc_language, [
                                'en' => 'English',
                                'es' => 'es',
                                'zh-Hans' => 'zh-Hans',
                                'zh-Hant' => 'zh-Hant',
                            ]); ?>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Layout</th>
                        <td>
                            <?php echo $this->renderSelectOption('nacc_layout', $nacc_layout, [
                                'tabular' => 'tabular',
                                'linear' => 'linear',
                            ]); ?>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Show Special Keytags</th>
                        <td>
                            <input type="checkbox" name="nacc_special" value="1" <?php checked(1, $nacc_special); ?> />
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
    private function renderSelectOption(string $name, string $selectedValue, array $options): string
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
