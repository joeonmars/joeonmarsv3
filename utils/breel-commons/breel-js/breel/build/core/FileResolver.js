goog.provide('breel.build.FileResolver');

goog.require('breel.build.utils');
goog.require('node.fs');

goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * Input Resolver
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.build.FileResolver = function(options) {
	goog.base(this);

	node.assert.ok(options.contextName, 'contextName must be provided');
	node.assert.ok(options.path, 'path must be provided');

	this.contextName = options.contextName;
	this.path = options.path; // relative to context
	this.isWatchable = options.isWatchable !== false;
};

goog.inherits(breel.build.FileResolver, goog.events.EventTarget);

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.FileResolver.prototype.logger = goog.debug.Logger.getLogger('breel.build.FileResolver');

breel.build.FileResolver.prototype.getFileContext = function() {
	this.assertPass();

	return this.pass.builder.fileContexts[this.contextName];
};

breel.build.FileResolver.prototype.getAbsolutePath = function() {
	return this.getFileContext().relativeToAbsolute(this.path);
};

breel.build.FileResolver.prototype.getProjectPath = function() {
	return this.getFileContext().relativeToProject(this.path);
};

breel.build.FileResolver.prototype.containsPath = function(path) {
	// NAIVE?
	if (path.indexOf(this.path) === 0) {
		return true;
	}

	return false;
};

breel.build.FileResolver.prototype.withinPath = function(path) {
	// NAIVE?
	if (this.path.indexOf(path) === 0) {
		return true;
	}

	return false;
};

breel.build.FileResolver.prototype.enterPass = function(pass) {
	this.logger.finer('enterPass');
	
	this.pass = pass;
};

breel.build.FileResolver.prototype.exitPass = function(pass) {
	this.logger.finer('exitPass');
	
	this.pass = null;
};

breel.build.FileResolver.prototype.recurse = function(callback) {
	this.logger.fine('recurse');

	var absolutePath = this.getAbsolutePath();
	breel.build.utils.recurseDirectory(absolutePath, callback);
};

breel.build.FileResolver.prototype.writeFile = function(data) {
	this.logger.fine('writeFile');

	this.assertResolvesToFile();

	var absolutePath = this.getAbsolutePath();
	node.fs.writeFileSync(absolutePath, data, 'utf8');
};

breel.build.FileResolver.prototype.getOverlapsDelta = function(delta) {
	var fileResolver = this;
	var overlapsDelta = false;
	delta.recurse(function (path, changes) {
		if (fileResolver.containsPath(path)) {
			overlapsDelta = true;
			return true;
		}
	});

	return overlapsDelta;
};

/**
 * Assert that a pass is in progress
 */
breel.build.FileResolver.prototype.assertPass = function() {
	this.logger.finest('assertPass');

	if (!this.pass) {
		throw new Error('This method can only be called during a build pass.');
	}
};

/**
 * Assert that the path looks like a file (is not an existing directory)
 */
breel.build.FileResolver.prototype.assertResolvesToFile = function() {
	this.logger.finer('assertResolvesToFile');

	var absolutePath = this.getAbsolutePath();
	if (node.fs.existsSync(absolutePath)) {
		var stat = node.fs.statSync(absolutePath);
		if (stat.isDirectory()) {
			throw new Error('Must resolve to a file.');
		}
	}
};

    
