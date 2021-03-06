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
		bi: {},
		featureSwitch: {},
		events: _.extend({}, Backbone.Events),
		network : {}
	};
	brif.router = new Backbone.Router();
	Backbone.history.start();
})();

// Wait for device API libraries to load
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
function onDeviceReady() {
	// Now safe to use device APIs
	brif.events.trigger('deviceready');
	brif.utils.goToApp();
}
