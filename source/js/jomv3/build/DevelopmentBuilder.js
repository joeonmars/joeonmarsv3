goog.require('breel.build.Builder');
goog.require('breel.build.ClosureDevelopmentPhase');
goog.require('breel.build.CompassCompilerPhase');

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

	this.addPhase(new breel.build.ClosureDevelopmentPhase({
		input: 'js/jomv3/',
		closureLibrary: 'js/goog/',
		require: 'jomv3.popupflash',
		output: 'js/jomv3-popupflash-base.js'
	}));

  this.addPhase(new breel.build.CompassCompilerPhase({
    input: ['scss/', 'public/assets/images/icon'],
    config: 'scss/config.rb'
   }));
};

goog.inherits(jomv3.DevelopmentBuilder, breel.build.Builder);
