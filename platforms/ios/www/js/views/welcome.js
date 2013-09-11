(function(){
	brif.viewClass.Welcome = Backbone.View.extend({
		className: 'welcome',
		initialize: function(){
			_.bindAll(this, 'findContacts', 'renderSearchResults');
			this.$el.html(brif.templates.welcome);
			this.$('[placeholder]').formatField();
			this.bindListeners();
		},
		render: function(){
			var that = this;
			that.$("[data-text='name']").text(localStorage.name);
			that.$("[data-text='email']").text(localStorage.email);
			$('body').css('min-height', $(window).height()).html(that.el);
			return this;
		},
		signOut: function(){
			$.get('https://accounts.google.com/logout', function(){
				localStorage.clear();
				brif.models.gapi.authenticate();
			});
		},
		revokeAccess: function(){
			window.location.href = 'https://accounts.google.com/o/oauth2/revoke?token=' + localStorage.access_token
			return this;
		},
		bindListeners: function(){
			var that = this;
			this.listenTo(brif.models.user, 'change', function(model){
				_.each(model.changed, function(val, key, list){
					that.$("[data-text='"+key+"']").text(val);
				});
			});
			this.listenTo(brif.collections.contacts, 'received:search_resaults', function(contacts){
				that.renderSearchResults(contacts);
			});
		},
		signOut: function(){
			$.get('https://accounts.google.com/logout', function(){
				localStorage.clear();
				brif.models.gapi.authenticate();
			});
		},
		findContacts: function(event){
			var that = this;
			var q = $(event.target).val();
			if(/^\s*$/.test(q)) {
				//input is empty so clear results
				this.$('.results').html('');
				return;
			}
			else {
				brif.collections.contacts.fetch({searchMode: true, query: q});
			}
		},
		renderSearchResults: function(contacts){
			var that = this;
			this.$('.results').html('');
			_.each(contacts, function(contact, index, list){
				var contact = $('<div/>').text(contact.name + ' - ' + contact.emails[0]);
				that.$('.results').prepend(contact);
			});
		},
		events: {
			'click .sign_out': 'signOut',
			'click .revoke': 'revokeAccess',
			'keyup input.contacts': 'findContacts'
		}
	});
	brif.views.welcome = new brif.viewClass.Welcome();
})();