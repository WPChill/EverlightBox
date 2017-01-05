var EverlightBoxTabs = function () {
	var tabs = [];
	return {
		add: function (code, text) {
			tabs.push({ code: code, text: text });
		},
		get: function () {
			return tabs;
        }
	}
}();
(function( $ ) {
	'use strict';

	$(function () {
		if(! $("#everlightbox-settings").length) 
		return;


		function switchSelectors() {
			if($("#all_links").get(0).checked) {
				$(".cmb2-id-wp-galleries, .cmb2-id-custom-selector").addClass("hidden");
				$(".cmb2-id-wp-images, .cmb2-id-custom-selector").addClass("hidden");
			} else {
				$(".cmb2-id-wp-galleries, .cmb2-id-custom-selector").removeClass("hidden");
				$(".cmb2-id-wp-images, .cmb2-id-custom-selector").removeClass("hidden");
			}
			if($("#facebook_comments").get(0).checked)
				$(".cmb2-id-facebook-comment-count").removeClass("hidden");
			else
				$(".cmb2-id-facebook-comment-count").addClass("hidden");
		}
		

		$(function () {
			$("#all_links, #facebook_comments").click(switchSelectors);
			switchSelectors();
		});	

		/* TABS */
		var tabs = [];
		$(".cmb-row").each(function () {
			var classes = $(this).attr("class").split(' ');
			$.each(classes, function () {
				if(this.substr(0, "e-tab-".length) == "el-tab-") {
					var tab = this.split('-')[2];
					if(! $.inArray(tab, tabs))
						tabs.push(tab);
				}
			});
		});

		tabs.sort();

		$("#everlightbox_options").prepend("<div id='el-tabs'></div>");

		EverlightBoxTabs.get().map(function (i) {
            $("#el-tabs").append("<a data-tab='" + i.code + "'>" + i.text + "</a>");
		});
        $("#el-tabs a:first").addClass("active");

		$(".cmb2-wrap").append($(".everlightbox-plugins"));

		$("#el-tabs a").click(function () {
			$("#el-tabs a").removeClass("active");
			$(this).addClass("active");

			$(".cmb-row, .el-to-hide").hide();
			$(".el-tab-" + $(this).data("tab")).show();
		});
	});
	
})( jQuery );
