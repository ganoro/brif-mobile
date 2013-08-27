(function(){
    brif.router.route("sign_in", "sign_in",function() {
        brif.models.signIn.setApiKey();
        buildPage();
    });
    if(Backbone.history.fragment == 'sign_in'){
        brif.models.signIn.setApiKey();
        buildPage();
    }
    function buildPage(){
        console.log('route:sign_in');
        brif.views.signIn = new brif.viewClass.signIn({model: brif.models.signIn});
        brif.views.signIn.render();
    } 
})();
