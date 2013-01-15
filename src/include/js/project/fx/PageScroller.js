goog.provide('joeonmars.fx.PageScroller');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.Timer');

goog.require('joeonmars.events.ScrollEvent');

/**
 * @constructor
 */

joeonmars.fx.PageScroller = function(renderCallback, options) {
  goog.base(this);

  this.renderCallback_ = renderCallback;

  var options_ = options || {};
  var threshold_ = options_.threshold || 20;
  var direction_ = options_.direction || joeonmars.fx.PageScroller.Direction.HORIZONTAL;
  options_.threshold = threshold_;
  options_.direction = direction_;
  this.options_ = options_;

  this.isDown_ = false;
  this.scrollProps_ = {pos1: 0, pos2: 0, t1: 0, t2: 0, startPos: 0, endPos: 0, originPos: 0, threshold: this.options_.threshold};

  this.viewportSize_ = new goog.math.Size(0, 0);
  this.totalPageSize_ = new goog.math.Size(0, 0);

  this.dragHistory_ = [];

  this.isDown = false;
  this.isDragging = false;
  this.numPages = 0;
  this.direction = this.options_.direction;
  this.currentPosition = 0;
  this.pageId = 0;

  this.tween = new TweenMax(this, 1, {
    currentPosition: 0,
    'paused': true,
    'ease': Strong.easeOut,
    'onUpdate': function() {
      this.scrollProps_.originPos = this.currentPosition;
      this.renderCallback_( this.currentPosition );
    },
    'onUpdateScope': this,
    'onComplete': function() {
    },
    'onCompleteScope': this
  });
};
goog.inherits(joeonmars.fx.PageScroller, goog.events.EventTarget);


joeonmars.fx.PageScroller.prototype.getInputPos = function(e) {
	var inputPos;
	var ev = e.getBrowserEvent();

  if(this.direction === joeonmars.fx.PageScroller.Direction.HORIZONTAL) {
    inputPos = ev.touches ? ev.touches[0].pageX : e.clientX;
  }else {
    inputPos = ev.touches ? ev.touches[0].pageY : e.clientY;
  }

  return inputPos;
};


joeonmars.fx.PageScroller.prototype.getDragDirection_ = function(e) {
  var ev = e.getBrowserEvent();
  var inputPos = ev.touches ? [ev.touches[0].pageX, ev.touches[0].pageY] : [e.clientX, e.clientY];
  this.dragHistory_.push(inputPos);

  var result;

  if(this.dragHistory_.length >= 3) {
    var deltaX = Math.abs(inputPos[0] - this.dragHistory_[0][0]);
    var deltaY = Math.abs(inputPos[1] - this.dragHistory_[0][1]);
    goog.array.clear(this.dragHistory_);

    if(deltaX >= deltaY) return joeonmars.fx.PageScroller.Direction.HORIZONTAL;
    else return joeonmars.fx.PageScroller.Direction.VERTICAL;
  }

  return result;
};


joeonmars.fx.PageScroller.prototype.getPagePos_ = function(pageId) {
  var pagePos;
  if(this.direction === joeonmars.fx.PageScroller.Direction.HORIZONTAL) {
    pagePos = this.totalPageSize_.width / this.numPages * pageId;
  }else {
    pagePos = this.totalPageSize_.height / this.numPages * pageId;
  }
  return pagePos;
};


joeonmars.fx.PageScroller.prototype.setDimensions = function(viewportW, viewportH, totalPageW, totalPageH) {
  this.viewportSize_.width = viewportW;
  this.viewportSize_.height = viewportH;
  this.totalPageSize_.width = totalPageW;
  this.totalPageSize_.height = totalPageH;

  if(this.direction == joeonmars.fx.PageScroller.Direction.HORIZONTAL) {
    this.numPages = Math.floor(this.totalPageSize_.width / this.viewportSize_.width);
  }else {
    this.numPages = Math.floor(this.totalPageSize_.height / this.viewportSize_.height);
  }
};


