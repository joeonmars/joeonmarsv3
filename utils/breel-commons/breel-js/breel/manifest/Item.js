/**
 * @fileoverview Item.
 */

goog.provide('breel.manifest.Item');

/**
 * Item
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.manifest.Item = function(url, properties) {
  goog.base(this);

  this.url = url;
  this.properties = properties;
};

goog.inherits(breel.manifest.Item, goog.events.EventTarget);

/**
 * Description
 *
 * @enum {string}
 */
breel.manifest.Item.Type = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  TEXT: 'text'
};


/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.manifest.Item.prototype.logger = goog.debug.Logger.getLogger('breel.manifest.Item');

breel.manifest.Item.prototype.getLoaderTask = goog.abstractMethod;

