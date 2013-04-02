/**
 * @fileoverview A singleton class managing all ScrollableElements,
 * this is automatically created by instantiating the first ScrollableElement by the user, 
 * thus should not be instantiated manually.
 *
 */
goog.provide('jomv3.fx.ScrollableElementManager');

goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.dom');
goog.require('goog.math');
goog.require('goog.userAgent');

/**
 * @constructor
 */
jomv3.fx.ScrollableElementManager = function() {
  this._scrollableElements = [];

  this._scrollPoints = [];

  this._isDown = false;

  goog.events.listen(document, jomv3.fx.ScrollableElementManager.EventType.DOWN, this.onDown, false, this);
};
goog.addSingletonGetter(jomv3.fx.ScrollableElementManager);


jomv3.fx.ScrollableElementManager.prototype.add = function(scrollableElement) {
  this._scrollableElements.push(scrollableElement);
  
  // sort the elements from innermost to outermost
  // this allows mousedown handler to begin checking from the innermost element
  // in accordance to the order of event bubbling
  this._scrollableElements.sort(function (a, b) {
  return goog.dom.contains(a.outerElement, b.outerElement) ? 1 :
         goog.dom.contains(b.outerElement, a.outerElement) ? -1 :
         0;
  });
};


jomv3.fx.ScrollableElementManager.prototype.remove = function(scrollableElement) {
  goog.array.remove(this._scrollableElements, scrollableElement);
};


jomv3.fx.ScrollableElementManager.prototype.has = function(scrollableElement) {
  return goog.array.contains(this._scrollableElements, scrollableElement);
};


jomv3.fx.ScrollableElementManager.prototype.onDown = function(e) {
  if(this._isDown) return false;
  else this._isDown = true;

  e.preventDefault();

  var ev = e.getBrowserEvent();
  this._scrollPoints.push( goog.userAgent.MOBILE ? [ev.touches[0].clientX, ev.touches[0].clientY] : [ev.clientX, ev.clientY] );

  goog.events.listen(document, jomv3.fx.ScrollableElementManager.EventType.MOVE, this.onMove, false, this);
  goog.events.listen(document, jomv3.fx.ScrollableElementManager.EventType.UP, this.onUp, false, this);
};


jomv3.fx.ScrollableElementManager.prototype.onMove = function(e) {
  var ev = e.getBrowserEvent();

  if(this._scrollPoints.length < 2) {
    this._scrollPoints.push( goog.userAgent.MOBILE ? [ev.touches[0].clientX, ev.touches[0].clientY] : [ev.clientX, ev.clientY] );
  }

  if(this._scrollPoints.length >= 2) {

    var isScrollingX, isScrollingY;

    // determine direction by the scrolled points
    var angle = goog.math.angle(this._scrollPoints[0][0], this._scrollPoints[0][1], this._scrollPoints[1][0], this._scrollPoints[1][1]);

    if((angle < 45 || angle > 315) || (angle > 135 && angle < 225)) {
      // scrolling x
      isScrollingX = true;
    }else {
      // scrolling y
      isScrollingY = true;
    }

    goog.array.some(this._scrollableElements, function(element,index) {
      var containedAttachedDom = goog.array.find(element.attachedDoms, function(dom) {
        return goog.dom.contains(dom, e.target);
      });

      if(containedAttachedDom) {
        return true;
      }

      if(goog.dom.contains(element.outerElement, e.target)) {
        if((element.isScrollXEnabled && isScrollingX === true) || (element.isScrollYEnabled && isScrollingY === true)) {
          element.onDown(e);
          e.stopPropagation();
          return true;
        }else {
          return false;
        }
      }else {
        return false;
      }
    }, this);

    // reset scroll points and remove onMove listeners to finish move
    this._scrollPoints = [];
    goog.events.unlisten(document, jomv3.fx.ScrollableElementManager.EventType.MOVE, this.onMove, false, this);
  }
};


jomv3.fx.ScrollableElementManager.prototype.onUp = function(e) {
  if(!this._isDown) return false;
  else this._isDown = false;

  this._scrollPoints = [];
  goog.events.unlisten(document, jomv3.fx.ScrollableElementManager.EventType.MOVE, this.onMove, false, this);
  goog.events.unlisten(document, jomv3.fx.ScrollableElementManager.EventType.UP, this.onUp, false, this);
};


jomv3.fx.ScrollableElementManager.EventType = {
  DOWN: (goog.userAgent.MOBILE ? 'touchstart' : 'mousedown'),
  MOVE: (goog.userAgent.MOBILE ? 'touchmove' : 'mousemove'),
  UP: (goog.userAgent.MOBILE ? ['touchend', 'touchcancel'] : 'mouseup')
};


/**
 * @fileoverview A scrollable element which is composed of an outer and inner element.
 * The scroll value is returned by ZyngaScroller, and can be animated through multiple implementions
 * determined by user. By default, it uses scrollLeft/scrollTop to scroll
 */
goog.provide('jomv3.fx.ScrollableElement');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.math');
goog.require('goog.userAgent');

/**
 * @constructor
 */
jomv3.fx.ScrollableElement = function(outerElement, innerElement, options, implementation) {
  goog.base(this);

  this._options = options || {
    'scrollingX': true,
    'scrollingY': true
  };

  this.isScrollXEnabled = this._options['scrollingX'];
  this.isScrollYEnabled = this._options['scrollingY'];

  this.outerElement = outerElement;
  this.innerElement = innerElement;
  this.scroller = null;

  this._implementation = implementation || jomv3.fx.ScrollableElement.Implementation.SCROLL;

  this.attachedDoms = [];

  this.create();
};
goog.inherits(jomv3.fx.ScrollableElement, goog.events.EventTarget);


