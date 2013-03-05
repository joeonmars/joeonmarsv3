require('../../breel/build').init({
	
	closureLibraryPath: process.cwd() + '/source/js/goog/',

	// Sources used by the build system must be defined here
	// (any JS other than goog.* and breel.* required by this build system)
	sources: [
		'source/js/jomv3/build/DevelopmentBuilder.js',
		'source/js/jomv3/build/ReleaseBuilder.js'
	],

	builders: {
		development: {
			className: 'jomv3.DevelopmentBuilder',
			description: 'Build for development'
		},
		release: {
			className: 'jomv3.ReleaseBuilder',
			additionalDeps: 'source/js/jomv3-deps.js',
			description: 'Create a release build'
		}
	}
});
