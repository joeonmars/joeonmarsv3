goog.provide('jomv3.App');

goog.require('goog.events');
goog.require('goog.userAgent');
goog.require('goog.math');
goog.require('goog.window');
goog.require('jomv3.controllers.AssetsController');
goog.require('jomv3.controllers.NavigationController');
goog.require('jomv3.views.elements.RoundThumb');
goog.require('jomv3.views.elements.UISpinner');


jomv3.App = function () {

	// app assets
	jomv3.ExternalAssets = {};

	// test
	var navController = jomv3.controllers.NavigationController.getInstance();

	var assetsController = jomv3.controllers.AssetsController.getInstance();
	assetsController.addDomain('test');

	var roundThumb = new jomv3.views.elements.RoundThumb(200, new goog.math.Coordinate(600, 400), jomv3.views.elements.RoundThumb.ClassName.FLASH);
	goog.dom.appendChild(document.body, roundThumb.domElement);

	var uiSpinner = new jomv3.views.elements.UISpinner(100,'red',.6);
	goog.dom.appendChild(document.body, uiSpinner.domElement);

	//
	var manifest = [
		{'id':'navigation-settings', 'src':jomv3.ASSETS_PATH+'json/navigation-settings.json'},
		{'id':'randomImage1', 'src':jomv3.ASSETS_PATH+'images/sun_corona.jpg'},
		{'id':'randomImage2', 'src':jomv3.ASSETS_PATH+'images/paper-texture.jpg'}
	];

	var loaderQueue = assetsController.createAssetsLoader(manifest, 'settings');

	loaderQueue.addEventListener("fileload", goog.bind(function(e) {
		console.log('fileload', e);
	}, this));

	loaderQueue.addEventListener("fileprogress", goog.bind(function(e) {
		console.log('fileprogress', e);
	}, this));

 	loaderQueue.addEventListener("complete", goog.bind(function(e) {
 		navController.init();
	}, this));

	loaderQueue.load();

	//
	goog.events.listen(roundThumb.domElement, 'click', function(e) {
		var viewportSize = goog.dom.getViewportSize();

		var swftitle = 'Pacmad Level Editor';
		var swfurl = jomv3.ASSETS_PATH + 'swf/projects/pacmad/level_editor.swf';
		var swfwidth = 640;
		var swfheight = 740;
		var swfversion = '9.0.0';
		var link = 'popup-flash.php'+'?swftitle='+swftitle+'&swfurl='+swfurl+'&swfwidth='+swfwidth+'&swfheight='+swfheight+'&swfversion='+swfversion;
		goog.window.open(link, {
			'width': swfwidth,
			'height': swfheight + 40,
			'left': (window.screenLeft || window.screenX) + (viewportSize.width - swfwidth)/2,
			'top': (window.screenTop || window.screenY) + (viewportSize.height - swfheight)/2,
			'toolbar': false,
			'scrollbars': false,
			'statusbar': false,
			'menubar': false,
			'resizable': false
		});
	}, false, this);

	//
	var draggableCursor = jomv3.utils.addDraggableCursor(document.body);
	//draggableCursor.remove();
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
