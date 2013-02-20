goog.provide('joeonmars.controllers.ResizeController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.EventType');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Size');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.controllers.ResizeController = function() {
  goog.base(this);

  this.currentOrientation = '';
  this.contentWrapperDom = goog.dom.getElement('content-wrapper');

  this.viewportSizeMonitor = new goog.dom.ViewportSizeMonitor();
  this.pageSize = null;
  this.windowSize = null;
};
goog.inherits(joeonmars.controllers.ResizeController, goog.events.EventTarget);


joeonmars.controllers.ResizeController.prototype.init = function() {
  // listen for window resize event
  goog.events.listen(this.viewportSizeMonitor, goog.events.EventType.RESIZE, this.onResize, false, this);
  goog.events.listen(goog.dom.getWindow(), 'orientationchange', this.onOrientationChange, false, this);

  // sim resize on start up
  this.onResize();
};


joeonmars.controllers.ResizeController.prototype.onResize = function(e) {
	this.windowSize = this.viewportSizeMonitor.getSize() || goog.dom.getViewportSize();

  this.pageSize = this.windowSize.clone();
  var minSize = joeonmars.controllers.ResizeController.MIN_SIZE;
  if(this.pageSize.width < minSize.width) this.pageSize.width = minSize.width;
  if(this.pageSize.height < minSize.height) this.pageSize.height = minSize.height;

  // if window size is smaller than min site size,
  // show the native scroller
  if(this.windowSize.width < minSize.width) {
    goog.dom.classes.add(document.body, 'scrollableX');
  }else {
    goog.dom.classes.remove(document.body, 'scrollableX');
  }

  if(this.windowSize.height < minSize.height) {
    goog.dom.classes.add(document.body, 'scrollableY');
  }else {
    goog.dom.classes.remove(document.body, 'scrollableY');
  }

  // resize...
  var sectionController = joeonmars.GET_VAR('sectionController');
  if(sectionController) sectionController.onResize(this.pageSize);
};


joeonmars.controllers.ResizeController.prototype.onOrientationChange = function(e) {
  var orientation;
  switch(e.currentTarget.orientation) {
    case 0:
    case 180:
    orientation = 'portrait';
    break;

    case 90:
    case -90:
    orientation = 'landscape';
    break;

    default:
    break;
  }

  if(this.currentOrientation !== orientation) {
    this.onResize();
    this.currentOrientation = orientation;
  }
};


joeonmars.controllers.ResizeController.MIN_SIZE = new goog.math.Size(1024, 640);