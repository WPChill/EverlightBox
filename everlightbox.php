<?php
/**
* Plugin Name:              EverlightBox
* Description:              Light and stylish lightbox for WordPress
* Version:                  1.1.10
* Author:                   MachoThemes
* Author URI:               https://www.machothemes.com
* Requires:                 4.9 or higher
* License:                  GPLv3 or later
* License URI:              http://www.gnu.org/licenses/gpl-3.0.html
* Requires PHP:             5.6
 * Text Domain:             everlightbox
 * Domain Path:             /languages
*
* Copyright 2015-2019       GreenTreeLabs     diego@greentreelabs.net    
* Copyright 2019            MachoThemes       office@machothemes.com
* SVN commit with proof of ownership transfer: https://plugins.trac.wordpress.org/changeset/2163481/ 
*
* NOTE: MachoThemes took ownership of this plugin on: 09/26/2019 08:49:37 AM as can be seen from the above SVN commit.
*
* Original Plugin URI:      https://everlightbox.io
* Original Author URI:      https://greentreelabs.net
* Original Author:          https://profiles.wordpress.org/greentreealbs/
*/


// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
    die;
}
define( "EVERLIGHTBOX_VERSION", "1.1.10" );
define( "EVERLIGHTBOX_URL", plugin_dir_url( __FILE__ ) );

if ( !function_exists( "evebox_fs" ) ) {
    // Create a helper function for easy SDK access.
    function evebox_fs()
    {
        global  $evebox_fs ;
        
        if ( !isset( $evebox_fs ) ) {
            // Activate multisite network integration.
            if ( !defined( 'WP_FS__PRODUCT_1981_MULTISITE' ) ) {
                define( 'WP_FS__PRODUCT_1981_MULTISITE', true );
            }
            // Include Freemius SDK.
            require_once dirname( __FILE__ ) . '/freemius/start.php';
            $evebox_fs = fs_dynamic_init( array(
                'id'             => '1981',
                'slug'           => 'everlightbox',
                'type'           => 'plugin',
                'public_key'     => 'pk_4c73d353ba94b1ae21c4ee9b607e1',
                'is_premium'     => false,
                'has_addons'     => false,
                'has_paid_plans' => true,
                'menu'           => array(
                'slug'       => 'everlightbox_options',
                'first-path' => 'admin.php?page=everlightbox_welcome_page',
            ),
                'is_live'        => true,
            ) );
        }
        
        return $evebox_fs;
    }
    
    // Init Freemius.
    evebox_fs();
    // Signal that SDK was initiated.
    do_action( 'evebox_fs_loaded' );
    function activate_everlightbox()
    {
        require_once plugin_dir_path( __FILE__ ) . 'includes/class-everlightbox-activator.php';
        Everlightbox_Activator::activate();
    }
    
    /**
     * The code that runs during plugin deactivation.
     * This action is documented in includes/class-everlightbox-deactivator.php
     */
    function deactivate_everlightbox()
    {
        require_once plugin_dir_path( __FILE__ ) . 'includes/class-everlightbox-deactivator.php';
        Everlightbox_Deactivator::deactivate();
    }
    
    register_activation_hook( __FILE__, 'activate_everlightbox' );
    register_deactivation_hook( __FILE__, 'deactivate_everlightbox' );
    /**
     * The core plugin class that is used to define internationalization,
     * admin-specific hooks, and public-facing site hooks.
     */
    require plugin_dir_path( __FILE__ ) . 'includes/class-everlightbox.php';
    /**
     * Begins execution of the plugin.
     *
     * Since everything within the plugin is registered via hooks,
     * then kicking off the plugin from this point in the file does
     * not affect the page life cycle.
     *
     * @since    1.0.0
     */
    function run_everlightbox()
    {
        $plugin = new Everlightbox();
        $plugin->run();
    }
    
    run_everlightbox();
}
