<?php

/**
 * EverlightBox Welcome Page
 *
 *
 * @link       http://www.greentreelabs.net
 * @since      1.1.3
 *
 * @package    Everlightbox
 * @subpackage Everlightbox/admin/partials
 */
 
?>
<style>
    #wpcontent {
        padding-left:0;        
    }
    #wpbody {
        background: #f3f6f8;
    }
    .everlightbox-theme .eb-top {
        background-color: #fff;
        text-align: center;
        box-shadow: 0 1px 0 rgba(200,215,225,0.5), 0 1px 2px #e9eff3;
    }
    .everlightbox-theme .eb-inner {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin: 0 auto;
        width: 100%;
        max-width: 45rem;
        padding-bottom: .375rem;
    }
    .everlightbox-theme .eb-header {
        margin-top:10px;
    }
    .everlightbox-theme .eb-content {
        margin: 0 auto;
        text-align: left;
        max-width: 45rem;
        padding: 1.5rem;
        min-height: 100vh;
    }
    .everlightbox-theme h1 {
        text-align:center;
    }
    .everlightbox-theme .eb-card {
        display: block;
        position: relative;
        margin: 0 auto 10px auto;
        padding: 16px;
        box-sizing: border-box;
        background: white;
        box-shadow: 0 0 0 1px rgba(200, 215, 225, 0.5), 0 1px 2px #e9eff3;
    }
    .everlightbox-theme .eb-card ul {
        padding-left: 40px;
        margin:20px 0;
    }
    .everlightbox-theme .eb-card ul li {
        list-style-type: circle;
    }
    .resp-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }
    .resp-container {
        position: relative;
        overflow: hidden;
        padding-top: 56.25%;
    }
    .everlightbox-theme .eb-button {
        border-style: solid;
        border-width: 1px 1px 2px;
        cursor: pointer;
        display: inline-block;
        overflow: hidden;
        font-size: 14px;
        font-weight: 500;
        text-overflow: ellipsis;
        text-decoration: none;
        vertical-align: top;
        box-sizing: border-box;
        font-size: 14px;
        line-height: 21px;
        border-radius: 4px;
        padding: 7px 14px 9px;
        appearance: none;
        background: #00BE28;
        border-color: #00a523;
        color: white;
        margin: 0 0 .75rem;
        text-decoration: none;
    }
    .everlightbox-theme .eb-button:hover {
        background: #00a523;
        border-color: #008b1d;
    } 
    .eb-center {
        text-align:center;
    }
    .eb-mt-20 {
        margin-top:20px;
    }
    .eb-mt-40 {
        margin-top:40px;
    }
    .eb-mb-0 {
        margin-bottom:0;
    }
    .eb-card img {
        max-width:100%;
    }
</style>
<div class="everlightbox-theme">

    <div class="eb-top">
        <div class="eb-inner">
            <div class="eb-header"><img src="<?php echo plugin_dir_url( __FILE__ ) ?>../images/logo.svg"></div>
        </div>
    </div>    

    <div class="eb-content">
        <h1><?php esc_html_e("Welcome to EverlightBox", "everlightbox") ?></h1>

        <div class="eb-card">
            <h2>Lightbox with social attitude</h2>

            <p>EverlightBox has a very social attitude: users can comment the image they currently seeing.</p>
            <p>EverlightBox is a very <strong>fast</strong> and <strong>safe</strong> lightbox for WordPress. It can be used with WordPress galleries like:</p>
            <ul>
                <li>WordPress native galleries</li>
                <li><a href="https://wordpress.org/plugins/final-tiles-grid-gallery-lite/" target="_blank">Final Tiles Gallery</a></li>
                <li><a href="https://wordpress.org/plugins/photoblocks-grid-gallery/" target="_blank">PhotoBlocks Grid Gallery</a></li>
            </ul>
            <?php if( $evebox_fs->is_free_plan() ) : ?>
            <p class="eb-center eb-mt-40">
                <a href="<?php echo esc_url( $evebox_fs->get_upgrade_url() ); ?>" class="eb-button">Go Premium</a>
            </p>
            <?php endif ?>
            <p class="eb-center">and get: Facebook comments sidebar, background graphics, new icon sets, 3 new themes.</p>
        </div>

        <div class="eb-card">
            <h2>Boost up visits, engage your users</h2>
            <p>A unique feature of EverlightBox is Facebook comments. Letting users commenting each photo is an effective
                way to engage your audience and get more users.
            </p>
            <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) ); ?>../images/mac.png">
            <?php if( $evebox_fs->is_free_plan() ) : ?>
            <p class="eb-center eb-mt-20 eb-mb-0">
                <a href="<?php echo esc_url( $evebox_fs->get_upgrade_url() ); ?>" class="eb-button">Get Facebook sidebar</a>
            </p>
            <?php endif ?>
        </div>

        <div class="eb-card">
            <h2>Mobile ready</h2>
            <p>EverlightBox supports swipe gestures in order to keep the natural feeling and the expected user experience.</p>
            <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) ); ?>../images/mobile.png">
        </div>

        <div class="eb-card">
            <h2>3 new themes</h2>
            <p>Purchasing a premium license you'll get 3 new additional themes for your website</p>
            <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) ); ?>../images/theme.jpg">
            <?php if( $evebox_fs->is_free_plan() ) : ?>
            <p class="eb-center eb-mt-20 eb-mb-0">
                <a href="<?php echo esc_url( $evebox_fs->get_upgrade_url() ); ?>" class="eb-button">Get new themes</a>
            </p>
            <?php endif ?>
        </div>
    </div>    
</div>