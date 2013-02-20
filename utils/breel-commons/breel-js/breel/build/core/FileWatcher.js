goog.provide('breel.build.FileWatcher');

goog.require('breel.build.Mark');
goog.require('breel.build.FileContext');
goog.require('breel.build.Delta');

goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

goog.require('node.assert');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.build.FileWatcher = function(options) {
	goog.base(this);

	node.assert.ok(options.fileContext instanceof breel.build.FileContext, 'fileContext must be provided');

	this.fileContext = options.fileContext;

	this.fileResolvers = [];
	this.isActive = false;
	this.latestMark = null;
	this.nextMarkIndex = 0;
	this.numPendingChanges = 0;
	this.pendingChangesDelta = null;
};
goog.inherits(breel.build.FileWatcher, goog.events.EventTarget);

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.FileWatcher.prototype.logger = goog.debug.Logger.getLogger('breel.build.FileWatcher');

/**
 * @enum {string}
 */
breel.build.FileWatcher.EventType = {
  CHANGE: 'change'
};

breel.build.FileWatcher.DEBOUNCE_SHORT_TIMEOUT = 200;
breel.build.FileWatcher.DEBOUNCE_LONG_TIMEOUT = 1000;

breel.build.FileWatcher.prototype.addFileResolver = function(fileResolver) {
	this.logger.fine('addFileResolver (' + fileResolver.path + ')');

	node.assert.ok(!this.isActive, 'Cannot add FileResolvers while active.');
	node.assert.equal(this.fileContext.name, fileResolver.contextName, 'FileResolver is for a different context.');
	node.assert.ok(this.fileResolvers.indexOf(fileResolver) === -1, 'FileResolver has already been added.');

	this.fileResolvers.push(fileResolver);
};

breel.build.FileWatcher.prototype.removeFileResolver = function(fileResolver) {
	this.logger.fine('removeFileResolver (' + fileResolver.path + ')');

	var index = this.fileResolvers.indexOf(fileResolver);

	node.assert.ok(!this.isActive, 'Cannot remove FileResolvers while active.');
	node.assert.equal(this.fileContext.name, fileResolver.contextName, 'FileResolver is for a different context.');
	node.assert.ok(index >= 0, 'FileResolver has not been added.');

	this.fileResolvers.splice(index, 1);
};

breel.build.FileWatcher.prototype.activate = function() {
	this.logger.fine('activate');
	
	this.isActive = true;

	var watchPath = this.fileContext.relativeToAbsolute('');

	this.logger.fine('watching: ' + watchPath);

	var core = new breel.build.FileWatcher.Core();
	core.on('create', goog.bind(this.onCoreChange, this, breel.build.Delta.Action.CREATE));
	core.on('change', goog.bind(this.onCoreChange, this, breel.build.Delta.Action.CHANGE));
	core.on('delete', goog.bind(this.onCoreChange, this, breel.build.Delta.Action.DELETE));
	core.on('watch', goog.bind(this.onCoreWatchChange, this, 'watch'));
	core.on('unwatch', goog.bind(this.onCoreWatchChange, this, 'unwatch'));
	core.watch(watchPath, goog.bind(this.verifyInterest, this));
};

breel.build.FileWatcher.prototype.verifyInterest = function(path, stat) {
	var ignoredBaseNames = ['.DS_Store'];
	var baseName = node.path.basename(path);
	var relativePath = this.fileContext.absoluteToRelative(path);

	var fileResolver, index;

	if (stat.isFile()) {
		if (ignoredBaseNames.indexOf(baseName) >= 0) {
			return false;
		}

		for (index = 0; index < this.fileResolvers.length; index++) {
			fileResolver = this.fileResolvers[index];
			if (fileResolver.containsPath(relativePath)) {
				return true;
			}
		}
	} else if (stat.isDirectory()) {
		// console.log('directory');
		for (index = 0; index < this.fileResolvers.length; index++) {
			fileResolver = this.fileResolvers[index];
			if (fileResolver.withinPath(relativePath) || fileResolver.containsPath(relativePath)) {
				return true;
			}
		}
	}

	return false;
};

/**
 * @private
 */
breel.build.FileWatcher.prototype.onCoreWatchChange = function(action, path, stat) {
	this.logger.finest('onCoreWatchChange: (' + action + ') ' + path);
};

/**
 * @private
 */
breel.build.FileWatcher.prototype.onCoreChange = function(action, path, stat) {
	this.logger.finest('onCoreChange: (' + action + ') ' + path);

	var debounceShortCallback = goog.bind(this.onDebounceTimeout, this, 'short');
	var debounceLongCallback = goog.bind(this.onDebounceTimeout, this, 'long');

	if (this.numPendingChanges === 0) {
		this.pendingChangesDelta = new breel.build.Delta();
		this.debounceLongTimeoutId = setTimeout(
			debounceLongCallback,
			breel.build.FileWatcher.DEBOUNCE_LONG_TIMEOUT
		);
	} else {
		clearTimeout(this.debounceShortTimeoutId);
	}

	var relativePath = this.fileContext.absoluteToRelative(path);

	this.pendingChangesDelta.appendChange(action, relativePath, stat);
	this.numPendingChanges++;

	this.debounceShortTimeoutId = setTimeout(
		debounceShortCallback,
		breel.build.FileWatcher.DEBOUNCE_SHORT_TIMEOUT
	);
};

