(function( $ ) {
	'use strict';

	$(function () {
		if(! $("#everlightbox-settings").length) 
		return;


		function switchSelectors() {
			if($("#all_links").get(0).checked)
				$(".cmb2-id-wp-galleries, .cmb2-id-custom-selector").addClass("hidden");
			else
				$(".cmb2-id-wp-galleries, .cmb2-id-custom-selector").removeClass("hidden");

			if($("#facebook_comments").get(0).checked)
				$(".cmb2-id-facebook-comment-count").removeClass("hidden");
			else
				$(".cmb2-id-facebook-comment-count").addClass("hidden");
		}
		

		$(function () {
			$("#all_links, #facebook_comments").click(switchSelectors);
			switchSelectors();
		});	


		/* BEGIN TABS */
		$("#everlightbox_options").prepend("<div id='el-tabs'></div>");
		$("#el-tabs").append("<a data-tab='1' class='active'>Aspect</a>");
		$("#el-tabs").append("<a data-tab='2'>Features</a>");
		$("#el-tabs").append("<a data-tab='3'>Social</a>");
		$("#el-tabs").append("<a data-tab='4'>Galleries</a>");

		$(".cmb2-wrap").append($("#greentreelabs-plugins"));

		$("#el-tabs a").click(function () {
			$("#el-tabs a").removeClass("active");
			$(this).addClass("active");

			$(".cmb-row, .el-to-hide").hide();
			$(".el-tab-" + $(this).data("tab")).show();
		});
	});
	
})( jQuery );
