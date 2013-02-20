goog.provide('jomv3.App');

goog.require('goog.userAgent');
goog.require('goog.math');
goog.require('jomv3.views.elements.RoundThumb');
goog.require('jomv3.views.elements.UISpinner');


jomv3.App = function () {

	// app assets
	jomv3.ExternalAssets = {};

	// test
	var roundThumb = new jomv3.views.elements.RoundThumb(200, new goog.math.Coordinate(600, 400), jomv3.views.elements.RoundThumb.ClassName.FLASH);
	goog.dom.appendChild(document.body, roundThumb.domElement);

	var uiSpinner = new jomv3.views.elements.UISpinner(100,'red',.6);
	goog.dom.appendChild(document.body, uiSpinner.domElement);

	//
	var queue = new createjs.LoadQueue(true);
	queue.addEventListener("fileload", goog.bind(function(e) {
		//console.log(e)
	}, this));

	queue.addEventListener("fileprogress", goog.bind(function(e) {
		console.log(e);
	}, this));

 	queue.addEventListener("complete", goog.bind(function(e) {

	}, this));

 	queue.loadFile({'id':'randomImage1', 'src':jomv3.ASSETS_PATH+'images/sun_corona.jpg'});
	queue.loadFile({'id':'randomImage2', 'src':jomv3.ASSETS_PATH+'images/paper-texture.jpg'});
	queue.load();
};


/**
 * Global variables getter & setter
 */
jomv3.GET_VAR = function(key) {
  return jomv3.VARS[key];
};


jomv3.SET_VAR = function(key, val) {
  jomv3.VARS[key] = val;
};
