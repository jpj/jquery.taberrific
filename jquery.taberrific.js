(function($) {

	var NS = 'taberrific';
	var PARENT_CLASS = NS+'-parent';
	var BUTTON_CLASS = NS+'-button';
	var HAS_CHILDREN_CLASS = NS+'-has-children';
	var SELECTED_CLASS = NS+'-selected';
	var CHILDREN_CLASS = NS+'-children';

	$.fn.taberrific = function(options) {

		var defaults = {
			consumeRemainingWidth: false
		};

		var o = $.extend(defaults, options);

//		this.test = function() {
//			this.each(function() {
//				alert("You have called test");
//			});
//		};

		return this.each(function() {
			$(this).addClass(PARENT_CLASS);

			var maxWidth = $(this).width();
			var widthTally = 0;
			var hadToUseChildren = false;
			var moreEl = null;

			// Append "More" element
			$(this).append( $(this).find("li:last").clone() );
			var $moreEl = $(this).find("li:last");
			$moreEl.find("a").text("More").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			var moreElWidth = parseInt($moreEl.width()) +
				(isNaN($moreEl.css("margin-left").replace("px", "")) ? 0 : parseInt($moreEl.css("margin-left").replace("px", ""))) +
				(isNaN($moreEl.css("margin-right").replace("px", "")) ? 0 : parseInt($moreEl.css("margin-right").replace("px", ""))) +
				parseInt($moreEl.css("padding-left").replace("px", "")) +
				parseInt($moreEl.css("padding-right").replace("px", "")) +
				(o.borderLeftWidth ? o.borderLeftWidth : (isNaN($moreEl.css("border-left-width").replace("px", "")) ? 0 : parseInt($moreEl.css("border-left-width").replace("px", ""))) ) +
				(o.borderRightWidth ? o.borderRightWidth : (isNaN($moreEl.css("border-right-width").replace("px", "")) ? 0 : parseInt($moreEl.css("border-right-width").replace("px", ""))) );

			var addTabToEl = function(tab, el) {
				tab.click(function() {
					$(this).parent().parent().parent().find("."+HAS_CHILDREN_CLASS+" > a").addClass(SELECTED_CLASS + (o.selectedClass ? ' '+o.selectedClass : '')).html("<i></i> "+tab.find("a").text());
				});
				tab.appendTo(el);
			};

			$(this).data("moreEl", $moreEl);
			$(this).data("moreElWidth", moreElWidth);

			var $parent = $(this);

			$(this).children().each(function(index, child) {

				// Width of element = width + margin + padding + border
				var currentTabWidth = parseInt($(this).width()) +
				(isNaN($(this).css("margin-left").replace("px", "")) ? 0 : parseInt($(this).css("margin-left").replace("px", ""))) +
				(isNaN($(this).css("margin-right").replace("px", "")) ? 0 : parseInt($(this).css("margin-right").replace("px", ""))) +
				parseInt($(this).css("padding-left").replace("px", "")) +
				parseInt($(this).css("padding-right").replace("px", "")) +
				(o.borderLeftWidth ? o.borderLeftWidth : (isNaN($(this).css("border-left-width").replace("px", "")) ? 0 : parseInt($(this).css("border-left-width").replace("px", ""))) ) +
				(o.borderRightWidth ? o.borderRightWidth : (isNaN($(this).css("border-right-width").replace("px", "")) ? 0 : parseInt($(this).css("border-right-width").replace("px", ""))) );

				widthTally += currentTabWidth;

				if (widthTally + $parent.data("moreElWidth") > maxWidth) {
					if (!hadToUseChildren) {
						var moreTabWidth = maxWidth-widthTally+currentTabWidth;
						$(child).before($parent.data("moreEl"));
						var $a = $(child).prev();
						
						$a.addClass(HAS_CHILDREN_CLASS + (o.hasChildrenClass ? ' '+o.hasChildrenClass : ''))
							.css({"width": moreTabWidth+"px"})
							.find("a")
							.addClass(o.anchorClass ? o.anchorClass : '')
							.after('<ul class="'+CHILDREN_CLASS+(o.childrenClass ? ' '+o.childrenClass : '')+'"></ul>');
						$a.find("a").click(function(e) {
							e.preventDefault();
						});
						moreEl = $a.find("ul."+CHILDREN_CLASS);
						moreEl.css({"width": moreTabWidth+"px"});
						hadToUseChildren = true;
					}
					if (index < $parent.children().length) {
						addTabToEl($(this), moreEl);
					}
				} else {
					$(this).find("a").click(function() {
						$(this).parent().parent().find("."+HAS_CHILDREN_CLASS+" > a").html("<i></i> More");
					});
				}
			});
			
			$(this).find("a").addClass(BUTTON_CLASS);
		});
	};
})(jQuery);