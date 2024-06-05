<?php
/**
 * Plugin Name:       NACC WordPress Plugin
 * Plugin URI:        https://wordpress.org/plugins/nacc-wordpress-plugin/
 * Description:       This is a WordPress plugin implementation of the N.A. Cleantime Calculator. To use this, specify [NACC] in your text code. That text will be replaced with this cleantime calculator.
 * Install:           Drop this directory in the "wp-content/plugins/" directory and activate it. You need to specify "[NACC]" in the code section of a page or a post.
 * Contributors:      BMLTGuy, pjaudiomv, bmltenabled
 * Authors:           bmltenabled
 * Version:           4.1.0
 * Requires PHP:      8.0
 * Requires at least: 5.3
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

namespace NACCPlugin;

if ( basename( $_SERVER['PHP_SELF'] ) == basename( __FILE__ ) ) {
	die( 'Sorry, but you cannot access this page directly.' );
}

/**
 * Class NACC
 * @package NACCPlugin
 */
class NACC {

	private const SETTINGS_GROUP = 'nacc-group';
	private const DEFAULT_THEME = 'NACC-Instance';
	private const DEFAULT_LANGUAGE = 'en';
	private const DEFAULT_LAYOUT = 'linear';
	private const DEFAULT_SHOW_SPECIAL = 'true';

	private $plugin_dir;
	/**
	 * Singleton instance of the class.
	 *
	 * @var null|self
	 */
	private static ?self $instance = null;

