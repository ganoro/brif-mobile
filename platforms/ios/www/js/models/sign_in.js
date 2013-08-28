(function () {
	brif.modelClass.SignIn = Backbone.Model.extend({
		initialize:function () {
			_.bindAll(this, 'authenticate', 'signIn');
			brif.events.on('deviceready', this.authenticate);
		},
		defaults:{
			apiKey:'AIzaSyDQU5DYKmI1gvk-RGwLJFL0g2r0_Tm5Tko',
			scopes:['https://mail.google.com', 'https://www.google.com/m8/feeds/', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile']
		},
		getUserNameAndEmail: function(){
			var that = this;
			// Get user's name & email
			$.ajax({
				url: 'https://www.google.com/m8/feeds/contacts/default/full/',
				dataType: 'xml',
				headers: {
					'Authorization': 'Bearer ' + brif.models.user.get('access_token'),
					'Gdata-version': '3.0'
				},
				success: function(resp){
					// resp holds by default the first 20 contacts we need to find just the user
					var userEmail = $(resp).find('feed author email').text();
					var userName = $(resp).find('feed author name').text();
					brif.models.user.set({
						email: userEmail,
						firstName: userName.split(' ')[0],
						lastName: userName.split(' ')[1]
					});
					// load main app
					brif.router.navigate('main', {trigger: true});
				},
				error: function(err) {
					switch(err.statusText) {
						case 'Token revoked':
						case 'Token expired':
							localStorage.clear();
							that.authenticate();
					}
				}
			});
		},
		authenticate: function(){
			brif.router.navigate('', {trigger: true});
			var that = this;
			var authData = jQuery.parseJSON(localStorage.getItem('authData'));
			if(!_.isEmpty(authData)) {
				// save data to user model for convenient access
				brif.models.user.set({
					access_token: authData.access_token,
					expires_in: authData.expires_in,
					refresh_token: authData.refresh_token
				});
				this.getUserNameAndEmail();
			} else {
				this.signIn({
					client_id: that.get('googleSecret').client_id,
					redirect_uri: that.get('googleSecret').redirect_uris[1],
					client_secret: that.get('googleSecret').client_secret,
					scope: brif.models.signIn.get('scopes')
				});
			}
		},
		signIn: function(options) {
			var that = this;
			var scopes = options.scope.join("+");
			var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
				response_type: 'code',
				approval_prompt : 'force',
				access_type : 'offline',
				client_id: options.client_id,
				redirect_uri: options.redirect_uri,
				scope: scopes
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
						client_id: options.client_id,
						client_secret: options.client_secret,
						redirect_uri: options.redirect_uri,
						grant_type: 'authorization_code'
					}).done(function(data) {
						// take only what you need
						var authData = {
							access_token: data.access_token,
							expires_in: data.expires_in,
							refresh_token: data.refresh_token
						};
						// Put the authData into storage
						localStorage.setItem('authData', JSON.stringify(authData));

						// send data to brif sever
						$.post(that.get('endPointUrl') + '/auth/mobile-signin',data)
							.done(function(resp){})
							.fail(function(resp){
								// user failed authentication
								jQuery.parseJSON(resp);
								console.log(resp.message);
								brif.router.navigate('fail', {trigger: true});
							});

						that.authenticate();

					}).fail(function(response) {
						alert(response);
						response = jQuery.parseJSON(response);
						$('body').html(response.error);
					});
				} else if (error) {
					console.log(error);
				}
			});
		}
	});
	brif.models.signIn = new brif.modelClass.SignIn({
		googleSecret: brif.models.config.get('googleSecret')
	});
})();