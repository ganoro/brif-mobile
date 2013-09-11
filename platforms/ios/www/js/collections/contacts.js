(function(){
	brif.collectionClass.Contacts = Backbone.Collection.extend({
		model: brif.modelClass.contact,
		initialize: function(){
			this.bindListeners();
			_.bindAll(this, 'fetch');
		},
		bindListeners: function(){
			// this.listenTo(brif.models.groups, 'received:new_group', function(group){
			//     this.fetch(token);
			// });
		},
		lastSearchResult: 0,
		fetch: function(options){
			options = _.extend({
				searchMode: false,
				contactList: [],
				query: '',
			}, options);
			var that = this;
			var usr = brif.models.user;
			usr.getToken().done(function(token){
				options.searchMode ? getContacts(token) : cacheContacts(token);
			}).fail(function(err){
					console.error(err);
					brif.router.navigate('fail:failed_to_fetch_contacts_problem_with_token', true);
				});
			function cacheContacts(token){
				_.each(options.contactList, function(email, index, list){
					$.getJSON('https://www.google.com/m8/feeds/contacts/default/full/?access_token=' + token + "&v=3&alt=json&q=" + email, function(contact){
						var contact = contact.feed.entry[0];
						delete contact.app$edited;
						delete contact.category;
						delete contact.category;
						_.each(contact.gd$email, function(el, index, list){
							if(el.primary == "true" || el.primary == true) {
								contact.email = el.address;
							}
						});
						delete contact.gd$email;
						delete contact.gd$etag;
						contact.full_name = contact.gd$name.gd$fullName.$t
						contact.given_name = contact.gd$name.gd$givenName.$t
						contact.family_name = contact.gd$name.gd$familyName.$t
						delete contact.gd$name;
						contact.image = (contact.link[0]).href;
						delete contact.link;
						delete contact.title;
						delete contact.updated;
						contact.id = contact.id.$t.split('base/')[1];
						that.add(contact);
					}).fail(function(err){
							console.error(err);
							if((gapi.auth.getToken()).error) {
								brif.router.navigate('fail:failed_to_obtain_contacts._somthing_is_wrong_with_the_token', true);
							} else {
								brif.router.navigate('fail:failed_to_obtain_contacts', true);
							}
						});
				});
			}
			function getContacts(token){
				var t = new Date().getTime();
				// that.searchTimeStamps.splice(i,0,{q: options.query, c: contacts, t: new Date().getTime()});
				$.getJSON('https://www.google.com/m8/feeds/contacts/default/full/?access_token=' + token + "&max-results=30&v=3&alt=json&orderby=lastmodified&q=" + options.query, function(resp){
					var entry = resp.feed.entry;
					var contacts= [];
					_.each(entry, function(item, index, list){
						var contact = {
							name: item.gd$name ? item.gd$name.gd$fullName.$t : '',
							emails: _.pluck(item.gd$email, 'address')
						};

						if(contact.name.toLowerCase().search(options.query.toLowerCase()) == 0 && contacts.length < 6) {
							contacts.push(contact);
						}
						else {
							//filter out relevant emails
							contact.emails =_.filter(contact.emails, function(email){
								return email.toLowerCase().search(options.query.toLowerCase()) == 0
							});
							if(contact.emails.length > 0 && contacts.length < 6) {
								contacts.push(contact);
							}
						}

					});
					if(t > that.lastSearchResult) {
						that.lastSearchResult = t;
						that.trigger('received:search_resaults', contacts);
					};
				}).fail(function(err){
						console.error(err);
						if((gapi.auth.getToken()).error) {
							brif.router.navigate('fail:failed_to_obtain_contacts._somthing_is_wrong_with_the_token', true);
						} else {
							brif.router.navigate('fail:failed_to_obtain_contacts', true);
						}
					});
			}
		},
		create: function(data){
			var that = this;
			var usr = brif.models.user;
			usr.getToken().done(function (token) {
				createContact(data, token);
			}).fail(function (err) {
					console.error(err);
					brif.router.navigate('fail:failed_to_create_contacts_problem_with_token', true);
				});
			function createContact(data, token){
				data = data || {
					given_name: 'sample',
					family_name: 'contact',
					email: {
						personal: 'personal@example.com',
						work: 'work@example.com',
						primary: 'work'
					},
					phone_number: {
						personal: '0540000000',
						work: '0551111111',
						home:'0562222222',
						primary: 'personal'
					},
					address: {
						home: {
							city: 'Emerald',
							street: 'Green Which',
							region: 'Monkey-vill',
							postcode: '00000',
							country: 'Lala Land'
						},
						work: {
							city: 'Kings landing',
							street: 'Goblis',
							region: 'Down-Town',
							postcode: '000112',
							country: 'Middle earth'
						},
						primary: 'home'
					}
				}
				$.ajax({
					url: 'https://www.google.com/m8/feeds/contacts/default/full?access_token=' + localStorage.access_token,
					type: "POST",
					contentType: 'application/atom+xml; charset=UTF-8; type=feed',
					gDataVersion: '3.0',
					data: _.template(brif.templates.new_contact, {D: data}),
					error: function(XMLHttpRequest, textStatus, errorThrown){
						alert(errorThrown);
					},
					success: function(data, textStatus, XMLHttpRequest){
						alert("Succeeded");
					}
				});
			}
		}
	});

	brif.collections.contacts = new brif.collectionClass.Contacts();
})();