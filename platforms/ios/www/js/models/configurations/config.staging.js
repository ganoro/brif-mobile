(function(){
    brif.modelClass.config = Backbone.Model.extend({
        defaults : {
            googleSecret: {
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                client_secret: "iCesKUB5OyjwnnCaKstAuZx4",
                token_uri: "https://accounts.google.com/o/oauth2/token",
                client_email: "808248997275-ol6kol8h23j018iug3d5odi9vhrja9j5@developer.gserviceaccount.com",
                redirect_uris: ["http://api.brif.us/signin"],
                client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/808248997275-ol6kol8h23j018iug3d5odi9vhrja9j5@developer.gserviceaccount.com",
                client_id: "808248997275-ol6kol8h23j018iug3d5odi9vhrja9j5.apps.googleusercontent.com",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                javascript_origins: ["http://staging.brif.us"]    
            },
            indexFileType: 'html',
            signInFileType: 'html',
            endPointUrl: 'http://api.brif.us',
            stationName: 'staging'
        }
    });
    brif.models.config = new brif.modelClass.config();
})();
