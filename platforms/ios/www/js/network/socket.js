(function(){

	brif.socket = _.extend(Backbone.Events, {

		initialize: function(){
			this.bindListeners();
			this.socket = io.connect(brif.models.config.get('endPointUrl'));
		},

		bindListeners: function(){
			this.listenTo(brif.models.user, 'received:email', this.connectToSocket);
		},

		connectToSocket: function(email){
			this.socket.on('connect', function () {
				console.log("connected");
			});
			this.email = email;
			this.socket.emit('setup', { email : this.email });
		},

		subscribeGroupsChangeListener : function(callback) {
			this.unsubscribeGroupsChangeListener();

			this.socket.on('group change', function (data) {
				console.log("group changed ");
				console.log(data);
				(callback || function(d){})(data);
			});

			this.socket.emit('groups listener subscribe', {
				client_id: this.socket.socket.sessionid ,
				email : this.email
			});
		},

		unsubscribeGroupsChangeListener : function() {
			this.socket.emit('groups listener unsubscribe', {
				client_id: this.socket.socket.sessionid ,
				email : this.email
			});
			this.socket.removeAllListeners('group change');
		},

		listGroups : function(page, count, callback) {
			this.socket.emit('groups list', {
				client_id: this.socket.socket.sessionid ,
				email : this.email,
				page : page,
				count : count
			});
		},

		insertGroup : function(group) {
			this.socket.emit('groups insert', {
				client_id: this.socket.socket.sessionid ,
				email : this.email,
				group : group
			});
		}
	});

	brif.socket.initialize();
})();