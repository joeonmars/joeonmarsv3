goog.provide('joeonmars.views.MainComponent');

goog.require('goog.events.EventTarget');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.MainComponent = function() {
  goog.events.EventTarget.call(this);
  this.setParentEventTarget(joeonmars.Main.getInstance());

  this.domElement = null;
  this.isActivated = false;
};
goog.inherits(joeonmars.views.MainComponent, goog.events.EventTarget);


joeonmars.views.MainComponent.prototype.init = function() {
  this.onFadedOut();
};


joeonmars.views.MainComponent.prototype.activate = function() {
  this.isActivated = true;
};


joeonmars.views.MainComponent.prototype.deactivate = function() {
  this.isActivated = false;
};


joeonmars.views.MainComponent.prototype.onResize = function(windowSize) {
	
};