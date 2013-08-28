(function(){
    brif.viewClass.signIn = Backbone.View.extend({
        className: 'sign_in',
        initialize: function(){
            this.listenTo(this.model, 'not authorizes', this.show);
            window.addEventListener("message", this.receiveMessage, false);
        },
        render: function(){
            this.$el.css('opacity',0);
            this.$el.html(brif.templates.sign_in);
            $('body').css('min-height', $(window).height());
            $('body').html(this.el);
			this.show();
            return this;
        },
        show: function(){
            this.$el.css('opacity',1);
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
