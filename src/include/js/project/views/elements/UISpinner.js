goog.provide('joeonmars.views.elements.UISpinner');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.elements.UISpinner = function(className) {
  goog.base(this);

  // construct html dom elements
  this.domElement = goog.dom.createDom('div');
};
goog.inherits(joeonmars.views.elements.UISpinner, goog.events.EventTarget);