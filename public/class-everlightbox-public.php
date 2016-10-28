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
	private function option_exists($name, $print=true) {
		if($print)
			return isset($this->options[$name]) ? 
				"true" : "false";		

		return isset($this->options[$name]);
	}	

	/**
	 * Print scripts inside footer
	 *
	 * @since    1.0.0
	 */
	public function footer() { ?>
		<div id="fb-root"></div>
		<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7&";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));</script>
		<style>
			#everlightbox-slider .slide img, 
			#everlightbox-slider .slide .everlightbox-video-container, 
			#everlightbox-slider .slide .everlightbox-inline-container {
				max-width: <?php echo $this->options['max_width'] ?>%;
				max-height: <?php echo $this->options['max_height'] ?>%;
			}

			<?php if($this->option_exists('round_corners', false)) : ?>
			#everlightbox-slider .slide img {
				border-radius:4px;
			}
			<?php endif ?>
		</style>
		<script>
		jQuery(function () {
			var $ = jQuery;
			var $linked = jQuery();

			function endsWith(str, suffix) {
			    return str.indexOf(suffix, str.length - suffix.length) !== -1;
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

			<?php if($this->option_exists('all_links', false)) : ?>

			var $all = $();
			$("a").not($linked).each(function() {
				var href = $(this).attr("href");
				if(href) {
					href = href.toLowerCase();

					if(endsWith(href, ".jpg") || endsWith(href, ".jpeg") ||
					   endsWith(href, ".gif") || endsWith(href, ".bmp")) {
						$all = $all.add($(this));
					}
				}
			});
			$all.addClass("everlightbox-trigger");
			<?php endif ?>
			<?php
				$sticky_buttons_css = $this->option_exists('sticky_buttons', false) ? "sticky-buttons" : "";
				$sticky_caption_css = $this->option_exists('sticky_caption', false) ? "sticky-caption" : "";
			?>
			$(".everlightbox-trigger").everlightbox({
				rootCssClass: '<?php echo $this->options['theme'] . " " . $sticky_buttons_css . " " . $sticky_caption_css ?>',
				facebookIcon: <?php echo $this->option_value('social', 'facebook') ?>,
				twitterIcon: <?php echo $this->option_value('social', 'twitter') ?>,
				pinterestIcon: <?php echo $this->option_value('social', 'pinterest') ?>,
				houzzIcon: <?php echo $this->option_value('social', 'houzz') ?>,
				googleplusIcon: <?php echo $this->option_value('social', 'googleplus') ?>,
				tumblrIcon: <?php echo $this->option_value('social', 'tumblr') ?>,
				facebookLike: <?php echo $this->option_exists('facebook_like') ?>,
				downloadIcon: <?php echo $this->option_exists('download') ?>,
				keyboard: !<?php echo $this->option_exists('disable_keyb_nav') ?>,
				loopAtEnd: <?php echo $this->option_exists('loop') ?>,
				closeBg: <?php echo $this->option_exists('close_bg') ?>,
				facebook_comments: <?php echo $this->option_exists('facebook_comments') ?>
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/everlightbox.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/everlightbox.js', array( 'jquery' ), $this->version, false );
	}

}
