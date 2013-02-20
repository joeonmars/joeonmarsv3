/**
 * @fileoverview A Builder phase.
 */

goog.provide('breel.build.Phase');
goog.require('breel.build.FileResolver');
goog.require('breel.build.FileContext');

goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * A Builder phase
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.build.Phase = function (options) {
	goog.base(this);

	this.options = options;

	this.fileResolvers = [];
	this.pass = null;
};

goog.inherits(breel.build.Phase, goog.events.EventTarget);

breel.build.Phase.EventType = {
	COMPLETE: 'complete'
};

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.Phase.prototype.logger = goog.debug.Logger.getLogger('breel.build.Phase');

breel.build.Phase.prototype.assertValid = function() {
	this.logger.fine('assertValid');
};

breel.build.Phase.prototype.getIsAffectedByDelta = function(delta) {
	var isAffectedByDelta = false;

	for (var fileResolverIndex = 0; fileResolverIndex < this.fileResolvers.length; fileResolverIndex++) {
		var fileResolver = this.fileResolvers[fileResolverIndex];
		if (fileResolver.contextName === breel.build.FileContext.Name.SOURCE) {
			if (fileResolver.getOverlapsDelta(delta)) {
				isAffectedByDelta = true;
				break;
			}
		}
	}

	return isAffectedByDelta;
};

breel.build.Phase.prototype.getWatchableFileResolvers = function() {
	var watchableFileResolvers = [];
	for (var index = 0; index < this.fileResolvers.length; index++) {
		var fileResolver = this.fileResolvers[index];
		if (fileResolver.contextName === breel.build.FileContext.Name.SOURCE && fileResolver.isWatchable) {
			watchableFileResolvers.push(fileResolver);
		}
	}
	return watchableFileResolvers;
};

breel.build.Phase.prototype.enterPass = function(pass) {
	this.logger.finer('enterPass');
	
	this.pass = pass;
	for (var index = 0; index < this.fileResolvers.length; index++) {
		var fileResolver = this.fileResolvers[index];
		fileResolver.enterPass(pass);
	}
};

breel.build.Phase.prototype.exitPass = function(pass) {
	this.logger.finer('exitPass');
	
	for (var index = 0; index < this.fileResolvers.length; index++) {
		var fileResolver = this.fileResolvers[index];
		fileResolver.exitPass(pass);
	}
	this.pass = null;
};

breel.build.Phase.prototype.execute = goog.abstractMethod;

breel.build.Phase.prototype.addFileResolver = function(options) {
	this.logger.fine('addFileResolver: (' + options.contextName + ') ' + options.path);

	var fileResolver = new breel.build.FileResolver(options);
	
	this.fileResolvers.push(fileResolver);

	return fileResolver;
};

/**
 * Safely rerieves a string or array of strings from an options object.
 * @param {object} options Options object
 * @param {string} optionName Name of the option
 * @return {Array.<string>} An array of strings
 */
breel.build.Phase.prototype.sanitizeStringArrayOption = function(options, optionName) {
	// TODO assert strings

	var optionValue = options[optionName];

	if (!optionValue) {
		return [];
	}

	if (goog.isArray(optionValue)) {
		return optionValue;
	}

	return [optionValue];
};



breel.build.Phase.prototype.complete = function() {
	goog.events.dispatchEvent(this, {
		type: breel.build.Phase.EventType.COMPLETE
	});
};