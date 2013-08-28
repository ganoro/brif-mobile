(function(){
    brif.viewClass.signIn = Backbone.View.extend({
        className: 'sign_in darkBg',
        initialize: function(){
            this.listenTo(this.model, 'not authorizes', this.show);
            window.addEventListener("message", this.receiveMessage, false);
        },
        receiveMessage: function(event){
            // console.log(event.origin);
            // console.log(event.data);
            // console.log(event.source);
            switch(event.data) {
                case 'accept':
                    window.location.assign(window.location.origin + '/app');
                    break;
                case 'cancel':
                    alert('no way you just canceled! you realy should reconsider..');
                    break;
                default:
                    break;
            }
        },
        render: function(){
            this.$el.css('opacity',0);
            this.$el.html(brif.templates.sign_in);
            $('body').css('min-height', $(window).height());
            $('body').html(this.el);
            return this;
        },
        show: function(){
            this.$el.css('opacity',1);
        },
        continueToApp: function(){
            Backbone.router.navigate('');  
        },
        openAuthWindow: function(){
            gapi.auth.authorize({
                response_type: 'code',
                client_id: this.model.get('googleSecret').client_id,
                approval_prompt : 'force',
                access_type : 'offline',
                scope: this.model.get('scopes'),
                redirect_uri : this.model.get('googleSecret').redirect_uris[0],
                state: this.model.get('stationName')
            }, this.model.handleAuthResult);
            return false;
        },
        events: {
            'click #authorize-button': 'openAuthWindow'
        }
    });
    brif.views.signIn = new brif.viewClass.signIn({model: brif.models.signIn});
})();
