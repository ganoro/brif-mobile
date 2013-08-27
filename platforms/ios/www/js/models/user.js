(function(){    
    brif.modelClass.user = Backbone.Model.extend({
        url: brif.models.config.get('endPointUrl')+'/signin'
    });
    
    brif.models.user = new brif.modelClass.user();
})();