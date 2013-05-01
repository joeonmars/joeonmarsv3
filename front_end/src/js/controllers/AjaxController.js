goog.provide('example.controllers.AjaxController');

goog.require('goog.events.EventTarget');
goog.require('goog.Uri.QueryData');
goog.require('goog.net.XhrIo');


/**
 * @constructor
 */
example.controllers.AjaxController = function(){
  goog.base(this);

};
goog.inherits(example.controllers.AjaxController, goog.events.EventTarget);
goog.addSingletonGetter(example.controllers.AjaxController);


example.controllers.AjaxController.prototype.get = function(url, data, onSuccessCallback, onErrorCallback){
	// create the xhr object
	var _request = new goog.net.XhrIo();

	// create a QueryData object by initializing it with a simple Map
	var _data = goog.Uri.QueryData.createFromMap(new goog.structs.Map(data));

	// listen to complete event
	goog.events.listenOnce(_request, "complete", function() {
		if(_request.isSuccess()) {
			onSuccessCallback.call(arguments.callee.caller, _request);
		}else {
			if(onErrorCallback) {
				onErrorCallback.call(arguments.callee.caller, _request);
			}
		}
	});

	// start the request by setting GET method and passing
	// the data object converted to a queryString
	_request.send(url, "GET", _data.toString());
};