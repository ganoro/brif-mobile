(function(){
    brif.router.route('main', function() {
		var welcomeView = brif.views.welcome;
		var interval = setInterval(function(){
			if(welcomeView.checkData()) {
				welcomeView.render();
				clearInterval(interval);
			}
		},100);
    });
})();
