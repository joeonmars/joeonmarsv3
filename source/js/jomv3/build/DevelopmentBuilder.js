goog.require('breel.build.Builder');
goog.require('breel.build.ClosureDevelopmentPhase');

goog.provide('jomv3.DevelopmentBuilder');

jomv3.DevelopmentBuilder = function () {
	goog.base(this, {
		destinationPath: 'source/'
	});

	// Closure Dependencies
	this.addPhase(new breel.build.ClosureDevelopmentPhase({
		input: 'js/jomv3/',
		closureLibrary: 'js/goog/',
		require: 'jomv3.main',
		output: 'js/jomv3-base.js'
	}));
};

goog.inherits(jomv3.DevelopmentBuilder, breel.build.Builder);
