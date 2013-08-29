(function(){    
    brif.modelClass.User = Backbone.Model.extend({
		initialize: function(){
			this.listenTo(brif.models.gapi, 'user authenticated', this.copyFromLocal);
		},
		copyFromLocal: function(){
			var authData = jQuery.parseJSON(localStorage.getItem('authData'));
			this.set({
				access_token: authData.access_token,
				expires_in: authData.expires_in,
				refresh_token: authData.refresh_token
			});
		},
        url: brif.models.config.get('endPointUrl')+'/signin'
    });
    
    brif.models.user = new brif.modelClass.User();
})();