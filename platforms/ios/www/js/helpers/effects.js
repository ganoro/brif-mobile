$.fn.reRender = function(options){
	var that = this;
	defaults = {
		animation: 'fadeIn'
	};
	options = _.extend(defaults, options);
	switch(options.contentType) {
		case 'fadeIn':
			this.removeClass('transition')
				.css('opacity',0);
			setTimeout(function() {
				that.addClass('transition')
					.css('opacity',1);
			}, 100);
			break;
		default:
			break;
	}
	return this;
};

$.fn.formatField = function(){
	var pHolder = $('<div>').addClass('pHolder').text($(this).attr('placeholder'));
	var classes = $(this).attr("class");
	$(this).wrap('<div class="field_wrap"/>');
	$(this).parent('.field_wrap').addClass(classes).append(pHolder);
	$(this).removeAttr('placeholder');
	$(this).bind('focus', function(){
		$(this).siblings('.pHolder').addClass('slide_right');
	});
	$(this).bind('blur', function(){
		if($(this).val() == '') {
			$(this).siblings('.pHolder').removeClass('slide_right');
		}
	});
};