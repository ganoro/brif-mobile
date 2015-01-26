(function () {
	brif.modelClass.Config = Backbone.Model.extend({
		defaults:{
			googleSecret:{
			},
			endPointUrl:'http://api.brif.us',
			apiKey:'AIzaSyDQU5DYKmI1gvk-RGwLJFL0g2r0_Tm5Tko',
			scopes:['https://mail.google.com', 'https://www.google.com/m8/feeds/', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile'],
			mixpanel_project_id : "9aa91f9a8a3d06e5b5915507d0b9db3b"
		}
	});
	brif.models.config = new brif.modelClass.Config();
})();
