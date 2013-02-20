/**
 * @fileoverview AudioItem.
 */

goog.provide('breel.manifest.AudioItem');

// goog.require('breel.tasks.AudioLoaderTask');

/**
 * AudioItem
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.manifest.AudioItem = function(partialUrl) {
  goog.base(this);

  this.partialUrl = partialUrl;
};

goog.inherits(breel.manifest.AudioItem, breel.manifest.Item);

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.manifest.AudioItem.prototype.logger = goog.debug.Logger.getLogger('breel.manifest.AudioItem');

breel.manifest.AudioItem.prototype.getLoaderItem = function() {
	var loaderItem = new breel.tasks.AudioLoaderTask(this.getUrl());
};

breel.manifest.AudioItem.prototype.getUrl = function() {
	return this.partialUrl + '.' + this.getFileExtension();
};

breel.manifest.AudioItem.prototype.getFileExtension = function() {
	return goog.userAgent.GECKO ? 'ogg' : 'mp3';
};
