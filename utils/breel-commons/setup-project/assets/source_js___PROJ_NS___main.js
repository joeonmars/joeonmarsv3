goog.provide('{__PROJ_NS__}.main');

goog.require('{__PROJ_NS__}.App');

{__PROJ_NS__}.main = function () {
	// Set globals

	// Create App and install into the {__PROJ_NS__} namespace
	{__PROJ_NS__}.prototype = new {__PROJ_NS__}.App();
};

goog.exportProperty({__PROJ_NS__}, 'main', {__PROJ_NS__}.main);
