<?php

/**
 * Provide a admin area view for the plugin
 *
 *
 * @link       http://www.greentreelabs.net
 * @since      1.0.0
 *
 * @package    Everlightbox
 * @subpackage Everlightbox/admin/partials
 */
 
?>

<div class="wrap" id="everlightbox-settings">
	<h1>EverlightBox settings</h1>
	<?php if($evebox_fs->is_free_plan()) : ?>
	<div class="upgrade-panel notice notice-error">
		<p>
			<a href="?page=everlightbox_options-pricing"><strong>Unlock</strong></a> all premium features!
		</p>		
	</div>
	<?php endif ?>
    <script>
	    <?php foreach ($tabs->get_tabs() as $k => $v) : ?>
        EverlightBoxTabs.add("<?php echo $k ?>", "<?php echo $v ?>");
        <?php endforeach; ?>
    </script>
	<?php echo cmb2_metabox_form($this->metabox_id, $this->option_key) ?>	

	<div id="greentreelabs-plugins" style="display:none" class="el-tab-galleries el-to-hide everlightbox-plugins">
		<p>Suggested galleries:</p>
		<div class="gtl-item">
			<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) ); ?>../images/final-tiles.jpg">
			<div class="text">
				<h3>Final Tiles Gallery</h3>
				<p>Gallery plugin with 2 available layouts: <strong>Final Tiles</strong> 
					and <strong>Masonry</strong>. The only gallery with mixed image sizes.			
				</p>
				<a class="button" href="https://www.final-tiles-gallery.com/wordpress/pricing?utm_source=everlightbox&utm_medium=banner&utm_campaign=EverlightBox">Read more</a>
			</div>
		</div>	
		<div class="gtl-item">
			<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) ); ?>../images/photoblocks.jpg">
			<div class="text">
				<h3>PhotoBlocks Gallery</h3>
				<p>Build your gallery with a super easy <strong>drag and drop</strong> tool.</p>
				<a class="button" href="https://photoblocks.greentreelabs.net/pricing/?utm_source=everlightbox&utm_medium=banner&utm_campaign=EverlightBox">Read more</a>
			</div>
		</div>	
		<div class="gtl-item">
			<img src="<?php  echo esc_url(plugin_dir_url( __FILE__ ) ); ?>../images/circles.jpg">
			<div class="text">
				<h3>Circles Gallery</h3>
				<p>Three plugins in one: not only an original gallery plugin for WordPress but also a 
					responsive multi-column layout for texts and a “Team members” plugin.
				</p>
				<a class="button" href="http://circles-gallery.com/?utm_source=everlightbox&utm_medium=banner&utm_campaign=EverlightBox">Read more</a>
			</div>
		</div>
	</div>
</div>

<p class="el-footer">
	<a href="https://wordpress.org/support/plugin/everlightbox/reviews/">Rate ⭐⭐⭐⭐⭐ if you liked this plugin, thanks!</a><br>
	<br>
	EverlightBox is a proudly developed by <a href="https://www.machothemes.com/">MachoThemes</a>.<br>
	Please report bugs and suggestions.	
</p>