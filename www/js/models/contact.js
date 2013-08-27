(function(){
    brif.modelClass.contact = Backbone.Model.extend({
        initialize: function(){
            this.formatSymbol();
            var firstName = this.get('first_name');
            if(!firstName) {
                this.set('first_name', this.get('email').split('@')[0]);
            }
            var lastName = this.get('last_name');
            if(!lastName) {
               this.set('last_name', ''); 
            }
            this.set('full_name',firstName + ' ' + lastName);
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