joeonmars.fx.PageScroller.prototype.prevPage = function() {
  this.pageId --;
  if(this.pageId < 0) this.pageId = 0;

  var pagePos = this.getPagePos_(this.pageId);
  this.scrollTo(-pagePos);
};


joeonmars.fx.PageScroller.prototype.nextPage = function() {
  this.pageId ++;
  if(this.pageId > this.numPages - 1) this.pageId = this.numPages - 1;

  var pagePos = this.getPagePos_(this.pageId);
  this.scrollTo(-pagePos);
};


joeonmars.fx.PageScroller.prototype.scrollTo = function(position) {
  this.tween.invalidate();
  this.tween.updateTo({currentPosition: position}, true);
  this.tween.restart();
};


joeonmars.fx.PageScroller.prototype.onDown = function(e) {
  this.isDown = true;

  if(TweenMax.isTweening(this)) {
    TweenMax.killTweensOf(this);
  }

  var inputPos = this.getInputPos(e);

  this.scrollProps_.pos1 = this.scrollProps_.pos2 = inputPos;
  this.scrollProps_.t1 = this.scrollProps_.t2 = goog.now();

  this.scrollProps_.startPos = inputPos;
  this.scrollProps_.endPos = inputPos;

  this.currentPosition = this.scrollProps_.originPos;

  /*
  handle visual update
  */
  this.renderCallback_(this.currentPosition);

  e.preventDefault();
};


joeonmars.fx.PageScroller.prototype.onMove = function(e) {
  if(!this.isDown) return;

  // get dragging direction by calculating start and end drag delta differences
  if(!this.isDragging) {

    var dragDirection = this.getDragDirection_(e);

    if(dragDirection === joeonmars.fx.PageScroller.Direction.HORIZONTAL &&
      this.direction === joeonmars.fx.PageScroller.Direction.HORIZONTAL) {

      console.log(dragDirection, this.numPages);
      this.isDragging = true;

    }else if(dragDirection === joeonmars.fx.PageScroller.Direction.VERTICAL &&
      this.direction === joeonmars.fx.PageScroller.Direction.VERTICAL) {

      console.log(dragDirection, this.numPages);
      this.isDragging = true;

    }else {

      return;

    }

  }

  var inputPos = this.getInputPos(e);

  this.scrollProps_.pos2 = this.scrollProps_.pos1;
  this.scrollProps_.t2 = this.scrollProps_.t1;
  this.scrollProps_.t1 = goog.now();
  this.scrollProps_.pos1 = inputPos;
  this.scrollProps_.endPos = inputPos;

  var offsetPos = inputPos - this.scrollProps_.startPos;
 	this.currentPosition = this.scrollProps_.originPos + offsetPos;

 	/*
  handle visual update
  */
  this.renderCallback_(this.currentPosition);

  e.preventDefault();
};


joeonmars.fx.PageScroller.prototype.onUp = function(e) {
  this.isDown = false;
  this.isDragging = false;
  goog.array.clear(this.dragHistory_);

  var elapsedTime = (goog.now() - this.scrollProps_.t2) / 1000;
  var velocity = (this.scrollProps_.endPos - this.scrollProps_.pos2) / elapsedTime;
  var scrolledDistance = this.scrollProps_.endPos - this.scrollProps_.startPos;

  var viewportMid;
  if(this.direction === joeonmars.fx.PageScroller.Direction.HORIZONTAL) viewportMid = this.viewportSize_.width * .5;
  else viewportMid = this.viewportSize_.height * .5;

  if(velocity > this.scrollProps_.threshold || scrolledDistance > viewportMid) {

    // go backward (left or up)
    this.prevPage();

  }else if(velocity < -this.scrollProps_.threshold || scrolledDistance < - viewportMid) {

    // go forward (right or down)
    this.nextPage();

  }else {

    // go back to the current page
    var currentPagePos = this.getPagePos_(this.pageId);
    this.scrollTo(-currentPagePos);

  }

  e.preventDefault();
};


joeonmars.fx.PageScroller.Direction = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};