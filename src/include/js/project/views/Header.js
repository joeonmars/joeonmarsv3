goog.provide('joeonmars.views.Header');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.Header = function() {
  goog.events.EventTarget.call(this);
  
  //this.domElement = goog.dom.getElement('header-wrapper');
};
goog.inherits(joeonmars.views.Header, goog.events.EventTarget);


joeonmars.views.Header.prototype.init = function() {

};


joeonmars.views.Header.prototype.onResize = function(windowSize) {
  
};