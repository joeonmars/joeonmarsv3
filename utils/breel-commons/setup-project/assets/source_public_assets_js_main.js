/*
	PLEASE NOTE:
	This is the B-Reel/Google Closure bootstrap script.
	It should only be used in development (uncompiled) mode.
	It should be replaced by a consolidated script created by `./build release`
*/

console.info('Running in development (uncompiled) mode...');

(function() {
	function installExternalScript (url) {
		document.write('<script type="text/javascript" src="' + url + '"></' + 'script>');
	}

	installExternalScript('assets/js/source/goog/base.js');
	installExternalScript('assets/js/source/{__PROJ_NS__}-base.js');
})();
