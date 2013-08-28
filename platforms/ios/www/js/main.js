/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function(){
	DATA_OBJ_COUNT = 0;
	brif = {
		views: {},
		models: {},
		collections: {},
		viewClass: {},
		modelClass: {},
		collectionClass: {},
		templates: {},
		utils: {},
		featureSwitch: {},
		events: _.extend({}, Backbone.Events)
	};
	brif.router = new Backbone.Router();
	Backbone.history.start();

	var authenticate = function(){
		var authData = jQuery.parseJSON(localStorage.getItem('authData'));
		if(!_.isEmpty(authData)) {
			// save data to user model foe convenient access
			brif.models.user.set({
				access_token: authData.access_token,
				expires_in: authData.expires_in,
				refresh_token: authData.refresh_token
			});
			// load main app
			brif.router.navigate('main');
			alert(Backbone.history.fragment);
		} else {
			signIn({
				client_id: brif.models.config.get('googleSecret').client_id,
				redirect_uri: brif.models.config.get('googleSecret').redirect_uris[1],
				client_secret: brif.models.config.get('googleSecret').client_secret,
				scope: brif.models.signIn.get('scopes')
			});
		}
	};

	var signIn = function(options) {
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
						// save data to user model foe convenient access
						brif.models.user.set({
							access_token: authData.access_token,
							expires_in: authData.expires_in,
							refresh_token: authData.refresh_token
						});
						// load main app
						brif.router.navigate('main');
						alert(Backbone.history.fragment);
						$.post(brif.models.config.get('endPointUrl') + '/auth/mobile-signin',data)
							.done(function(resp){
								// user authenticated
								brif.router.navigate('main');
							})
							.fail(function(resp){
								// user failed authentication
								jQuery.parseJSON(resp);
								console.log(resp.message);
								brif.router.navigate('fail');
							});
					}).fail(function(response) {
						alert(response);
						response = jQuery.parseJSON(response);
						$('body').html(response.error);
					});
			} else if (error) {
				deferred.reject({
					error: error[1]
				});
			}
		});
		return deferred.promise();
	};

	$(document).on('deviceready', function() {
		authenticate({
			client_id: brif.models.config.get('googleSecret').client_id,
			redirect_uri: brif.models.config.get('googleSecret').redirect_uris[1],
			scopes: brif.models.signIn.get('scopes')
		});
	});
})();
