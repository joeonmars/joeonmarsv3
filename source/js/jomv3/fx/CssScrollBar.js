goog.provide('jomv3.fx.CssScrollBar');

goog.require('goog.fx.dom.Slide');
goog.require('goog.fx.easing');
goog.require('goog.fx.Animation');
goog.require('goog.style');
goog.require('jomv3.fx.DummyScrollBar');

/**
 * @constructor
 */
jomv3.fx.CssScrollBar = function(outerElement, innerElement, container, direction, options) {
  this._handleSlideAnim = null;
  this._cssProperty = options['cssProperty'] ? options['cssProperty'] : jomv3.fx.CssScrollBar.CssProperty.POSITION;
  this._bouncing = (options['bouncing'] === true) ? true : false;

  goog.base(this, outerElement, innerElement, container, direction, options);
};
goog.inherits(jomv3.fx.CssScrollBar, jomv3.fx.DummyScrollBar);


jomv3.fx.CssScrollBar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};


jomv3.fx.CssScrollBar.prototype.getScrollPosition = function() {
  var position;

  if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.POSITION) {
    position = goog.style.getPosition(this.innerElement);
  }else {
    position = goog.style.getCssTranslation(this.innerElement);
  }

  position.x *= -1;
  position.y *= -1;
  return position;
};


jomv3.fx.CssScrollBar.prototype.canScrollFurther = function(delta) {
  // normalize direction to 1 or -1
  var dir = delta/Math.abs(delta);

  var handlePos = goog.style.getPosition(this.handle);

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    if(dir === -1) {
      // scroll right
      return (handlePos.x < this._sliderSize.width - this._handleSize.width);
    }else {
      // scroll left
      return (handlePos.x > 0);
    }
  }else {
    if(dir === -1) {
      // scroll down
      return (handlePos.y < this._sliderSize.height - this._handleSize.height);
    }else {
      // scroll up
      return (handlePos.y > 0);
    }
  }
};


jomv3.fx.CssScrollBar.prototype.startAnimating = function(startX, startY, endX, endY, dur) {
  goog.base(this, 'startAnimating');

  this._handleSlideAnim = new goog.fx.dom.Slide(this.handle, [startX, startY], [endX, endY], dur, goog.fx.easing.easeOut);
  goog.events.listen(this._handleSlideAnim, goog.fx.Animation.EventType.ANIMATE, this.onActiveScroll, false, this);
  goog.events.listen(this._handleSlideAnim, goog.fx.Animation.EventType.END, this.onSlideEnd, false, this);
  this._handleSlideAnim.play();
};


jomv3.fx.CssScrollBar.prototype.stopAnimating = function() {
  goog.base(this, 'stopAnimating');

  if(this._handleSlideAnim) {
    goog.events.unlisten(this._handleSlideAnim, goog.fx.Animation.EventType.ANIMATE, this.onActiveScroll, false, this);
    goog.events.unlisten(this._handleSlideAnim, goog.fx.Animation.EventType.END, this.onSlideEnd, false, this);
    this._handleSlideAnim.pause();
    this._handleSlideAnim.dispose();
    this._handleSlideAnim = null;
  }
};


jomv3.fx.CssScrollBar.prototype.getAnimationDuration = function(start, end) {
  var x;
  if(this.isHorizontalLayout) {
    x = Math.abs(start - end) / this._sliderSize.width;
  }else {
    x = Math.abs(start - end) / this._sliderSize.height;
  }

  var minMS = 100;
  var maxMS = 500;
  var interpolation = goog.math.lerp(minMS, maxMS, x);
  return interpolation;
};


/**
 * Set scroll position based on the position of handle
 */
