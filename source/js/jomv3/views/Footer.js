goog.provide('joeonmars.views.Footer');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.Footer = function() {
  goog.events.EventTarget.call(this);
  
  this.domElement = goog.dom.getElement('footer-wrapper');
  this.infoDom = goog.dom.getElement('footer-info');
  this.navigationDom = goog.dom.getElement('footer-navigation');

  this.mode = null;
};
goog.inherits(joeonmars.views.Footer, goog.events.EventTarget);


joeonmars.views.Footer.prototype.init = function() {
  // set initial mode to INFO
  this.setMode( joeonmars.views.Footer.Mode.INFO );
};


joeonmars.views.Footer.prototype.setMode = function(mode) {
  if(this.mode === mode) return;
  else this.mode = mode;

  if(mode == joeonmars.views.Footer.Mode.INFO) {
    goog.style.showElement(this.infoDom, false);
    goog.style.showElement(this.navigationDom, true);

    joeonmars.utils.tweenToPosition(this.navigationDom, 0, 50, 1, null, this.onSlidedDown, this);

  }else if(mode == joeonmars.views.Footer.Mode.NAVIGATION) {
    goog.style.showElement(this.infoDom, true);
    goog.style.showElement(this.navigationDom, false);

    joeonmars.utils.tweenToPosition(this.infoDom, 0, 50, 1, null, this.onSlidedDown, this);
  }
};


joeonmars.views.Footer.prototype.onSlidedDown = function() {
  if(this.mode == joeonmars.views.Footer.Mode.INFO) {

    goog.style.showElement(this.navigationDom, false);
    goog.style.showElement(this.infoDom, true);
    joeonmars.utils.tweenToPosition(this.infoDom, 0, 0, 1);

  }else if(this.mode == joeonmars.views.Footer.Mode.NAVIGATION) {

    goog.style.showElement(this.infoDom, false);
    goog.style.showElement(this.navigationDom, true);
    joeonmars.utils.tweenToPosition(this.navigationDom, 0, 0, 1);

  }
};


joeonmars.views.Footer.prototype.onScrolled = function(left) {
  joeonmars.utils.setDomPosition(this.domElement, left, 0);
};


joeonmars.views.Footer.prototype.onResize = function(windowSize) {

};


joeonmars.views.Footer.Mode = {
  INFO: 'info',
  NAVIGATION: 'navigation'
};