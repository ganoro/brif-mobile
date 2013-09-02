(function(){
	brif.collectionClass.contacts = Backbone.Collection.extend({
		model: brif.modelClass.contact,
		initialize: function(){
			this.bindListeners();
		},
		bindListeners: function(){
			this.listenTo(brif.models.user, 'received:access_token', function(token){
				this.fetch(token);
			});
		},
		fetch: function(access_token){
			var that = this;
			$.getJSON('https://www.google.com/m8/feeds/contacts/default/full/?access_token=' + access_token + "&alt=json&max-results=600&callback=?", function(contacts){
				console.log(contacts);
				contacts = contacts.feed.entry;
				_.each(contacts, function(contact, index, list){
					contact.g_id = contact.id;
					delete contact.id;
					_.each(contact.gd$email, function(el, index, list){
						if(el.primary == "true" || el.primary == "true") {
							delete contact.gd$email;
							contact.email = el.address;
						}
					});
					contact.phone_number = _.pluck(contact.gd$phoneNumber, '$t');
					delete contact.gd$phoneNumber;
					delete contact.category;
					delete contact.gd$extendedProperty;
					that.add(contact);
				});
				that.trigger('received:contacts', contacts);
			}).fail(function(){
					if((gapi.auth.getToken()).error) {
						brif.router.navigate('fail:failed_to_obtain_contacts._somthing_is_wrong_with_the_token', true);
					} else {
						brif.router.navigate('fail:failed_to_obtain_contacts', true);
					}
				});
		}
	});

	brif.collections.contacts = new brif.collectionClass.contacts();
})();