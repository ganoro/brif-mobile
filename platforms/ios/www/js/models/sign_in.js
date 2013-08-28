(function () {
	brif.modelClass.SignIn = Backbone.Model.extend({
		initialize:function () {

		},
		defaults:{
			apiKey:'AIzaSyDQU5DYKmI1gvk-RGwLJFL0g2r0_Tm5Tko',
			scopes:['https://mail.google.com', 'https://www.google.com/m8/feeds/', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile']
		}
	});
	brif.models.signIn = new brif.modelClass.SignIn({
		googleSecret:brif.models.config.get('googleSecret')
	});
})();