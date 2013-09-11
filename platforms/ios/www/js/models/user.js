(function(){
	var gapiLoaded = false;
    brif.modelClass.User = Backbone.Model.extend({
		initialize: function(){
			this.conf = brif.models.config.attributes;
			_.bindAll(this, 'authorize', 'getToken', 'bindListeners');
			this.bindListeners();
			gapiLoaded = true;
			this.getInfo();
			this.getEmail();
		},
		bindListeners: function(){
			var that = this;
			brif.events.on('deviceready', function(){
				that.getInfo();
				that.getEmail();
			});
		},
		authorize: function(options) {
			options = options || {};
			var deferred = $.Deferred();
			var gSecret = this.conf.googleSecret;
			var that = this;
			var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
				response_type: 'code',
				approval_prompt : 'force',
				access_type : 'offline',
				client_id: gSecret.client_id,
				redirect_uri: gSecret.redirect_uris[1],
				scope: this.conf.scopes.join("+")
			});
			authUrl = authUrl.replace(/%2B/g, "+");
			var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
			authWindow.addEventListener('loadstart', function(e) {
				var url = e.url;
				var code = /\?code=(.+)$/.exec(url);
				var error = /\?error=(.+)$/.exec(url);
				if (code || error) {
					authWindow.close();
				}
				if (code) {
					$.post('https://accounts.google.com/o/oauth2/token', {
						code: code[1],
						client_id: gSecret.client_id,
						client_secret: gSecret.client_secret,
						redirect_uri: gSecret.redirect_uris[1],
						grant_type: 'authorization_code'
					}).done(function(data) {
							that.setToken(data);
							that.trigger('recieved:access_token', data.access_token);
							// send data to brif sever
							$.post(that.conf.endPointUrl + '/auth/mobile-signin',data).done(function(resp){

							}).fail(function(resp){
									// user failed authentication
									jQuery.parseJSON(resp);
									console.log(resp.message);
									brif.router.navigate('fail', {trigger: true});
								});
						}).fail(function(response) {
							alert(response);
							response = jQuery.parseJSON(response);
							brif.router.navigate('fail:'+response.error.replace(' ', '_'));
						});
					deferred.resolve({access_token: data.access_token});
				} else if (error) {
					console.log(error);
				}
			});
		},
		getToken: function() {
			var deferred = $.Deferred();
			var gSecret = this.conf.googleSecret;
			var now = new Date().getTime();
			var that = this;
			if (now < localStorage.expires_at) {
				//The token is still valid, so immediately return it from the cache
				deferred.resolve(localStorage.access_token);
			} else if (localStorage.refresh_token) {
				//The token is expired, but we can get a new one with a refresh token
				$.post('https://accounts.google.com/o/oauth2/token', {
					refresh_token: localStorage.refresh_token,
					client_id: gSecret.client_id,
					client_secret: gSecret.client_secret,
					grant_type: 'refresh_token'
				}).done(function(data) {
						that.setToken(data); //cache the token
						deferred.resolve(data.access_token);
					}).fail(function(response) {
						deferred.reject(response.responseJSON);
					});
			} else {
				//We do not have any cached token information yet
				this.authorize().done(function(token){
					deferred.resolve(token);
				});
			}
			return deferred.promise();
		},
		setToken: function(data) {
			localStorage.access_token = data.access_token;
			localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;

			//Calculate exactly when the token will expire, then subtract
			//one minute to give ourselves a small buffer.
			var now = new Date().getTime();
			localStorage.expires_at = now + parseInt(data.expires_in, 10) * 1000 - 60000;
		},
		getInfo: function(){
			var that = this;
			this.getToken().done(function(token){
				$.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+token, function(data){
					that.set(data);
					that.trigger('received:user_data');
				});
			}).fail(function(err){
				console.log(err);
				brif.router.navigate('fail:failed_to_obtain_user_info', true);
			});
		},
		getEmail: function(){
			var that = this;
			this.getToken().done(function(token){
				$.getJSON('https://www.google.com/m8/feeds/contacts/default/full/?access_token=' + token + "&alt=json&max-results=1&callback=?", function(contact){
					var email = contact.feed.id.$t;
					that.set('email', email);
					that.trigger('received:email', email);
				}).fail(function(err){
					brif.router.navigate('fail:failed_to_obtain_email', true);
				});
			});
		}
    });
    
    brif.models.user = new brif.modelClass.User();
})();