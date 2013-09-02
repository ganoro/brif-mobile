(function(){
	brif.collectionClass.messages = Backbone.Collection.extend({
		model: brif.modelClass.message,
		comparator: function(message){
			return message.get('created_at');
		}
	});

	brif.collections.messages = new brif.collectionClass.messages();
})();