jomv3.fx.ScrollableElement.prototype.create = function() {
	var renderFunc;
	switch(this._implementation) {
		case jomv3.fx.ScrollableElement.Implementation.POSITION:
		renderFunc = this.renderCSSPosition;
		break;

		case jomv3.fx.ScrollableElement.Implementation.TRANSLATE:
    case jomv3.fx.ScrollableElement.Implementation.TRANSLATE_3D:
		renderFunc = this.renderCSSTransform;
		break;

		case jomv3.fx.ScrollableElement.Implementation.SCROLL:
		renderFunc = this.renderScroll;
		break;
	}

	this.scroller = new Scroller(goog.bind(function(left, top) {
    // render scrolling position
    renderFunc.call(this, left, top);
    
    // dispatch a scroll event
    this.dispatchEvent(jomv3.fx.ScrollableElement.EventType.SCROLL);

    if(this.scroller.__isTracking || this.scroller.__isDecelerating !== false) {
      // if is dragging or decelerating after dragging, dispatch an active scroll event
      this.dispatchEvent(jomv3.fx.ScrollableElement.EventType.ACTIVE_SCROLL);
    }else {
      // otherwise dispatch a passive scroll event
      this.dispatchEvent(jomv3.fx.ScrollableElement.EventType.PASSIVE_SCROLL);
    }

  }, this), this._options);

	this.setSize(goog.style.getSize(this.outerElement), goog.style.getSize(this.innerElement));

	// register this instance to manager
  jomv3.fx.ScrollableElement.Manager.add(this);
};


jomv3.fx.ScrollableElement.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	// unregister this instance to manager
  jomv3.fx.ScrollableElement.Manager.remove(this);
};


jomv3.fx.ScrollableElement.prototype.setSize = function(outerSize, innerSize) {
	this.scroller.setDimensions(outerSize.width, outerSize.height, innerSize.width, innerSize.height);
};


jomv3.fx.ScrollableElement.prototype.scrollTo = function(x, y) {
  this.scroller.scrollTo(x, y, false);
};


/**
 *	An optional render function by CSS left/top position
 */
jomv3.fx.ScrollableElement.prototype.renderCSSPosition = function(left, top) {
	goog.style.setPosition(this.innerElement, -left, -top);
};


/**
 *	An optional render function by CSS transform
 */
jomv3.fx.ScrollableElement.prototype.renderCSSTransform = function(left, top) {
	if(this._implementation === jomv3.fx.ScrollableElement.Implementation.TRANSLATE_3D) {
		goog.style.setStyle(this.innerElement, 'transform', 'translate3d(' + -left + 'px, ' + -top + 'px, 0px)');
	}else {
		goog.style.setStyle(this.innerElement, 'transform', 'translate(' + -left + 'px, ' + -top + 'px)');
	}
};


/**
 *	An optional render function by scrollLeft/scrollTop
 */
jomv3.fx.ScrollableElement.prototype.renderScroll = function(left, top) {
  this.outerElement.scrollLeft = left;
  this.outerElement.scrollTop = top;
};


/**
 *	Down Handler
 */
jomv3.fx.ScrollableElement.prototype.onDown = function(e) {
	var ev = e.getBrowserEvent();
  var touches = goog.userAgent.MOBILE ? [ev.touches[0]] : [{'pageX': ev.clientX, 'pageY': ev.clientY}];

  this.scroller.doTouchStart(touches, ev.timeStamp);

  goog.events.listen(document, jomv3.fx.ScrollableElementManager.EventType.MOVE, this.onMove, false, this);
  goog.events.listen(document, jomv3.fx.ScrollableElementManager.EventType.UP, this.onUp, false, this);
};


/**
 *	Move Handler
 */
jomv3.fx.ScrollableElement.prototype.onMove = function(e) {
  var ev = e.getBrowserEvent();
  var touches = goog.userAgent.MOBILE ? [ev.touches[0]] : [{'pageX': ev.clientX, 'pageY': ev.clientY}];

  this.scroller.doTouchMove(touches, ev.timeStamp);
};


/**
 *	Up Handler
 */
jomv3.fx.ScrollableElement.prototype.onUp = function(e) {
  var ev = e.getBrowserEvent();

  if(goog.userAgent.MOBILE && ev.touches.length > 0) {
    return false;
  }

  this.scroller.doTouchEnd(ev.timeStamp);

  goog.events.unlisten(document, jomv3.fx.ScrollableElementManager.EventType.MOVE, this.onMove, false, this);
  goog.events.unlisten(document, jomv3.fx.ScrollableElementManager.EventType.UP, this.onUp, false, this);
};


jomv3.fx.ScrollableElement.Manager = jomv3.fx.ScrollableElementManager.getInstance();


jomv3.fx.ScrollableElement.EventType = {
  SCROLL: 'scroll',
  ACTIVE_SCROLL: 'active_scroll',
  PASSIVE_SCROLL: 'passive_scroll'
};


jomv3.fx.ScrollableElement.Implementation = {
	POSITION: 'position',
	TRANSLATE: 'translate',
  TRANSLATE_3D: 'translate_3d',
	SCROLL: 'scroll'
};