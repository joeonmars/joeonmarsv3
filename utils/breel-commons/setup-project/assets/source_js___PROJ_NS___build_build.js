require('../../breel/build').init({
	
	closureLibraryPath: process.cwd() + '/source/js/goog/',

	// Sources used by the build system must be defined here
	// (any JS other than goog.* and breel.* required by this build system)
	sources: [
		'source/js/{__PROJ_NS__}/build/DevelopmentBuilder.js',
		'source/js/{__PROJ_NS__}/build/ReleaseBuilder.js'
	],

	builders: {
		development: {
			className: '{__PROJ_NS__}.DevelopmentBuilder',
			description: 'Build for development'
		},
		release: {
			className: '{__PROJ_NS__}.ReleaseBuilder',
			additionalDeps: 'source/js/{__PROJ_NS__}-deps.js',
			description: 'Create a release build'
		}
	}
});