jomv3.fx.CssScrollBar.prototype.setCssPosition = function() {
  var handlePos = goog.style.getPosition(this.handle);
  var scrollPosition;
  var innerElementLength;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    innerElementLength = this._innerSize.width;
  }else {
    innerElementLength = this._innerSize.height;
  }

  if(this.isHorizontalLayout) {
    scrollPosition = handlePos.x / this._sliderSize.width * innerElementLength;

    if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.POSITION) {
      goog.style.setStyle(this.innerElement, 'left', scrollPosition + 'px');
    }else if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.TRANSLATE) {
      goog.style.setStyle(this.innerElement, 'transform', 'translate(' + scrollPosition + 'px, 0px)');
    }else if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.TRANSLATE_3D) {
      goog.style.setStyle(this.innerElement, 'transform', 'translate3d(' + scrollPosition + 'px, 0px, 0px)');
    }
    
  }else {
    scrollPosition = - handlePos.y / this._sliderSize.height * innerElementLength;

    if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.POSITION) {
      goog.style.setStyle(this.innerElement, 'top', scrollPosition + 'px');
    }else if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.TRANSLATE) {
      goog.style.setStyle(this.innerElement, 'transform', 'translate(0px, ' + scrollPosition + 'px)');
    }else if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.TRANSLATE_3D) {
      goog.style.setStyle(this.innerElement, 'transform', 'translate3d(0px, ' + scrollPosition + 'px, 0px)');
    }
  }
};


jomv3.fx.CssScrollBar.prototype.scrollTo = function(scrollPosition, animate) {
  goog.base(this, 'scrollTo', scrollPosition, animate);

  this.stopAnimating();

  // get scroll to handle position
  var offset;
  var innerElementLength;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    innerElementLength = this._innerSize.width;
  }else {
    innerElementLength = this._innerSize.height;
  }

  if(this.isHorizontalLayout) {
    offset = scrollPosition / innerElementLength * this._sliderSize.width;
    offset = Math.min( Math.max(0, offset), this._sliderSize.width - this._handleSize.width);
  }else {
    offset = scrollPosition / innerElementLength * this._sliderSize.height;
    offset = Math.min( Math.max(0, offset), this._sliderSize.height - this._handleSize.height);
  }

  var handlePos = goog.style.getPosition(this.handle);
  var startX, endX, startY, endY, dur;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    startX = handlePos.x;
    startY = handlePos.y;
    endX = offset;
    endY = handlePos.y;
  }else {
    startX = handlePos.x;
    startY = handlePos.y;
    endX = handlePos.x;
    endY = offset;
  }

  // cap endX endY if not bouncing
  if(!this._bouncing) {
    endX = Math.max(0, Math.min(endX, this._sliderSize.width - this._handleSize.width));
    endY = Math.max(0, Math.min(endY, this._sliderSize.height - this._handleSize.height));
  }

  if(animate === true) {

    if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {

      var dur = this.getAnimationDuration(startX, endX);
      this.startAnimating(startX, startY, endX, endY, dur);

    }else {

      var dur = this.getAnimationDuration(startY, endY);
      this.startAnimating(startX, startY, endX, endY, dur);

    }

  }else {

    goog.style.setPosition(this.handle, endX, endY);
    this.setCssPosition();

    // external callback
    if(this._onActiveScrollCallback) {
      this._onActiveScrollCallback.call();
    }
  }
};


jomv3.fx.CssScrollBar.prototype.scrollBy = function(delta, animate) {
  goog.base(this, 'scrollBy', delta, animate);

  this.stopAnimating();

  // get target position
  var handlePos = goog.style.getPosition(this.handle);
  var startX, endX, startY, endY, dur;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    startX = handlePos.x;
    startY = handlePos.y;
    endX = handlePos.x + delta;
    endY = handlePos.y;
    dur = this.getAnimationDuration(startX, endX);
  }else {
    startX = handlePos.x;
    startY = handlePos.y;
    endX = handlePos.x;
    endY = handlePos.y + delta;
    dur = this.getAnimationDuration(startY, endY);
  }

  // cap endX endY if not bouncing
  if(!this._bouncing) {
    endX = Math.max(0, Math.min(endX, this._sliderSize.width - this._handleSize.width));
    endY = Math.max(0, Math.min(endY, this._sliderSize.height - this._handleSize.height));
  }

  if(animate === true) {

    this.startAnimating(startX, startY, endX, endY, dur);

  }else {

    goog.style.setPosition(this.handle, endX, endY);
    this.setCssPosition();
    this.onSlideEnd({x:endX, y:endY});

    // external callback
    if(this._onActiveScrollCallback) {
      this._onActiveScrollCallback.call();
    }

  }
};


jomv3.fx.CssScrollBar.prototype.onDragStart = function(e) {
  goog.base(this, 'onDragStart', e);
};


