(function(){
    brif.modelClass.thread = Backbone.Model.extend({
        initialize: function(){
            this.set('active', false);
            this.formatSymbol();
            this.on('change:symbol', this.formatSymbol);
        },
        formatSymbol: function(){
            if(this.get('symbol')) {
                this.set('formatedSymbol','url('+this.get('symbol')+')');
            } else {
                this.set('formatedSymbol','none');
            }
        }
    });
})();