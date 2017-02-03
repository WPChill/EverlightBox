<?php

/**
 *
 * @link       http://www.greentreelabs.net
 * @since      1.0.0
 * @package    Everlightbox
 * @subpackage Everlightbox/includes
 * @author     GreenTreeLabs <diego@greentreelabs.net>
 */
class Everlightbox {

	/**
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Everlightbox_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	protected $default_values = array(
				'all_links' => 'on',
				'max_width' => 90,
				'max_height' => 90,
				'round_corners' => 'on',
				'facebook_comments' => 'on',
				'sticky_caption' => 'on',
				'sticky_buttons' => 'on',
				'theme' => 'dark',
				'facebook_app_id' => '1213605408691751'
			);

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->plugin_name = 'everlightbox';
		$this->version = EVERLIGHTBOX_VERSION;

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Everlightbox_Loader. Orchestrates the hooks of the plugin.
	 * - Everlightbox_i18n. Defines internationalization functionality.
	 * - Everlightbox_Admin. Defines all hooks for the admin area.
	 * - Everlightbox_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-everlightbox-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-everlightbox-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-everlightbox-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-everlightbox-public.php';

		$this->loader = new Everlightbox_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Everlightbox_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Everlightbox_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Everlightbox_Admin( $this->get_plugin_name(), $this->get_version(), $this->default_values );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'init' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'menu' );
		$this->loader->add_action( 'cmb2_admin_init', $plugin_admin, 'settings_form' );
		$this->loader->add_filter( 'plugin_row_meta', $plugin_admin, 'register_links', 10, 2 );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Everlightbox_Public( $this->get_plugin_name(), $this->get_version() );
		$options = get_option('everlightbox_options');
		$plugin_public->options = apply_filters('everlightbox_options', $options);

		if(isset($_GET['everlightbox-debug']))
		{
			echo "<!--\n";
			print_r($plugin_public->options);
			echo "\n-->\n";			
		}

		if(isset($plugin_public->options['facebook_comments']) && $plugin_public->options['facebook_comments'] == 'on')
		{
			$this->loader->add_action( 'wp_ajax_fetch_comments_count', $plugin_public, 'fetch_comments_count' );
		}

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts', 10 );
		$this->loader->add_action( 'wp_footer', $plugin_public, 'footer' );
		$this->loader->add_action( 'wp_head', $plugin_public, 'header', 10 );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Everlightbox_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