jomv3.fx.CssScrollBar.prototype.onDrag = function(e) {
  goog.base(this, 'onDrag', e);
};


jomv3.fx.CssScrollBar.prototype.onDragEnd = function(e) {
  goog.base(this, 'onDragEnd', e);

  this.onSlideEnd({x:e.left, y:e.top});
};


jomv3.fx.CssScrollBar.prototype.onActiveScroll = function(e) {
  goog.base(this, 'onActiveScroll', e);

  this.setCssPosition();
};


jomv3.fx.CssScrollBar.prototype.onPassiveScroll = function(e) {
  goog.base(this, 'onPassiveScroll', e);

  var scrollPosition;
  var innerElementLength;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {

    innerElementLength = this._innerSize.width;

    if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.POSITION) {
      scrollPosition = goog.style.getPosition(this.innerElement).x;
    }else {
      scrollPosition = goog.style.getCssTranslation(this.innerElement).x;
    }

  }else {

    innerElementLength = this._innerSize.height;

    if(this._cssProperty === jomv3.fx.CssScrollBar.CssProperty.POSITION) {
      scrollPosition = goog.style.getPosition(this.innerElement).y;
    }else {
      scrollPosition = goog.style.getCssTranslation(this.innerElement).y;
    }

  }

  scrollPosition *= -1;

  if(this.isHorizontalLayout) {
    goog.style.setStyle(this.handle, 'left', scrollPosition / innerElementLength * this._sliderSize.width + 'px');
  }else {
    goog.style.setStyle(this.handle, 'top', scrollPosition / innerElementLength * this._sliderSize.height + 'px');
  }
};


jomv3.fx.CssScrollBar.prototype.onSlideEnd = function(e) {
  if(this.isHorizontalLayout) {
    if(e.x < 0) {

      // ease back to the start position of horizontal scroll range
      var startX = e.x;
      var endX = 0;
      var startY = 0;
      var endY = 0;
      var dur = this.getAnimationDuration(startX, endX);
      this.startAnimating(startX, startY, endX, endY, dur);

    }else if(e.x > this._scrollBarSize.width - this._handleSize.width) {

      // ease back to the end position of horizontal scroll range
      var startX = e.x;
      var endX = this._scrollBarSize.width - this._handleSize.width;
      var startY = 0;
      var endY = 0;
      var dur = this.getAnimationDuration(startX, endX);
      this.startAnimating(startX, startY, endX, endY, dur);

    }
  }else {
    if(e.y < 0) {

      // ease back to the start position of vertical scroll range
      var startX = 0;
      var endX = 0;
      var startY = e.y;
      var endY = 0;
      var dur = this.getAnimationDuration(startY, endY);
      this.startAnimating(startX, startY, endX, endY, dur);

    }else if(e.y > this._scrollBarSize.height - this._handleSize.height) {

      // ease back to the end position of vertical scroll range
      var startX = 0;
      var endX = 0;
      var startY = e.y;
      var endY = this._scrollBarSize.height - this._handleSize.height;
      var dur = this.getAnimationDuration(startY, endY);
      this.startAnimating(startX, startY, endX, endY, dur);

    }
  }
};


jomv3.fx.CssScrollBar.prototype.onResize = function(e) {
  goog.base(this, 'onResize', e);

  if(this.isHorizontalLayout) {
    if(this._bouncing) {
      this._dragRect.left = - this._handleSize.width;
      this._dragRect.width = this._scrollBarSize.width + this._handleSize.width;
    }else {
      this._dragRect.left = 0;
      this._dragRect.width = this._scrollBarSize.width - this._handleSize.width;
    }
  }else {
    if(this._bouncing) {
      this._dragRect.top = - this._handleSize.height;
      this._dragRect.height = this._scrollBarSize.height + this._handleSize.height;
    }else {
      this._dragRect.top = 0;
      this._dragRect.height = this._scrollBarSize.height - this._handleSize.height;
    }
  }

  this.dragger.setLimits(this._dragRect);

  this.dispatchEvent(jomv3.fx.DummyScrollBar.EventType.ACTIVE_SCROLL);
};


jomv3.fx.CssScrollBar.CssProperty = {
  POSITION: 'position',
  TRANSLATE: 'translate',
  TRANSLATE_3D: 'translate_3d'
};