breel.build.FileWatcher.prototype.onDebounceTimeout = function(timeoutType) {
	this.logger.finest('onDebounceTimeout (' + timeoutType + ') pending: ' + this.numPendingChanges);

	clearTimeout(this.debounceShortTimeoutId);
	clearTimeout(this.debounceLongTimeoutId);

	var numChanges = this.numPendingChanges;
	var delta = this.pendingChangesDelta;

	this.numPendingChanges = 0;
	this.pendingChangesDelta = null;

	this.dispatchChange(delta);
};

breel.build.FileWatcher.prototype.dispatchChange = function(delta) {
	this.logger.fine('dispatchChange: ' + delta.describe());

	if (this.latestMark) {
		var invalidatedMark = this.latestMark;
		this.latestMark = null;
		invalidatedMark.invalidate(delta);
	}
};

/**
 *
 */
breel.build.FileWatcher.prototype.mark = function() {
	if (this.latestMark === null) {
		this.logger.fine('mark (new)');
		this.latestMark = new breel.build.Mark({
			index: this.nextMarkIndex++,
			fileWatcher: this
		});
	} else {
		this.logger.fine('mark (existing)');
	}

	return this.latestMark;
};

goog.require('node.events');
goog.require('node.util');
goog.require('node.fs');
goog.require('node.path');

breel.build.FileWatcher.Core = function () {
	node.events.EventEmitter.call(this);
	this._watchers = {};
};

node.util.inherits(breel.build.FileWatcher.Core, node.events.EventEmitter);

breel.build.FileWatcher.Core.prototype.watch = function (source, verifyInterest) {
	var
		self = this,
		stat = node.fs.lstatSync(source),
		type,
		mtimeAtLastChange = stat.mtime,
		isInteresting = verifyInterest(source, stat);

	if (!isInteresting) {
		return;
	}

	if (stat.isDirectory()) {
		type = 'directory';
		var dirFiles = node.fs.readdirSync(source);
		for (var di = 0; di < dirFiles.length; di++) {
			var dirFile = node.path.join(source, dirFiles[di]);
			self.watch(dirFile, verifyInterest);
		}
	} else if (stat.isFile())  {
		type = 'file';
	}

	var watch = node.fs.watch(source, function (ev, _file) {
		if (!node.fs.existsSync(source)) {
			self.unwatch(source);
			self.emit('delete', source);
		} else {
			var stats;
			try {
				stats = node.fs.statSync(source);
			} catch (ex) {
				if (ex.code == 'ENOENT' && self.has(source)) {
					self.unwatch(source);
					self.emit('delete', source);
				}
				return;
			}
			if (stats.isFile()) {
				var hasBeenModified = (stats.mtime.getTime() != mtimeAtLastChange.getTime());
				if (hasBeenModified) {
					mtimeAtLastChange = stats.mtime;
					self.emit('change', source, stats);
				}
			} else if (stats.isDirectory()) {
				// if this is a new directory
				if (!self.has(source))
					self.emit('create', source, stats);

				// get list of files we are already watching
				// in this directory
				var existing = Object.keys(self._watchers)
					.filter(function (f) {
						var type = self._watchers[f].type;
						return source === node.path.dirname(f) && type === 'file';
					});

				// get a list of files in the directory
				var files = node.fs.readdirSync(source)
					.map(function (f) {
						return node.path.join(source, f);
					});

				// handle created
				files
					.filter(function (f) {
						return !self.has(f);
					})
					.forEach(function (f) {
						self.emit('create', f, node.fs.statSync(f));
						self.watch(f, verifyInterest);
					});

				// handle deleted
				existing
					.filter(function (f) {
						return !~files.indexOf(f);
					})
					.forEach(function (f) {
						self.emit('delete', f);
						self.unwatch(f);
					});
			}
		}
	});

	this._watchers[source] = {type: type, watch: watch};

	this.emit('watch', source);
};

breel.build.FileWatcher.Core.prototype.has = function (source) {
	return ('undefined' !== typeof this._watchers[source]) ? true : false;
};

breel.build.FileWatcher.Core.prototype.unwatch = function (source) {
	if (this.has(source)) {
		this._watchers[source].watch.close();
		delete this._watchers[source];
	}
	this.emit('unwatch', source);
};

breel.build.FileWatcher.Core.prototype.clear = function () {
	for (var source in this._watchers) {
		this.unwatch(source);
	}
};
