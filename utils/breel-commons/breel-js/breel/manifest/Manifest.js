/**
 * @fileoverview Manifest.
 */

goog.provide('breel.manifest.Manifest');

/**
 * Manifest
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.manifest.Manifest = function(data) {
  goog.base(this);

  this.parseData(data);
};

goog.inherits(breel.manifest.Manifest, goog.events.EventTarget);

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.manifest.Manifest.prototype.logger = goog.debug.Logger.getLogger('breel.manifest.Manifest');

breel.manifest.Manifest.prototype.parseData = function(data) {
	this.logger.info('parseData', data);
	
	var branchKeyRE = /^(\?([^\+]+?))?\+(.+?)\+$/;
	var typeBranchKeyRE = /^\.[a-z0-9-]?$/;
	var leafKeyRE = /^+(.+?)$/;

	var match;

	function parseBranch(branch, parentBranchProperties, parentConditions) {
		var branchProperties = {};
		branchProperties.prototype = parentBranchProperties;

		var conditions = parentConditions;

		var keys = goog.object.getKeys(branch);
		for (var keyIndex = keys.length - 1; keyIndex >= 0; keyIndex--) {
			var key = keys[keyIndex];
			if ((match = branchKeyRE.exec(key))) {
				parseBranch(branch[key], branchProperties, conditions);
			} else if ((match = typeBranchKeyRE.exec(key))) {
				parseBranch(branch[key]);
			} else if ((match = leafKeyRE.exec(key))) {

			} else {
				branchProperties[key] = branch[key];
			}
		}
	}

	parseBranch(data);
};

breel.manifest.Manifest.prototype.addItem = function(item) {
	this.logger.info('addItem', item);
};