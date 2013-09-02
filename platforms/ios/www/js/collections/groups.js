(function(){
	brif.collectionClass.Groups = Backbone.Collection.extend({
		model: brif.modelClass.Group
	});

	brif.collections.groups = new brif.collectionClass.Groups();
})();