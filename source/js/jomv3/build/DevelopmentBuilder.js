goog.require('breel.build.Builder');
goog.require('breel.build.ClosureDevelopmentPhase');

goog.provide('jomv3.DevelopmentBuilder');

jomv3.DevelopmentBuilder = function () {
	goog.base(this, {
		destinationPath: 'source/'
	});

	// Main Closure Dependencies
	this.addPhase(new breel.build.ClosureDevelopmentPhase({
		input: 'js/jomv3/',
		closureLibrary: 'js/goog/',
		require: 'jomv3.main',
		output: 'js/jomv3-main-base.js'
	}));

	// Popup-Flash Closure Dependencies
	this.addPhase(new breel.build.ClosureDevelopmentPhase({
		input: 'js/jomv3/',
		closureLibrary: 'js/goog/',
		require: 'jomv3.popupflash',
		output: 'js/jomv3-popupflash-base.js'
	}));

	// Unsupported Closure Dependencies
	this.addPhase(new breel.build.ClosureDevelopmentPhase({
		input: 'js/jomv3/',
		closureLibrary: 'js/goog/',
		require: 'jomv3.unsupported',
		output: 'js/jomv3-unsupported-base.js'
	}));
};

goog.inherits(jomv3.DevelopmentBuilder, breel.build.Builder);
