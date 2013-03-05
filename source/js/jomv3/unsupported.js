goog.provide('jomv3.unsupported');

goog.require('goog.userAgent');

jomv3.unsupported = function (redirectUrl) {
	var browserIsIE = goog.userAgent.IE && goog.userAgent.VERSION >= '9';
	var browserHasFeatures = Modernizr.csstransforms && Modernizr.video && Modernizr.backgroundsize;

	if(browserIsIE || browserHasFeatures){
		window.location = redirectUrl;
	}
};

goog.exportProperty(jomv3, 'unsupported', jomv3.unsupported);