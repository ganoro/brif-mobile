(function(){
	brif.viewClass.Welcome = Backbone.View.extend({
		className: 'welcome',
		initialize: function(){
			this.$el.html(brif.templates.welcome);
			this.bindListeners();
			this.dataComplete = false;
		},
		checkData: function(){
			dataDependency = [
				brif.models.user.get('name'),
				brif.models.user.get('email')
			];
			_.each(dataDependency, function(elm, index, list){
				if(_.isEmpty(elm)) return false;
			});
			return true;

		},
		render: function(){
			$('body')
				.css('min-height', $(window).height())
				.html(this.el);
			return this;
		},
		bindListeners: function(){
			var that = this;
			this.listenTo(brif.models.user, 'change', function(model){
				_.each(model.changed, function(val, key, list){
					that.$("[data-text='"+key+"']").text(val);
				});
			});
		},
		signOut: function(){
			$.get('https://accounts.google.com/logout', function(){
				localStorage.clear();
				brif.models.user.signIn();
			});
		},
		events: {
			'click .sign_out': 'signOut'
		}
	});
	brif.views.welcome = new brif.viewClass.Welcome();
})();