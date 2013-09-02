(function(){
	brif.utils.goToApp = function(){
		// go to the app (to the correct hash)
		if(Backbone.history.fragment == '') {
			brif.router.navigate('main', true);
		} else {
			var newFragment = Backbone.history.fragment;
			Backbone.history.fragment = null;
			brif.router.navigate(newFragment, true);
		}
	};

})();