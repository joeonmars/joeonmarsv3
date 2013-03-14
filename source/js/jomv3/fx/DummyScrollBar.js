goog.provide('jomv3.fx.DummyScrollBar');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Size');
goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('goog.style.bidi');

/**
 * @constructor
 * @param options = {
      sliderWidth: number|string,
      sliderHeight: number|string,
      outerLength: number,
      innerLength: number,
      layout: string
    }
 */
jomv3.fx.DummyScrollBar = function(outerContent, innerContent, direction, options) {
  goog.base(this);

  var options = options || {};

  this.outerContent = outerContent;
  this.innerContent = innerContent;

  this.direction = direction;

  // set layout position, and optionally fallback
  // to default layout position:
  // right for vertical direction, bottom for horizontal direction
  this.layout = options.layout || ((this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) ? jomv3.fx.DummyScrollBar.Layout.BOTTOM : jomv3.fx.DummyScrollBar.Layout.RIGHT);

  this.isHorizontalLayout = (this.layout === jomv3.fx.DummyScrollBar.Layout.TOP || this.layout === jomv3.fx.DummyScrollBar.Layout.BOTTOM);
  this.isVerticalLayout = (this.layout === jomv3.fx.DummyScrollBar.Layout.LEFT || this.layout === jomv3.fx.DummyScrollBar.Layout.RIGHT);

  var cssTop = (this.layout !== jomv3.fx.DummyScrollBar.Layout.BOTTOM) ? '0' : 'auto';
  var cssBottom = (this.layout === jomv3.fx.DummyScrollBar.Layout.BOTTOM) ? '0' : 'auto';
  var cssLeft = (this.layout === jomv3.fx.DummyScrollBar.Layout.LEFT) ? '0' : 'auto';
  var cssRight = (this.layout === jomv3.fx.DummyScrollBar.Layout.RIGHT) ? '0' : 'auto';

  // construct dom
  this.domElement = goog.dom.createDom('div', 'scrollBar', [
    this.slider = goog.dom.createDom('div', 'slider'),
    this.handle = goog.dom.createDom('div', 'handle')
    ]);

  // parse width from options
  var scrollBarW;
  if(goog.isNumber(options.sliderWidth)) {
    scrollBarW = options.sliderWidth + 'px';
  }else {
    scrollBarW = options.sliderWidth || (this.isHorizontalLayout ? '100%' : 'auto');
  }

  // parse height from options
  var scrollBarH;
  if(goog.isNumber(options.sliderHeight)) {
    scrollBarH = options.sliderHeight + 'px';
  }else {
    scrollBarH = options.sliderHeight || (this.isVerticalLayout ? '100%' : 'auto');
  }

  // stretch handle's width or height to fit slider, based on direction
  var handleW = this.isHorizontalLayout ? 'auto' : '100%';
  var handleH = this.isVerticalLayout ? 'auto' : '100%';

  // stylize dom
  goog.style.setStyle(this.domElement, {
    'position': 'absolute',
    'width': scrollBarW,
    'height': scrollBarH,
    'left': cssLeft,
    'top': cssTop,
    'bottom': cssBottom,
    'right': cssRight,
    'outline': '1px solid lightgray'
  });

  goog.style.setStyle(this.slider, {
    'position': 'absolute',
    'width': '100%',
    'height': '100%'
  });

  goog.style.setStyle(this.handle, {
    'position': 'absolute',
    'width': handleW,
    'height': handleH,
    'outline': '1px solid red'
  });

  goog.style.setStyle(this.outerContent, 'overflow', 'hidden');

  // set initial dimensions
  var outerLength = options.outerLength || ((this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) ? goog.style.getSize(this.outerContent).width : goog.style.getSize(this.outerContent).height);
  var innerLength = options.innerLength || ((this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) ? goog.style.getSize(this.innerContent).width : goog.style.getSize(this.innerContent).height)
  this.setDimensions(outerLength, innerLength);

  goog.dom.appendChild(this.outerContent, this.domElement);

  var scrollBarSize = goog.style.getSize(this.domElement);
  var handleSize = goog.style.getSize(this.handle);

  var limits = (this.isHorizontalLayout ? new goog.math.Rect(0, 0, scrollBarSize.width - handleSize.width, 0) : new goog.math.Rect(0, 0, 0, scrollBarSize.height - handleSize.height));
  this.dragger = new goog.fx.Dragger(this.handle, null, limits);

  // add event listener
  goog.events.listen(this.outerContent, goog.events.EventType.SCROLL, this.onScroll, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);
  //goog.events.listen(this.slider, jomv3.fx.DummyScrollBar.EventType.DOWN, this.onDown, false, this);
};
goog.inherits(jomv3.fx.DummyScrollBar, goog.events.EventTarget);


jomv3.fx.DummyScrollBar.prototype.dispose = function() {
  goog.base(this, 'dispose');
};


jomv3.fx.DummyScrollBar.prototype.setDimensions = function(outerLength, innerLength) {
  var handleLength = outerLength / innerLength * 100 + '%';

  if(this.layout === jomv3.fx.DummyScrollBar.Layout.TOP || this.layout === jomv3.fx.DummyScrollBar.Layout.BOTTOM) {
    // reset horizontal dimension
    goog.style.setStyle(this.handle, 'width', handleLength);
  }else {
    // reset vertical dimension
    goog.style.setStyle(this.handle, 'height', handleLength);
  }
};


jomv3.fx.DummyScrollBar.prototype.onDrag = function(e) {//console.log(e.currentTarget.deltaX, this.dragger.startX)
  var sliderSize = goog.style.getSize(this.slider);
  var handleSize = goog.style.getSize(this.handle);
  var innerContentSize = goog.style.getSize(this.innerContent);

  var innerContentLength;
  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    innerContentLength = innerContentSize.width;
  }else {
    innerContentLength = innerContentSize.height;
  }

  var scrollPosition;
  if(this.isHorizontalLayout) {
    scrollPosition = innerContentLength * (e.currentTarget.deltaX / sliderSize.width);
  }else {
    scrollPosition = innerContentLength * (e.currentTarget.deltaY / sliderSize.height);
  }

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    this.outerContent.scrollLeft = scrollPosition;
  }else {
    this.outerContent.scrollTop = scrollPosition;
  }
};


jomv3.fx.DummyScrollBar.prototype.onScroll = function(e) {
  //console.log(e);
  if(this.dragger.isDragging()) return;

  var sliderSize = goog.style.getSize(this.slider);
  var handleSize = goog.style.getSize(this.handle);
  var innerContentSize = goog.style.getSize(this.innerContent);

  var innerContentLength;
  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    innerContentLength = innerContentSize.width;
  }else {
    innerContentLength = innerContentSize.height;
  }

  var scrollPosition;
  var handlePosition;

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    scrollPosition = this.outerContent.scrollLeft;
    handlePosition = sliderSize.width * (scrollPosition / innerContentLength);
  }else {
    scrollPosition = this.outerContent.scrollTop;
  }

  if(this.direction === jomv3.fx.DummyScrollBar.Direction.HORIZONTAL) {
    goog.style.setPosition(this.handle, handlePosition, 0);
  }else {
    goog.style.setPosition(this.handle, 0, handlePosition);
  }
};


jomv3.fx.DummyScrollBar.Direction = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};


jomv3.fx.DummyScrollBar.Layout = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};