goog.provide('breel.build.Delta');

goog.require('goog.debug.Logger');
goog.require('goog.object');

/**
 * @constructor
 */
breel.build.Delta = function() {
	this.changes_ = {};
};

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.Delta.prototype.logger = goog.debug.Logger.getLogger('breel.build.Delta');

/**
 * Actions
 *
 * @enum {string}
 */
breel.build.Delta.Action = {
	CREATE: 'create',
	CHANGE: 'change',
	DELETE: 'delete'
};

breel.build.Delta.prototype.appendChange = function(action, path, stat) {
	this.logger.finer('appendChange: (' + action + ') ' + path);
	
	if (!this.changes_[path]) {
		this.changes_[path] = [];
	}

	this.changes_[path].push({
		action: action,
		stat: stat
	});
};

breel.build.Delta.prototype.pathHasChanged = function(path) {
	return !!this.changes_[path];
};

breel.build.Delta.prototype.recurse = function(callback) {
	this.logger.finer('recurse');
	for (var path in this.changes_) {
		var changesForPath = this.changes_[path];
		var shouldBreak = callback(path, changesForPath);
		if (shouldBreak) {
			break;
		}
	}
};

breel.build.Delta.prototype.describe = function() {
	var changedPaths = goog.object.getKeys(this.changes_);
	if (changedPaths.length > 3) {
		return changedPaths.slice(0, 3).join(', ') + ', + ' + (changedPaths.length - 3) + ' more';
	}

	return changedPaths.join(', ');
};

