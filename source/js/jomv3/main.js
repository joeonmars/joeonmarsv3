goog.provide('jomv3.main');

goog.require('goog.userAgent.product');
goog.require('jomv3.App');
goog.require('jomv3.Utils');

jomv3.main = function (assetsUrl) {
	// Set globals
	jomv3.ASSETS_PATH = '/assets/';

	// Create Utils
	jomv3.utils = jomv3.Utils.getInstance();

	// Detect if the device has both touch and mobile user agent
	jomv3.isTouchAndMobile = (goog.userAgent.MOBILE && Modernizr.touch) || goog.userAgent.product.ANDROID;

	// Detect if is android, since the goog.userAgent gave false result;
	// And we'd best implement native scroll for android so we need this
	// specific device check
	jomv3.isAndroid = goog.userAgent.product.ANDROID;

	// Create App and install into the jomv3 namespace
	jomv3.prototype = new jomv3.App();
};

goog.exportSymbol('jomv3.main', jomv3.main);