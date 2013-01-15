goog.provide('joeonmars.views.Overlay');

goog.require('goog.events.EventTarget');
goog.require('goog.style');

goog.require('joeonmars.events.OverlayEvent');

/**
 * @constructor
 */

joeonmars.views.Overlay = function() {
  goog.base(this);

  this.domElement = null;
  this.isShown = false;
  this.isActivated = false;
};
goog.inherits(joeonmars.views.Overlay, goog.events.EventTarget);

joeonmars.views.Overlay.prototype.init = function() {
  this.onFadedOut();
};

joeonmars.views.Overlay.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};

joeonmars.views.Overlay.prototype.activate = function() {
  this.isActivated = true;
};

joeonmars.views.Overlay.prototype.deactivate = function() {
  this.isActivated = false;
};

joeonmars.views.Overlay.prototype.fadeIn = function() {
  goog.style.showElement(this.domElement, true);
  this.isShown = true;

  joeonmars.utils.fadeIn(this.domElement, .5, this.onFadedIn, this);
};

joeonmars.views.Overlay.prototype.fadeOut = function() {
  joeonmars.utils.fadeOut(this.domElement, .5, this.onFadedOut, this);
  this.deactivate();
};

joeonmars.views.Overlay.prototype.onFadedIn = function() {
  this.dispatchEvent( new joeonmars.events.OverlayEvent(joeonmars.events.OverlayEvent.EventType.FADED_IN) );
};

joeonmars.views.Overlay.prototype.onFadedOut = function() {
  goog.style.setOpacity(this.domElement, 0);
  goog.style.showElement(this.domElement, false);
  this.isShown = false;

  this.dispatchEvent( new joeonmars.events.OverlayEvent(joeonmars.events.OverlayEvent.EventType.FADED_OUT) );
};

joeonmars.views.Overlay.prototype.onResize = function(windowSize) {
  if(!this.isShown) return;
};