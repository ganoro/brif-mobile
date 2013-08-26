(function(){
    brif.modelClass.signIn = Backbone.Model.extend({
        defaults: {            
            apiKey: 'AIzaSyDQU5DYKmI1gvk-RGwLJFL0g2r0_Tm5Tko',
            scopes: ['https://mail.google.com', 'https://www.google.com/m8/feeds/', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile']
        },
        setApiKey: function(){
            var that = this;
            gapi.client.setApiKey(this.get('apiKey'));
            window.setTimeout(function(){
                // Check Authentication
                gapi.auth.authorize({
                    client_id: that.get('web').client_id, 
                    scope: that.get('scopes'),
                    response_type : 'code token',
                    immediate: true}, 
                    that.handleAuthResult);
            
            },1);
        },
        handleAuthResult: function(authResult){
            if (authResult && !authResult.error) {
                // Athorized already               
                if(
                    window.location.pathname == '/index.' + brif.models.config.get('signInFileType') ||
                    window.location.pathname == '/') {
                    window.location.assign(window.location.origin + '/app');
                    return;
                }
                
                brif.models.user.set('code', authResult.code);
                
                // Get user's name & email
                $.ajax({
                    url: 'https://www.google.com/m8/feeds/contacts/default/full/',
                    dataType: 'xml',
                    headers: {
                        'Authorization': 'Bearer ' + authResult.access_token,
                        'Gdata-version': '3.0'
                    },
                    success: function(resp){
                        // resp holds by default the first 20 contacts we need to find just the user
                        var userEmail = $(resp).find('feed author email').text();
                        var userName = $(resp).find('feed author name').text();
                        brif.models.user.set('email', userEmail);
                        brif.models.user.set('name', userName);
                    }
                });
                
            } else {
                // Still need to authorize
                if(
                    window.location.pathname == 'app/index.' + brif.models.config.get('signInFileType') ||
                    window.location.pathname == '/app/') {
                    window.location.assign(window.location.origin);
                } else {
                    brif.models.signIn.trigger('not authorized');
                }
            }
        }
    });
    brif.models.signIn = new brif.modelClass.signIn({
        web: brif.models.config.get('googleSecret')
    });
})();