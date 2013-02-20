goog.provide('breel.build.FileContext');

goog.require('goog.events.EventTarget');

goog.require('node.fs');
goog.require('node.path');
goog.require('node.assert');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.build.FileContext = function(options) {
  goog.base(this);

  // Perform some checks
  node.assert.ok(options.name, 'name must be provided');
  node.assert.ok(options.path, 'path must be provided');
  node.assert.ok(options.path.slice(-1) === '/', 'path must end with a slash');

  this.name = options.name;
  this.path = options.path;
};
goog.inherits(breel.build.FileContext, goog.events.EventTarget);

/**
 * @enum
 */
breel.build.FileContext.Name = {
	SOURCE: 'source',
	TEMPORARY: 'temporary',
	DESTINATION: 'destination'
};

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.FileContext.prototype.logger = goog.debug.Logger.getLogger('breel.build.FileContext');

breel.build.FileContext.prototype.relativeToAbsolute = function(relativePath) {
	return node.path.resolve(process.cwd(), this.path, relativePath);
};

breel.build.FileContext.prototype.absoluteToRelative = function(absolutePath) {
  return node.path.relative(node.path.resolve(process.cwd(), this.path), absolutePath);
};

breel.build.FileContext.prototype.relativeToProject = function(relativePath) {
  return node.path.relative(process.cwd(), this.relativeToAbsolute(relativePath));
};

