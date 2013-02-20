goog.require('breel.build.Builder');
goog.require('breel.build.ClosureDevelopmentPhase');

goog.provide('{__PROJ_NS__}.DevelopmentBuilder');

{__PROJ_NS__}.DevelopmentBuilder = function () {
	goog.base(this, {
		destinationPath: 'source/'
	});

	// Closure Dependencies
	this.addPhase(new breel.build.ClosureDevelopmentPhase({
		input: 'js/{__PROJ_NS__}/',
		closureLibrary: 'js/goog/',
		require: '{__PROJ_NS__}.main',
		output: 'js/{__PROJ_NS__}-base.js'
	}));
};

goog.inherits({__PROJ_NS__}.DevelopmentBuilder, breel.build.Builder);
