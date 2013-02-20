goog.provide('breel.build.Builder');

goog.require('breel.build.FileContext');
goog.require('breel.build.FileWatcher');
goog.require('breel.build.Pass');

goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

goog.require('node.assert');

breel.build.Builder = function (options) {
	goog.base(this);

	this.phases = [];
	this.cleanMark = null;

	if (!options.destinationPath) {
		throw new Error('destinationPath must be provided');
	}

	// Create file contexts
	this.fileContexts = {};
	this.fileContexts.source = new breel.build.FileContext({
		name: breel.build.FileContext.Name.SOURCE,
		path: options.sourcePath || 'source/'
	});
	this.fileContexts.temporary = new breel.build.FileContext({
		name: breel.build.FileContext.Name.TEMPORARY,
		path: options.temporaryPath || 'temp/'
	});
	this.fileContexts.destination = new breel.build.FileContext({
		name: breel.build.FileContext.Name.DESTINATION,
		path: options.destinationPath
	});
};

goog.inherits(breel.build.Builder, goog.events.EventTarget);

breel.build.Builder.prototype.logger = goog.debug.Logger.getLogger('breel.build.Builder');

breel.build.Builder.prototype.addPhase = function(phase) {
  this.logger.fine('addPhase', phase);

	this.phases.push(phase);
};

breel.build.Builder.prototype.assertValid = function() {
	this.logger.fine('assertValid');
	
	node.assert.ok(this.phases.length > 0, 'Builders must have at lease one phase.');

	for (var phaseIndex = 0; phaseIndex < this.phases.length; phaseIndex++) {
		this.phases[phaseIndex].assertValid();
	}
};

breel.build.Builder.prototype.run = function(options) {
	this.logger.fine('run');

	var builder = this;

	builder.build(function () {
		if (options.shouldWatch) {
			builder.watch();
		} else {
			builder.exit();
		}
	});

};

breel.build.Builder.prototype.build = function(completionCallback) {
	this.logger.fine('build');

	this.buildFromMark(null, completionCallback);
};

breel.build.Builder.prototype.buildFromMark = function(mark, completionCallback) {
	this.logger.fine('buildFromMark');
	
	var pass = new breel.build.Pass({
		builder: this,
		startMark: mark
	});

	if (completionCallback) {
		goog.events.listenOnce(pass, breel.build.Pass.EventType.COMPLETE, completionCallback);
	}

	pass.execute();
};

breel.build.Builder.prototype.watch = function() {
	this.logger.fine('watch');

	this.watcher = new breel.build.FileWatcher({
		fileContext: this.fileContexts.source
	});
	for (var phaseIndex = 0; phaseIndex < this.phases.length; phaseIndex++) {
		var phase = this.phases[phaseIndex];
		var watchableFileResolvers = phase.getWatchableFileResolvers();
		for (var fileResolverIndex = 0; fileResolverIndex < watchableFileResolvers.length; fileResolverIndex++) {
			var fileResolver = watchableFileResolvers[fileResolverIndex];
			this.watcher.addFileResolver(fileResolver);
		}
	}
	this.watcher.activate();
	this.markAsClean();
};

breel.build.Builder.prototype.markAsClean = function() {
	this.logger.fine('markAsClean');

	this.cleanMark = this.watcher.mark();
	goog.events.listenOnce(this.cleanMark, breel.build.Mark.EventType.INVALIDATE, this.onDirty, false, this);
};

breel.build.Builder.prototype.onDirty = function(event) {
	this.logger.fine('onDirty');

	var builder = this;

	builder.buildFromMark(this.cleanMark, function () {
		builder.markAsClean();
	});
};

breel.build.Builder.prototype.exit = function() {
	this.logger.fine('exit');

	process.exit();
};

breel.build.Builder.prototype.getProjectPath = function() {
	return process.cwd();
};