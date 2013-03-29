goog.provide('jomv3.fx.DefaultScrollBar');

goog.require('jomv3.fx.DummyScrollBar');

/**
 * @constructor
 */
jomv3.fx.DefaultScrollBar = function(outerElement, innerElement, container, direction, options) {
  goog.base(this, outerElement, innerElement, container, direction, options);

  this._animProps = {ease: (options.ease || .4), end:0, last:0, current:0, scrollProp:''};

  // a native scroll event dispatched by the outerElement when its scrollLeft/Top changed
  goog.events.listen(this.outerElement, goog.events.EventType.SCROLL, this.onNativeScroll, false, this);
};
goog.inherits(jomv3.fx.DefaultScrollBar, jomv3.fx.DummyScrollBar);


jomv3.fx.DefaultScrollBar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  goog.events.unlisten(this.outerElement, goog.events.EventType.SCROLL, this.onNativeScroll, false, this);
};


jomv3.fx.DefaultScrollBar.prototype.getScrollPosition = function() {
  return {x: this.outerElement.scrollLeft, y: this.outerElement.scrollTop};
};


jomv3.fx.DefaultScrollBar.prototype.canScrollFurther = function(delta) {
  // normalize direction to 1 or -1
  var dir = delta/Math.abs(delta);

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    if(dir === -1) {
      // scroll right
      return (this.outerElement.scrollLeft < this.outerElement.scrollWidth - this.outerElement.offsetWidth);
    }else {
      // scroll left
      return (this.outerElement.scrollLeft > 0);
    }
  }else {
    if(dir === -1) {
      // scroll down
      return (this.outerElement.scrollTop < this.outerElement.scrollHeight - this.outerElement.offsetHeight);
    }else {
      // scroll up
      return (this.outerElement.scrollTop > 0);
    }
  }
};


jomv3.fx.DefaultScrollBar.prototype.startAnimating = function(scrollProp, end, last, current) {
  goog.base(this, 'startAnimating');

  this._animProps.end = end;
  this._animProps.scrollProp = scrollProp;
  this._animProps.last = last;
  this._animProps.current = last;

  goog.fx.anim.registerAnimation(this);
  this.onAnimationFrame();
};


jomv3.fx.DefaultScrollBar.prototype.stopAnimating = function() {
  goog.base(this, 'stopAnimating');
  goog.fx.anim.unregisterAnimation(this);
};


jomv3.fx.DefaultScrollBar.prototype.setScrollPosition = function() {
  var innerElementLength;
  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    innerElementLength = this._innerSize.width;
  }else {
    innerElementLength = this._innerSize.height;
  }

  var scrollPosition;
  var handlePosition;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    scrollPosition = this.outerElement.scrollLeft;
  }else {
    scrollPosition = this.outerElement.scrollTop;
  }

  if(this.isHorizontalLayout) {
    handlePosition = this._sliderSize.width * (scrollPosition / innerElementLength);
    goog.style.setPosition(this.handle, handlePosition, 0);
  }else {
    handlePosition = this._sliderSize.height * (scrollPosition / innerElementLength);
    goog.style.setPosition(this.handle, 0, handlePosition);
  }
};


jomv3.fx.DefaultScrollBar.prototype.scrollTo = function(scrollPosition, animate) {
  goog.base(this, 'scrollTo', scrollPosition, animate);

  if(animate === true) {

    var end = scrollPosition;
    var scrollProp, last, current;

    if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
      scrollProp = 'scrollLeft';
      last = this.outerElement.scrollLeft;
      current = last;
      this.startAnimating(scrollProp, end, last, current);
    }else {
      scrollProp = 'scrollTop';
      last = this.outerElement.scrollTop;
      current = last;
      this.startAnimating(scrollProp, end, last, current);
    }

  }else {

    if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
      this.outerElement.scrollLeft = scrollPosition;
    }else {
      this.outerElement.scrollTop = scrollPosition;
    }

  }
};


jomv3.fx.DefaultScrollBar.prototype.scrollBy = function(delta, animate) {
  goog.base(this, 'scrollBy', delta, animate);

  if(animate === true) {

    var scrollProp, end, last, current;

    if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
      scrollProp = 'scrollLeft';
      end = this.outerElement.scrollLeft + delta;
      last = this.outerElement.scrollLeft;
      current = this._animProps.last;
      this.startAnimating(scrollProp, end, last, current);
    }else {
      scrollProp = 'scrollTop';
      end = this.outerElement.scrollTop + delta;
      last = this.outerElement.scrollTop;
      current = this._animProps.last;
      this.startAnimating(scrollProp, end, last, current);
    }

  }else {

    if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
      this.outerElement.scrollLeft += delta;
      return this.outerElement.scrollLeft;
    }else {
      this.outerElement.scrollTop += delta;
      return this.outerElement.scrollTop;
    }

  }
};


jomv3.fx.DefaultScrollBar.prototype.onDrag = function(e) {
  goog.base(this, 'onDrag', e);

  var innerElementLength;
  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    innerElementLength = this._innerSize.width;
  }else {
    innerElementLength = this._innerSize.height;
  }

  var scrollPosition;
  if(this.isHorizontalLayout) {
    scrollPosition = innerElementLength * (e.left / this._sliderSize.width);
  }else {
    scrollPosition = innerElementLength * (e.top / this._sliderSize.height);
  }

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    this.outerElement.scrollLeft = scrollPosition;
  }else {
    this.outerElement.scrollTop = scrollPosition;
  }
};


jomv3.fx.DefaultScrollBar.prototype.onNativeScroll = function(e) {
  if(!this.isDragging() && !this.isAnimating()) {
    // dispatch passive scroll event
    this.dispatchEvent(jomv3.fx.DummyScrollBar.EventType.PASSIVE_SCROLL);
  }
};


jomv3.fx.DefaultScrollBar.prototype.onActiveScroll = function(e) {
  goog.base(this, 'onActiveScroll', e);

  this.setScrollPosition();
};


jomv3.fx.DefaultScrollBar.prototype.onPassiveScroll = function(e) {
  goog.base(this, 'onPassiveScroll', e);

  this.setScrollPosition();
};


jomv3.fx.DefaultScrollBar.prototype.onAnimationFrame = function(now) {
  var delta = (this._animProps.end - this.outerElement[this._animProps.scrollProp]) * this._animProps.ease;
  var scrollPosition = this.scrollBy(delta);

  if(Math.abs(scrollPosition - this._animProps.last) < 1) {
    this.stopAnimating();
  }

  this._animProps.last = scrollPosition;

  // dispatch active scroll event
  this.dispatchEvent(jomv3.fx.DummyScrollBar.EventType.ACTIVE_SCROLL);
};


jomv3.fx.DefaultScrollBar.prototype.onResize = function(e) {
  goog.base(this, 'onResize', e);

  if(this.isHorizontalLayout) {
    this._dragRect.width = this._scrollBarSize.width - this._handleSize.width;
  }else {
    this._dragRect.height = this._scrollBarSize.height - this._handleSize.height;
  }

  this.dragger.setLimits(this._dragRect);

  this.dispatchEvent(jomv3.fx.DummyScrollBar.EventType.ACTIVE_SCROLL);
};