//(function () {
//	brif.modelClass.Gapi = Backbone.Model.extend({
//		initialize:function () {
//			this.conf = brif.models.config.attributes;
//			_.bindAll(this, 'authenticate', 'signIn');
////			brif.events.on('deviceready', this.authenticate);
//		},
//		getNameAndEmail: function(){
//			var that = this;
//			// Get user's name & email
//			$.ajax({
//				url: 'https://www.google.com/m8/feeds/contacts/default/full/',
//				dataType: 'xml',
//				headers: {
//					'Authorization': 'Bearer ' + brif.models.user.get('access_token'),
//					'Gdata-version': '3.0'
//				},
//				success: function(resp){
//					// resp holds by default the first 20 contacts we need to find just the user
//					var userEmail = $(resp).find('feed author email').text();
//					var userName = $(resp).find('feed author name').text();
//					brif.models.user.set({
//						email: userEmail,
//						name: userName,
//						given_name: userName.split(' ')[0],
//						family_name: userName.split(' ')[1]
//					});
//					that.trigger('name and email loaded');
//				},
//				error: function(err) {
//					switch(err.status) {
//						case 401: //Token expired
//							localStorage.clear();
//							that.authenticate();
//					}
//				}
//			});
//		},
//		authenticate: function(){
//			brif.router.navigate('', {trigger: true});
//			var authData = jQuery.parseJSON(localStorage.getItem('authData'));
//			if(!_.isEmpty(authData)) {
//				this.trigger('user_authenticated');
//				this.getNameAndEmail();
//			} else {
//				this.signIn();
//			}
//		},
//		signIn: function() {
//			var gSecret = this.conf.googleSecret;
//			var that = this;
//			var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
//				response_type: 'code',
//				approval_prompt : 'force',
//				access_type : 'offline',
//				client_id: gSecret.client_id,
//				redirect_uri: gSecret.redirect_uris[1],
//				scope: this.conf.scopes.join("+")
//			});
//			authUrl = authUrl.replace(/%2B/g, "+");
//			var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
//			authWindow.addEventListener('loadstart', function(e) {
//				var url = e.url;
//				var code = /\?code=(.+)$/.exec(url);
//				var error = /\?error=(.+)$/.exec(url);
//				if (code || error) {
//					authWindow.close();
//				}
//				if (code) {
//					$.post('https://accounts.google.com/o/oauth2/token', {
//						code: code[1],
//						client_id: gSecret.client_id,
//						client_secret: gSecret.client_secret,
//						redirect_uri: gSecret.redirect_uris[1],
//						grant_type: 'authorization_code'
//					}).done(function(data) {
//						// take only what we need
//						var authData = {
//							access_token: data.access_token,
//							expires_in: data.expires_in,
//							refresh_token: data.refresh_token
//						};
//						// Put the authData into storage
//						localStorage.setItem('authData', JSON.stringify(authData));
//						// send data to brif sever
//						$.post(that.get('endPointUrl') + '/auth/mobile-signin',data)
//							.done(function(resp){})
//							.fail(function(resp){
//								// user failed authentication
//								jQuery.parseJSON(resp);
//								console.log(resp.message);
//								brif.router.navigate('fail', {trigger: true});
//							});
//						// return to authentication
//						that.authenticate();
//					}).fail(function(response) {
//						alert(response);
//						response = jQuery.parseJSON(response);
//						$('body').html(response.error);
//					});
//				} else if (error) {
//					console.log(error);
//				}
//			});
//		}
//	});
//	brif.models.gapi = new brif.modelClass.Gapi();
//})();