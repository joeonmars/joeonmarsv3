goog.require('breel.build.Builder');

goog.provide('{__PROJ_NS__}.ReleaseBuilder');

{__PROJ_NS__}.ReleaseBuilder = function () {
	goog.base(this, {
		destinationPath: 'release/'
	});

	// Mirror public directory
	// this.addPhase(new breel.build.MirrorPhase({
	// 	input: 'public',
	// 	includeSymLinks: false
	// }));

	// Compile closure
	// this.addPhase(new breel.build.ClosureCompilerPhase({
	// 	input: 'js/',
	// 	require: '{$projectNamespace}.main',
	// 	output: 'public/assets/js/main.js'
	// }));

	// Precompile index.php into index.html, index-flash.html, index-local.html, index-cdn.html
	// this.addPhase(new breel.build.PHPPrecompilePhase({
	// 	input: 'public/index.php',
	// 	output: [
	// 		{ output: 'public/index.html', options: { assets: 'assets-{$version}' } },
	// 		{ output: 'public/index-flash.html', options: { assets: 'assets-{$version}', flash: true } },
	// 		{ output: 'public/index-local.html', options: { assets: 'assets-{$version}', local: true } },
	// 		{ output: 'public/index-cdn.html', options: { assets: 'assets-{$version}', cdn: true } }
	// 	],
	// 	includeInput: false
	// }));

	// Delete unwanted files
	// this.addPhase(new breel.build.DeletePhase([
	// 	'public/assets/images/source'
	// ]));

	// Add version to assets directory
	// this.addPhase(new breel.build.RenamePhase({
	// 	input: 'public/assets',
	// 	output: 'public/assets-{$version}'
	// }));

	// Add Build Info
	// this.addPhase(new breel.build.BuildInfoPhase({
	// 	output: 'public/BUILD-INFO.json',
	// 	include: ['version', 'date', 'user', 'git.branch', 'git.checksum']
	// }));

	// Add .htaccess
	// var shouldApplyAuthentication = true;
	// if (shouldApplyAuthentication) {
	// 	this.addPhase(new breel.build.HTAccessPhase({
	// 		htaccess: {
	// 			output: 'public/.htaccess',
	// 			mimeTypes: {
	// 				'video/webm': 'webm'
	// 			}
	// 		},
	// 		htpasswd: {
	// 			output: '.htpasswd',
	// 			users: ['pnc:xma5']
	// 		}
	// 	}));
	// }

	// Archive
	// this.addPhase(new breel.build.ArchivePhase({
	// 	archiveName: '{$projectName}-{$version}.zip'
	// }));
};

goog.inherits({__PROJ_NS__}.ReleaseBuilder, breel.build.Builder);
