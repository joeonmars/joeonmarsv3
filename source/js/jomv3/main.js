goog.provide('jomv3.main');

goog.require('jomv3.App');

jomv3.main = function () {
	// Set globals

	// Create App and install into the jomv3 namespace
	jomv3.prototype = new jomv3.App();
};

goog.exportProperty(jomv3, 'main', jomv3.main);
