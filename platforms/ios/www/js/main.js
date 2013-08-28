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

	var googleapi = {
		authorize: function(options) {
			var scopes = options.scope.join("+");
			var deferred = $.Deferred();
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
							alert(data);
							deferred.resolve(data);
							//TODO - send refreshable token to brif backend
						}).fail(function(response) {
							alert(response);
							deferred.reject(response.responseJSON);
						});
				} else if (error) {
					deferred.reject({
						error: error[1]
					});
				}
			});
			return deferred.promise();
		}
	};

	$(document).on('deviceready', function() {
		googleapi.authorize({
			client_id: brif.models.config.get('googleSecret').client_id,
			client_secret: brif.models.config.get('googleSecret').client_id,
			redirect_uri: brif.models.config.get('googleSecret').redirect_uris[1],
			scope: brif.models.signIn.get('scopes')
		}).done(function(data) {
			$('body').html('Access Token: ' + data.access_token);
		}).fail(function(data) {
			$('body').html(data.error);
		});
	});
})();