	/**
	 * Constructor method for initializing the plugin.
	 */
	public function __construct() {
		$this->plugin_dir = plugin_dir_url( __FILE__ );
		// Register the 'plugin_setup' method to be executed during the 'init' action hook
		add_action( 'init', [ $this, 'plugin_setup' ] );
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
	public function plugin_setup(): void {
		if ( is_admin() ) {
			// If in the admin dashboard, register admin menu and settings actions
			add_action( 'admin_menu', [ static::class, 'create_menu' ] );
			add_action( 'admin_init', [ static::class, 'register_settings' ] );
		} else {
			// If not in the admin dashboard, set up a shortcode and associated actions
			add_action( 'wp_enqueue_scripts', [ $this, 'assets' ] );
			add_shortcode( 'nacc', [ static::class, 'setup_shortcode' ] );
			add_filter( 'do_shortcode_tag', [ static::class, 'trigger_after_shortcode_loaded' ], 10, 3 );
			add_filter( 'the_content', [ $this, 'nacc_content' ] ); // Support for legacy shortcodes
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
	 * @param string|array $attrs Shortcode attributes.
	 * @return string The HTML for the NACC shortcode.
	 */
	public static function setup_shortcode( string|array $attrs = [] ): string {
		return '<div id="nacc_container"></div>';
	}

	/**
	 * Callback function to trigger actions after the 'nacc' shortcode is loaded.
	 *
	 * @param string $output The output content of the shortcode.
	 * @param string $tag The shortcode tag.
	 * @param string|array $attrs The attributes passed to the shortcode.
	 *
	 * @return string The modified output content.
	 */
	public static function trigger_after_shortcode_loaded( string $output, string $tag, string|array $attrs = [] ): string {
		if ( 'nacc' === $tag ) {
			global $shortcode_attrs;
			// add_action('wp_enqueue_scripts', [$this, 'assets']);
			// Get shortcode attributes or use default values from options
			$theme = ! empty( $attrs['theme'] ) ? sanitize_text_field( strtoupper( $attrs['theme'] ) ) : get_option( 'nacc_theme' );
			$language = ! empty( $attrs['lang'] ) ? sanitize_text_field( strtolower( $attrs['lang'] ) ) : get_option( 'nacc_language' );
			$layout = ! empty( $attrs['layout'] ) ? sanitize_text_field( strtolower( $attrs['layout'] ) ) : get_option( 'nacc_layout' );
			$special = ! empty( $attrs['special'] ) ? sanitize_text_field( strtolower( $attrs['special'] ) ) : get_option( 'nacc_special' );
			$site_uri = plugins_url( 'nacc2', __FILE__ );
			$shortcode_attrs = [
				'theme' => $theme,
				'lang' => $language,
				'layout' => $layout,
				'special' => $special,
				'siteURI' => $site_uri,
			];
			add_action(
				'wp_footer',
				function () use ( $shortcode_attrs ) {
					static::render_keytags( $shortcode_attrs );
				}
			);
			return $output;
		}
		return $output;
	}

	/**
	 * Render JavaScript for the shortcode.
	 *
	 * This method generates and adds inline JavaScript to initialize
	 * the NACC (N.A. Cleantime Calculator) with the provided shortcode attributes.
	 *
	 * @param array $args
	 * @return void
	 */
	private static function render_keytags( array $args ): void {
		wp_add_inline_script( 'nacc-js', 'var nacc = new NACC(\'nacc_container\', "' . $args['theme'] . '", "' . $args['lang'] . '", "' . $args['layout'] . '", "' . $args['special'] . '", "' . $args['siteURI'] . '");' );
	}

	/** Begin Code to Support Legacy non standard shortcode syntax IE. `<!-- NACC -->` or `[[NACC]]` */
	/**
	 * Process content and replace a shortcode with CleanTime Calculator HTML.
	 *
	 * @param string $the_content The content to process.
	 *
	 * @return string The modified content with CleanTime Calculator HTML.
	 */
	public function nacc_content( string $the_content ): string {
		// Get the shortcode and decode it
		$shortcode = html_entity_decode( $this->get_shortcode( $the_content ) ?? '' );

		// Check if a shortcode was found
		if ( ! empty( $shortcode ) ) {
			// Parse shortcode parameters, Initialize default values
			$shortcode_obj = explode( ',', $shortcode );
			$shortcode_obj = array_map( fn( $value ) => trim( trim( $value ), "'" ), $shortcode_obj );

			// Prepare parameters for rendering
			$params = [
				'theme' => $shortcode_obj[0] ?? self::DEFAULT_THEME,
				'lang' => $shortcode_obj[1] ?? self::DEFAULT_LANGUAGE,
				'layout' => $shortcode_obj[2] ?? self::DEFAULT_LAYOUT,
				'special' => $shortcode_obj[3] ?? self::DEFAULT_SHOW_SPECIAL,
				'siteURI' => plugins_url( 'nacc2', __FILE__ ),
			];

			// Initialize the CleanTime Calculator text
			$cc_text = '<div id="nacc_container"></div>' . "\n";
			$cc_text .= '<noscript>';
			$cc_text .= '<h1 style="text-align:center">JavaScript Required</h1>';
			$cc_text .= '<h2 style="text-align:center">Sadly, you must enable JavaScript on your browser in order to use this cleantime calculator.</h2>';
			$cc_text .= '</noscript>' . "\n";

			// Replace the shortcode in the content with CleanTime Calculator HTML
			$the_content = $this->replace_shortcode( $the_content, $cc_text );

			// Add an action to render legacy keytags in wp_footer
			add_action(
				'wp_footer',
				function () use ( $params ) {
					static::render_keytags( $params );
				}
			);
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
	 *   \returns A string, consisting of the new text.                                      *
	 ***************************************************************************************
	 * @param string $in_text_to_parse
	 * @param string $in_replacement_text
	 * @return string|null
	 */
	private function replace_shortcode(
		string $in_text_to_parse,      ///< The text to search for shortcodes
		string $in_replacement_text    ///< The text we'll be replacing the shortcode with.
	): string|null {
		// Define the regular expressions for shortcode in HTML and brackets
		$code_regex_html = '/(\<p[^\>]*?\>)?<!--\s?nacc\s?(\(.*?\))?\s?-->(\<\/p>)?/i';
		$code_regex_brackets = '/(\<p[^\>]*?\>)?\[\[\s?nacc\s?(\(.*?\))?\s?]](\<\/p>)?/i';

		// Replace shortcodes in both formats with the replacement text
		$ret = preg_replace( $code_regex_html, $in_replacement_text, $in_text_to_parse, 1 );
		$ret = preg_replace( $code_regex_brackets, $in_replacement_text, $ret, 1 );

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
	 * @param string $in_text_to_parse
	 * @return mixed
	 */
	private function get_shortcode( string $in_text_to_parse ) {
		// Define the regular expressions for shortcode in HTML and brackets
		$code_regex_html = '/<!--\s?nacc\s?(\(.*?\))?\s?-->/i';
		$code_regex_brackets = '/\[\[\s?nacc\s?(\(.*?\))?\s?]]/i';

		// Initialize the result
		$ret = null;

		// Try to match the shortcode using both regular expressions
		if ( preg_match( $code_regex_html, $in_text_to_parse, $matches ) || preg_match( $code_regex_brackets, $in_text_to_parse, $matches ) ) {
			// Check if there are any parameters and extract them
			if ( ! empty( $matches[1] ) ) {
				$ret = trim( $matches[1], '()' );
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
	public function assets(): void {
		// Enqueue plugin styles and scripts
		wp_enqueue_style( 'nacc-css', $this->plugin_dir . 'nacc2/nacc.css', false, filemtime( plugin_dir_path( __FILE__ ) . 'nacc2/nacc.css' ), false );
		wp_enqueue_script( 'nacc-js', $this->plugin_dir . 'nacc2/nacc.js', [], '4.0', true );
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
	public static function register_settings(): void {
		// Register plugin settings with WordPress
		register_setting(
			self::SETTINGS_GROUP,
			'nacc_theme',
			[
				'type' => 'string',
				'default' => self::DEFAULT_THEME,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		register_setting(
			self::SETTINGS_GROUP,
			'nacc_language',
			[
				'type' => 'string',
				'default' => self::DEFAULT_LANGUAGE,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		register_setting(
			self::SETTINGS_GROUP,
			'nacc_layout',
			[
				'type' => 'string',
				'default' => self::DEFAULT_LAYOUT,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		register_setting(
			self::SETTINGS_GROUP,
			'nacc_special',
			[
				'type' => 'boolean',
				'sanitize_callback' => 'wp_validate_boolean',
			]
		);
	}

	/**
	 * Create the plugin's settings menu in the WordPress admin.
	 *
	 * This method adds the NACC plugin's settings page to the WordPress admin menu.
	 * It also adds a settings link in the list of plugins on the plugins page.
	 *
	 * @return void
	 */
	public static function create_menu(): void {
		// Create the plugin's settings page in the WordPress admin menu
		add_options_page(
			esc_html__( 'NACC Settings' ), // Page Title
			esc_html__( 'NACC' ),          // Menu Title
			'manage_options',            // Capability
			'nacc',                      // Menu Slug
			[ static::class, 'draw_settings' ]      // Callback function to display the page content
		);
		// Add a settings link in the plugins list
		add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ static::class, 'settings_link' ] );
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
	public static function settings_link( array $links ): array {
		// Add a "Settings" link for the plugin in the WordPress admin
		$settings_url = admin_url( 'options-general.php?page=nacc' );
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
	public static function draw_settings(): void {
		// Display the plugin's settings page
		$nacc_theme = esc_attr( get_option( 'nacc_theme' ) );
		$nacc_special = esc_attr( get_option( 'nacc_special' ) );
		$nacc_language = esc_attr( get_option( 'nacc_language' ) );
		$nacc_layout = esc_attr( get_option( 'nacc_layout' ) );
		$allowed_html = [
			'select' => [
				'id'   => [],
				'name' => [],
			],
			'option' => [
				'value'   => [],
				'selected'   => [],
			],
		];
		?>
		<div class="wrap">
			<h2>NACC Settings</h2>
			<form method="post" action="options.php">
				<?php settings_fields( 'nacc-group' ); ?>
				<?php do_settings_sections( 'nacc-group' ); ?>
				<table class="form-table">
					<tr valign="top">
						<th scope="row">Theme</th>
						<td>
							<?php
							echo wp_kses(
								static::render_select_option(
									'nacc_theme',
									$nacc_theme,
									[
										'NACC-BT' => 'BT',
										'NACC-CRNA' => 'CRNA',
										'NACC-Instance' => 'Default',
										'NACC-GNYR2' => 'GNYR2',
										'NACC-HOLI' => 'HOLI',
										'NACC-NERNA' => 'NERNA',
										'NACC-SEZF' => 'SEZF',
									]
								),
								$allowed_html
							);
							?>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">Language</th>
						<td>
							<?php
							echo wp_kses(
								static::render_select_option(
									'nacc_language',
									$nacc_language,
									[
										'en' => 'English',
										'es' => 'Español',
										'it' => 'Italiano',
										'zh-Hans' => 'zh-Hans',
										'zh-Hant' => 'zh-Hant',
									]
								),
								$allowed_html
							);
							?>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">Layout</th>
						<td>
							<?php
							echo wp_kses(
								static::render_select_option(
									'nacc_layout',
									$nacc_layout,
									[
										'tabular' => 'Tabular',
										'linear' => 'Linear',
									]
								),
								$allowed_html
							);
							?>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">Show Special Keytags</th>
						<td>
							<input type="checkbox" name="nacc_special" value="1" <?php checked( 1, $nacc_special ); ?> />
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
	 * @param string $selected_value The value to be preselected in the dropdown.
	 * @param array  $options       An associative array of options (value => label) for the dropdown.
	 *
	 * @return string The generated HTML markup for the select input.
	 */
	private static function render_select_option( string $name, string $selected_value, array $options ): string {
		// Render a dropdown select input for settings
		$select_html = "<select id='$name' name='$name'>";
		foreach ( $options as $value => $label ) {
			$selected = selected( $selected_value, $value, false );
			$select_html .= "<option value='$value' $selected>$label</option>";
		}
		$select_html .= '</select>';

		return $select_html;
	}

	/**
	 * Get an instance of the NACC plugin class.
	 *
	 * This method ensures that only one instance of the NACC class is created during the plugin's lifecycle.
	 *
	 * @return self An instance of the NACC class.
	 */
	public static function get_instance(): self {
		if ( null == self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
}

NACC::get_instance();
