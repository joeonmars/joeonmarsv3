/**
 * @fileoverview Builder Phase for calculating Google Closure dependencies.
 */

goog.provide('breel.build.ClosureDevelopmentPhase');

goog.require('node.assert');

goog.require('breel.build.FileContext');
goog.require('breel.build.Phase');
goog.require('breel.build.utils');

goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {breel.build.Phase}
 */
breel.build.ClosureDevelopmentPhase = function (options) {
	goog.base(this, options);

	this.input =
		this.addFileResolver({
			contextName: breel.build.FileContext.Name.SOURCE,
			path: options.input
		});

	this.closureLibrary =
		this.addFileResolver({
			contextName: breel.build.FileContext.Name.SOURCE,
			path: options.closureLibrary
		});

	this.output =
		this.addFileResolver({
			contextName: breel.build.FileContext.Name.DESTINATION,
			path: options.output
		});

	this.requires = this.sanitizeStringArrayOption(options, 'require');

};

goog.inherits(breel.build.ClosureDevelopmentPhase, breel.build.Phase);

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.ClosureDevelopmentPhase.prototype.logger = goog.debug.Logger.getLogger('breel.build.ClosureDevelopmentPhase');

breel.build.ClosureDevelopmentPhase.prototype.execute = function () {
	this.logger.fine('execute');

	var closure = node.require('../node/closure');

	var numFiles = 0;
	var dependencies = [];

	var visitPath = function (path) {
		if (/\.js$/.exec(path)) {
			this.logger.finer('Visiting: ' + this.input.getFileContext().absoluteToRelative(path));

			numFiles++;

			var dependency = closure.calcDeps(path, CLOSURE_BASE_PATH);
			if (dependency) {
				dependencies.push(dependency);
			}
		}
	};

	var toDepsStatement = function (dependency) {
		return (
			'goog.addDependency("' +
				dependency.fileName +
			'", ' +
				JSON.stringify(dependency.provides) +
			', ' +
				JSON.stringify(dependency.requires) +
			');'
		);
	};

	// Recurse through input
	this.input.recurse(goog.bind(visitPath, this));
	this.logger.info('Wrote ' + dependencies.length + ' deps in ' + numFiles + ' JS files to ' + this.output.getProjectPath());

	// Output base
	var baseOutput =
		'// Generated by breel.build.ClosureDevelopmentPhase\n\n' +
		dependencies.map(toDepsStatement).join('\n') +
		'\n\n';
	for (var index = 0; index < this.requires.length; index++) {
		baseOutput += 'goog.require(\'' + this.requires[index] + '\');';
	}
	this.output.writeFile(baseOutput);

	this.complete();
};