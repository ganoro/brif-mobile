(function(){
	brif.viewClass.Fail = Backbone.View.extend({
		className: 'fail',
		initialize: function(){
			this.$el.html(brif.templates.fail);
		},
		render: function(){
			$('body').html(this.el);
			return this;
		},
		injectFailMessage: function(msg) {
			this.$('.message').text(msg);
		}
	});
	brif.views.fail = new brif.viewClass.Fail();
})();