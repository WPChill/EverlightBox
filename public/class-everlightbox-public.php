<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://www.greentreelabs.net
 * @since      1.0.0
 *
 * @package    Everlightbox
 * @subpackage Everlightbox/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Everlightbox
 * @subpackage Everlightbox/public
 * @author     GreenTreeLabs <diego@greentreelabs.net>
 */
class Everlightbox_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Options
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      array    $options 
	 */
	public $options;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Get option value
	 *
	 * @since    1.0.0
	 */
	private function option_value($name, $value=null) {
		if(isset($this->options[$name]))
		{
			if(is_string($this->options[$name]))
				return $this->options[$name];

			if(is_array($this->options[$name]))
				return in_array($value, $this->options[$name]) ? "true" : "false";
		}

		return "false";
	}	

	/**
	 * Check if option exists
	 *
	 * @since    1.0.0
	 */
	private function option_exists($name, $print=true)
	{
		if($print)
			return isset($this->options[$name]) ? 
				"true" : "false";		

		return isset($this->options[$name]);
	}

	/**
	 * Fetch comments count
	 *
	 * @since    1.0.10
	 */
	public function fetch_comments_count()
	{
		if (check_admin_referer('everlightbox', 'everlightbox'))
		{
			$ch = curl_init();
			$timeout = 15;
			curl_setopt($ch, CURLOPT_URL, 'http://graph.facebook.com/v2.4/?fields=share{comment_count}&id=' . $_GET['url']);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$data = curl_exec($ch);
			curl_close($ch);

			echo $data;

		}
		wp_die();
	}

	/**
	 * Print scripts inside header
	 *
	 * @since    1.0.13
	 */
	public function header() { 

		$icon_path = plugin_dir_url( __FILE__ ) . 'css/fonts/everlightbox-icons';
		$icon_path = apply_filters( 'everlightbox_icon_path', $icon_path );

		?>
        <style>
        	@font-face {
				font-family: "everlightbox-icons";
				src: url("<?php echo $icon_path ?>.eot");
				src: url("<?php echo $icon_path ?>.eot?#iefix") format("embedded-opentype"),
				url("<?php echo $icon_path ?>.woff") format("woff"),
				url("<?php echo $icon_path ?>.ttf") format("truetype"),
				url("<?php echo $icon_path ?>.svg#everlightbox-icons") format("svg");
				font-weight: normal;
				font-style: normal;

			}
            #everlightbox-slider .slide img,
            #everlightbox-slider .slide .everlightbox-video-container,
            #everlightbox-slider .slide .everlightbox-inline-container {
                max-width: calc(<?php echo $this->options['max_width'] ?>% - 75px);
                max-height: calc(<?php echo $this->options['max_height'] ?>% - 75px);
            }

            <?php 

            	$icons_size = 15;
            	if(isset($this->options['icons_size']))
            		$icons_size = $this->options['icons_size'];
            ?>

            #everlightbox-slider .everlightbox-comments, 
            #everlightbox-slider .slide .everlightbox-button {
            	font-size: <?php echo $icons_size ?>px;
            }


            <?php if($this->option_exists('round_corners', false)) : ?>
            #everlightbox-slider .slide img {
                border-radius:4px;
            }
            <?php endif ?>
        </style>
        <script>
            var __everlightbox_conf = {
                facebookIcon: <?php echo $this->option_value('social', 'facebook') ?>,
                twitterIcon: <?php echo $this->option_value('social', 'twitter') ?>,
                pinterestIcon: <?php echo $this->option_value('social', 'pinterest') ?>,
                houzzIcon: <?php echo $this->option_value('social', 'houzz') ?>,
                googleplusIcon: <?php echo $this->option_value('social', 'googleplus') ?>,
                tumblrIcon: <?php echo $this->option_value('social', 'tumblr') ?>,
                facebookLike: <?php echo $this->option_exists('facebook_like') ?>,
                downloadIcon: <?php echo $this->option_exists('download') ?>,
                fullscreenIcon: <?php echo $this->option_exists('fullscreen_icon') ?>,
                keyboard: !<?php echo $this->option_exists('disable_keyb_nav') ?>,
                loopAtEnd: <?php echo $this->option_exists('loop') ?>,
                closeBg: <?php echo $this->option_exists('close_bg') ?>,
                anchorButtonsToEdges: <?php echo $this->option_exists('buttons_edges') ?>,
                facebookComments: <?php echo $this->option_exists('facebook_comments') ?>,
                facebookCommentCount: <?php echo $this->option_exists('facebook_comment_count') ?>,
                facebookAppId: '<?php echo $this->options['facebook_app_id'] ?>'
            };
        </script>
    <?php
	}

	/**
	 * Print scripts inside footer
	 *
	 * @since    1.0.0
	 */
	public function footer() {

	 ?>

        <?php if(! $this->option_exists('no_facebook_scripts', false)) : ?>

		<div id="fb-root"></div>
		<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7&";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));</script>

        <?php endif ?>



		<script>
		jQuery(function () {
			var $ = jQuery;
			var $linked = jQuery();

			function endsWith(str, suffix) {
				var clean = str.split('?')[0];
			    return str.indexOf(suffix, clean.length - suffix.length) !== -1;
			}

			<?php if($this->option_exists('wp_galleries', false) ||
					 $this->option_exists('all_links', false)) : ?>

			$linked.add($(".gallery .gallery-item a").addClass("everlightbox-trigger"));
			$linked.add($(".tiled-gallery .tiled-gallery-item a").addClass("everlightbox-trigger"));

			$('.gallery').each(function (galleryIndex) {
				$('.gallery-item a', this).each(function (i, o) {
					if(! $(o).attr("rel"))
						$(o).attr("rel", "everlightbox-" + galleryIndex);
				});
			});
			$('.tiled-gallery').each(function (galleryIndex) {
				$('.tiled-gallery-item a', this).each(function (i, o) {
					if(! $(o).attr("rel"))
						$(o).attr("rel", "everlightbox-" + galleryIndex);
				});
			});

			$('.gallery figcaption').each(function () {
				var title = $.trim($(this).text());
				$(this).parents(".gallery-item").find("a").attr("title", title);
			});
			$('.tiled-gallery figcaption').each(function () {
				var title = $.trim($(this).text());
				$(this).parents(".tiled-gallery-item").find("a").attr("title", title);
			});

			<?php endif ?>

			<?php if($this->option_exists('wp_images', false) ||
			         $this->option_exists('all_links', false)) : ?>
			$(".wp-caption-text").each(function () {
				var title = $.trim($(this).text());
				var $parent = $(this).parent();
				$parent.find("a").attr("title", title).addClass("everlightbox-trigger");				
				$linked.add($parent.find("a"));
			});

			<?php endif ?>
			<?php if($this->option_exists('all_links', false)) : ?>

			var $all = $();
			$("a").not($linked).each(function() {
				var href = $(this).attr("href");
				if(href) {
					href = href.toLowerCase();

					if(endsWith(href, ".jpg") || endsWith(href, ".jpeg") ||
					   endsWith(href, ".gif") || endsWith(href, ".png")) {
						$all = $all.add($(this));
					}
				}
			});
			$all.addClass("everlightbox-trigger");
			<?php endif ?>
			<?php if($this->option_exists('custom_selector', false)) : ?>
			var $all = $();
			$("<?php echo $this->options['custom_selector'] ?>").not($linked).each(function() {
				var href = $(this).attr("href");
				if(href) {
					href = href.toLowerCase();

					if(endsWith(href, ".jpg") || endsWith(href, ".jpeg") ||
					   endsWith(href, ".gif") || endsWith(href, ".png")) {
						$all = $all.add($(this));
					}
				}
			});
			$all.addClass("everlightbox-trigger");
			<?php endif ?>
			
			<?php
				$sticky_buttons_css = $this->option_exists('sticky_buttons', false) ? "sticky-buttons" : "";
				$sticky_caption_css = $this->option_exists('sticky_caption', false) ? "sticky-caption" : "";
				$buttons_edges_css = $this->option_exists('buttons_edges', false) ? "buttons-edges" : "";
				$buttons_nobg_css = $this->option_exists('disable_buttons_background', false) ? "buttons-no-bg" : "";
				$root_classes = "$sticky_buttons_css $sticky_caption_css $buttons_nobg_css $buttons_edges_css";
				$root_classes = apply_filters( 'everlightbox_css_classes', $root_classes);
			?>

			$(".everlightbox-trigger").everlightbox({
				rootCssClass: '<?php echo $this->options['theme']. " " . $root_classes ?>',
				facebookIcon: <?php echo $this->option_value('social', 'facebook') ?>,
				twitterIcon: <?php echo $this->option_value('social', 'twitter') ?>,
				pinterestIcon: <?php echo $this->option_value('social', 'pinterest') ?>,
				houzzIcon: <?php echo $this->option_value('social', 'houzz') ?>,
				googleplusIcon: <?php echo $this->option_value('social', 'googleplus') ?>,
				tumblrIcon: <?php echo $this->option_value('social', 'tumblr') ?>,
				facebookLike: <?php echo $this->option_exists('facebook_like') ?>,
				downloadIcon: <?php echo $this->option_exists('download') ?>,
				fullscreenIcon: <?php echo $this->option_exists('fullscreen_icon') ?>,
				keyboard: !<?php echo $this->option_exists('disable_keyb_nav') ?>,
				loopAtEnd: <?php echo $this->option_exists('loop') ?>,
				closeBg: <?php echo $this->option_exists('close_bg') ?>,
				anchorButtonsToEdges: <?php echo $this->option_exists('buttons_edges') ?>,
				facebookComments: <?php echo $this->option_exists('facebook_comments') ?>,
				facebookCommentCount: <?php echo $this->option_exists('facebook_comment_count') ?>,
				labels: {
					"comments": "<?php _e('comments', 'everlightbox') ?>"
				},
				nonce: "<?php echo wp_create_nonce('everlightbox'); ?>"
			});
		});
		</script>
	<?php }

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_register_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/everlightbox.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_register_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/everlightbox.js', array( 'jquery' ), $this->version, true );
		wp_enqueue_script( $this->plugin_name );

		if($this->option_exists('facebook_comments', false))
		{
			wp_localize_script( $this->plugin_name, 'everlightbox_ajax_object', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
		}
	}

}
