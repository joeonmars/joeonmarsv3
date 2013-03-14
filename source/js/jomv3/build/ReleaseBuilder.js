goog.require('breel.build.Builder');
goog.require('breel.build.MirrorPhase');
goog.require('breel.build.ClosureCompilerPhase');

goog.provide('jomv3.ReleaseBuilder');

jomv3.ReleaseBuilder = function () {
	goog.base(this, {
		destinationPath: 'release/'
	});

	// Mirror public directory
	this.addPhase(new breel.build.MirrorPhase({
		input: 'public'
	}));

	// Compile closure
	this.addPhase(new breel.build.ClosureCompilerPhase({
		input: ['js/', '../utils/breel-commons', '../utils/closure-templates-for-js'],
		require: 'jomv3.main',
		output: 'public/assets/js/main.js',
		externs: 'js/jomv3/externs.js',
		compilationLevel: breel.build.ClosureCompilerPhase.CompilationLevel.ADVANCED_OPTIMIZATIONS
	}));
};

goog.inherits(jomv3.ReleaseBuilder, breel.build.Builder);
