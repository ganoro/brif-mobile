(function () {
	brif.modelClass.Config = Backbone.Model.extend({
		defaults:{
			googleSecret:{
				auth_uri:"https://accounts.google.com/o/oauth2/auth",
				client_secret:"Ucajgf8BPN4fXajscWXLdZ85",
				token_uri:"https://accounts.google.com/o/oauth2/token",
				client_email:"",
				redirect_uris:[
					"urn:ietf:wg:oauth:2.0:oob",
					"http://localhost"
				],
				client_x509_cert_url:"",
				client_id:"808248997275-td1l666khkenuda7irdhr27ullu7svps.apps.googleusercontent.com",
				auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
			},
			endPointUrl:'http://api.brif.us',
			apiKey:'AIzaSyDQU5DYKmI1gvk-RGwLJFL0g2r0_Tm5Tko',
			scopes:['https://mail.google.com', 'https://www.google.com/m8/feeds/', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile'],
			mixpanel_project_id : "9aa91f9a8a3d06e5b5915507d0b9db3b"
		}
	});
	brif.models.config = new brif.modelClass.Config();
})();