goog.provide('breel.build.Mark');

goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.build.Mark = function(options) {
	goog.base(this);

	this.index = options.index;
	this.time = options.time || goog.now();
	this.fileWatcher = options.fileWatcher;

	this.forwardDelta = null;

	this.isValid = true;
};
goog.inherits(breel.build.Mark, goog.events.EventTarget);

breel.build.Mark.EventType = {
	INVALIDATE: 'invalidate'
};

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.Mark.prototype.logger = goog.debug.Logger.getLogger('breel.build.Mark');

breel.build.Mark.prototype.invalidate = function(delta) {
	this.logger.fine('invalidate');

	this.forwardDelta = delta;
	
	this.isValid = false;
	goog.events.dispatchEvent(this, {
		type: breel.build.Mark.EventType.INVALIDATE
	});
};

