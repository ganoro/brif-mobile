(function(){
    brif.modelClass.message = Backbone.Model.extend({
        initialize: function(){
            this.set({
                contact: brif.collections.contacts.where({email: this.get('author')})[0],
                formatedTime: this.formatTime()
            });
        },
        formatTime: function(){
            var time = moment(parseInt(this.get('created_at'))).fromNow();
            return time;
        }
    });
})();