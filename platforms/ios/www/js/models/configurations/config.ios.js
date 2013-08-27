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
			indexFileType:'html',
			signInFileType:'html',
			endPointUrl:'http://api.brif.us',
			stationName:'ofersarid'
		}
	});
	brif.models.config = new brif.modelClass.Config();
})();