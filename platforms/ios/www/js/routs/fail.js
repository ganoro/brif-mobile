(function(){
    brif.router.route("fail::message", "fail",function(message) {
		message = message.replace(/_/g, ' ');
		brif.views.fail.injectFailMessage(message);
		brif.views.fail.render();
    });
})();
