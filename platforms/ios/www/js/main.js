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
			var deferred = $.Deferred();
			var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
				client_id: options.client_id,
				redirect_uri: options.redirect_uri,
				response_type: 'code',
				scope: options.scope
			});
			var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
			return deferred.promise();
		}
	};

	$(document).on('deviceready', function() {
		var $loginButton = $('#login a');
		var $loginStatus = $('#login p');

		$loginButton.on('click', function() {
			googleapi.authorize({
				client_id: brif.models.config.get('googleSecret').client_id,
				client_secret: brif.models.config.get('googleSecret').client_id,
				redirect_uri: brif.models.config.get('googleSecret').redirect_uris[0],
				scope: brif.models.signIn.get('scopes')
			}).done(function(data) {
					$loginStatus.html('Access Token: ' + data.access_token);
				}).fail(function(data) {
					$loginStatus.html(data.error);
				});
		});
	});
})();
