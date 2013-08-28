(function(){
	brif.viewClass.Welcome = Backbone.View.extend({
		className: 'welcome',
		initialize: function(){
		},
		render: function(){
			this.$el.html(brif.templates.welcome);
			this.bindData();
			$('body').css('min-height', $(window).height());
			$('body').html(this.el);
			return this;
		},
		bindData: function(){
			this.$("[data-text='firstName']").text(brif.models.user.get('firstName'));
			this.$("[data-text='lastName']").text(brif.models.user.get('lastName'));
			this.$("[data-text='email']").text(brif.models.user.get('email'));
		},
		signOut: function(){
			$.get('https://accounts.google.com/logout', function(){
				localStorage.clear();
				brif.models.gapi.authenticate();
			});
		},
		events: {
			'click .sign_out': 'signOut'
		}
	});
	brif.views.welcome = new brif.viewClass.Welcome();
})();