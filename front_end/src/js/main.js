goog.provide('example.main');

goog.require('goog.fx.anim');
goog.require('goog.dom');
goog.require('soy');
goog.require('example.templates');
goog.require('example.controllers.AjaxController');
goog.require('example.controllers.NavigationController');

example.Url = {
	ORIGIN: window.location.protocol + '//' + window.location.hostname + '/'
};

example.main = function() {
	goog.fx.anim.setAnimationWindow(window);

	// test navigation controller
	//example.controllers.NavigationController.Implementation = example.controllers.NavigationController.HASH;
	example.main.controllers.navigationController.init();

	// test soy template
	var helloWorld = soy.renderAsFragment(example.templates.helloWorld);
	goog.dom.appendChild(document.body, helloWorld);

	// test ajax controller
	example.main.controllers.ajaxController.get('/news/my-second-news?debug', null, function(request) {
		var responseText = request.getResponseText();
		console.log(responseText);
	}, function(request) {
		console.log(request.getLastErrorCode(), request.getLastError());
	});

};

example.main.controllers = {
	ajaxController: example.controllers.AjaxController.getInstance(),
	navigationController: example.controllers.NavigationController.getInstance()
};

goog.exportProperty(window, 'example', example);
goog.exportProperty(example, 'main', example.main);