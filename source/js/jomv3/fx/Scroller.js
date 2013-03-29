/**
 * @fileoverview A scroller composed of both Scroller and DummyScrollBar
 */
goog.provide('jomv3.fx.Scroller');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.userAgent');
goog.require('jomv3.fx.ScrollableElement');
goog.require('jomv3.fx.DefaultScrollBar');
goog.require('jomv3.fx.CssScrollBar');

/**
 * @constructor
 */
jomv3.fx.Scroller = function(scrollableElement, scrollBars) {
  goog.base(this);

  this._scrollableElement = scrollableElement;
  this._scrollBars = goog.isArray(scrollBars) ? scrollBars : [scrollBars];

  this.create();
};
goog.inherits(jomv3.fx.Scroller, goog.events.EventTarget);


jomv3.fx.Scroller.prototype.create = function() {
  goog.array.forEach(this._scrollBars, function(scrollBar) {
    this._scrollableElement.attachedDoms.push(scrollBar.domElement);
    goog.events.listen(scrollBar, jomv3.fx.DummyScrollBar.EventType.ACTIVE_SCROLL, this.onScrollBarActiveScroll, false ,this);
  }, this);

  goog.events.listen(this._scrollableElement, jomv3.fx.ScrollableElement.EventType.SCROLL, this.onScrollableElementScroll, false ,this);
};


jomv3.fx.Scroller.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  goog.array.forEach(this._scrollBars, function(scrollBar) {
    goog.events.unlisten(scrollBar, jomv3.fx.DummyScrollBar.EventType.ACTIVE_SCROLL, this.onScrollBarActiveScroll, false ,this);
  }, this);

  goog.events.unlisten(this._scrollableElement, jomv3.fx.ScrollableElement.EventType.SCROLL, this.onScrollableElementScroll, false ,this);
};


jomv3.fx.Scroller.prototype.onScrollBarActiveScroll = function(e) {
  //console.log('active scroll ' + goog.getUid(e.target));
  var scrollPosition = e.target.getScrollPosition();
  this._scrollableElement.scrollTo(scrollPosition.x, scrollPosition.y);
};


jomv3.fx.Scroller.prototype.onScrollableElementScroll = function(e) {
  goog.array.forEach(this._scrollBars, function(scrollBar) {
    scrollBar.dispatchEvent(jomv3.fx.DummyScrollBar.EventType.PASSIVE_SCROLL);
  }, this);
};