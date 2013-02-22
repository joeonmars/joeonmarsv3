goog.provide('jomv3.views.elements.RoundThumb');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.fx');
goog.require('goog.style');

/**
 * @constructor
 */

jomv3.views.elements.RoundThumb = function(radius, position, thumbClassName) {
  goog.base(this);

  this.thumbClassName = thumbClassName;

  this.tweener = null;
  this.tweenObj = {outerRad:0, innerRad:0, backgroundSize:0, backgroundX:0, backgroundY:0};
  this.mouseOffsetFromOrigin = new goog.math.Coordinate();
  this.backgroundPosition = new goog.math.Coordinate();
  this.backgroundOrigin = new goog.math.Coordinate();

  this.defaultInnerRad = null;
  this.defaultOuterRad = null;
  this.shrinkedInnerRad = null;
  this.shrinkedOuterRad = null;
  this.expandedInnerRad = null;
  this.expandedOuterRad = null;
  this.radius = radius || 200;
  this.setSize(this.radius);

  this.position = position || new goog.math.Coordinate();
  this.status = null;
  this.isExpanded = false;

  this.backgroundImg = null;
  this.backgroundImgSize = null;

  this.create();
};
goog.inherits(jomv3.views.elements.RoundThumb, goog.events.EventTarget);


jomv3.views.elements.RoundThumb.prototype.create = function() {
  // create thumbnail dom structure
  this.domElement = goog.dom.createDom('a', 'roundThumb', [
    this.outerDom = goog.dom.createDom('div', 'outer'),
    this.innerDom = goog.dom.createDom('div', 'inner', [
      this.innerOverlay = goog.dom.createDom('div', 'innerOverlay', [
          this.symbolDom = goog.dom.createDom('div', 'symbol')
        ])
      ])
    ]);

  goog.dom.classes.add(this.domElement, this.thumbClassName);

  // create and preload background image
  this.backgroundImg = new Image();
  this.backgroundImg.src = 'http://cias.rit.edu/~yxz7699/pics/20092010/trilogy_1.jpg';
  this.backgroundImg.onload = goog.bind(function() {
    goog.style.setStyle(this.innerDom, 'background-image', 'url(' + this.backgroundImg.src + ')');
    this.backgroundImgSize = new goog.math.Size(this.backgroundImg.width, this.backgroundImg.height);
    this.setStatus(jomv3.views.elements.RoundThumb.Status.DEFAULT);
  }, this);

  // set default status
  this.setStatus(jomv3.views.elements.RoundThumb.Status.SHRINKED, true);

  // set start position
  goog.style.setPosition(this.domElement, this.position);

  // add event listeners
  this.activate();
};


jomv3.views.elements.RoundThumb.prototype.activate = function() {
  goog.events.listen(this.domElement, 'mouseover', this.onOver, false, this);
  goog.events.listen(this.domElement, 'mouseout', this.onOut, false, this);
  goog.events.listen(this.domElement, 'mousemove', this.onMove, false, this);
  goog.events.listen(this.domElement, 'click', this.onClick, false, this);
};


jomv3.views.elements.RoundThumb.prototype.deactivate = function() {
  goog.events.unlisten(this.domElement, 'mouseover', this.onOver, false, this);
  goog.events.unlisten(this.domElement, 'mouseout', this.onOut, false, this);
  goog.events.unlisten(this.domElement, 'mousemove', this.onMove, false, this);
  goog.events.unlisten(this.domElement, 'click', this.onClick, false, this);
};


jomv3.views.elements.RoundThumb.prototype.setSize = function(radius) {
  this.radius = Math.round(radius);

  // default size
  this.defaultOuterRad = this.radius;
  this.defaultInnerRad = this.defaultOuterRad - 6;
  if(this.defaultOuterRad % 2 !== this.defaultInnerRad % 2) {
    this.defaultInnerRad -= 1;
  }

  // shrinked size
  this.shrinkedOuterRad = this.radius * .5;
  this.shrinkedInnerRad = 0;

  // expanded size
  this.expandedOuterRad = this.radius + 20;
  this.expandedInnerRad = this.expandedOuterRad - 2;
  if(this.expandedOuterRad % 2 !== this.expandedInnerRad % 2) {
    this.expandedInnerRad -= 1;
  }
};


jomv3.views.elements.RoundThumb.prototype.setStatus = function(status, isInstant) {
  if(this.status === status) return;
  else this.status = status;

  switch(this.status) {
    case jomv3.views.elements.RoundThumb.Status.DEFAULT:
      var outerRad = this.defaultOuterRad;
      var innerRad = this.defaultInnerRad;
      var backgroundSize = innerRad * 2 * 1.5;
      var backgroundX = - (backgroundSize - innerRad * 2) * .5;
      var backgroundY = - (backgroundSize / this.backgroundImgSize.aspectRatio() - innerRad * 2) * .5;

      this.isExpanded = false;

      this.tweenTo(outerRad, innerRad, backgroundSize, backgroundX, backgroundY, null, isInstant);

      // stop animation loop for background movement
      goog.fx.anim.unregisterAnimation(this);
      break;

    case jomv3.views.elements.RoundThumb.Status.EXPANDED:
      var outerRad = this.expandedOuterRad;
      var innerRad = this.expandedInnerRad;
      var backgroundSize = innerRad * 2;

      this.backgroundOrigin.x = - (backgroundSize - outerRad * 2) * .5;
      this.backgroundOrigin.y = - (backgroundSize / this.backgroundImgSize.aspectRatio() - outerRad * 2) * .5;

      var backgroundX = this.backgroundOrigin.x - this.mouseOffsetFromOrigin.x;
      var backgroundY = this.backgroundOrigin.y - this.mouseOffsetFromOrigin.y;

      this.isExpanded = false;

      this.tweenTo(outerRad, innerRad, backgroundSize, backgroundX, backgroundY, this.onExpanded, isInstant);
      break;

    case jomv3.views.elements.RoundThumb.Status.SHRINKED:
      var outerRad = this.shrinkedOuterRad;
      var innerRad = this.shrinkedInnerRad;

      this.isExpanded = false;

      this.tweenTo(outerRad, innerRad, 0, 0, 0, null, isInstant);

      // stop animation loop for background movement
      goog.fx.anim.unregisterAnimation(this);
      break;
  }
};


jomv3.views.elements.RoundThumb.prototype.tweenTo = function(toOuterRad, toInnerRad, toBackgroundSize, toBackgroundX, toBackgroundY, onCompleteFunc, isInstant) {
  TweenMax.killTweensOf(this.tweenObj);

  var duration = (isInstant === true) ? 0 : .5;

  this.tweener = TweenMax.to(this.tweenObj, duration, {
    outerRad: toOuterRad,
    innerRad: toInnerRad,
    backgroundSize: toBackgroundSize || this.tweenObj.backgroundSize,
    backgroundX: toBackgroundX,
    backgroundY: toBackgroundY,
    'ease': Strong.easeOut,
    'onUpdate': function() {
      var currentOuterRad = this.tweenObj.outerRad;
      var currentInnerRad = this.tweenObj.innerRad;

      var outerDia = currentOuterRad * 2;
      var innerDia = currentInnerRad * 2;
      var outerPos = - currentOuterRad;
      var innerPos = - currentInnerRad;

      goog.style.setStyle(this.outerDom, {'width': outerDia + 'px', 'height': outerDia + 'px',
        'left': outerPos + 'px', 'top': outerPos + 'px'});

      this.backgroundPosition.x = this.tweenObj.backgroundX;
      this.backgroundPosition.y = this.tweenObj.backgroundY;

      goog.style.setStyle(this.innerDom, {
        'width': innerDia + 'px', 'height': innerDia + 'px',
        'left': innerPos + 'px', 'top': innerPos + 'px',
        'background-size': this.tweenObj.backgroundSize + 'px',
        'background-position': this.backgroundPosition.x + 'px ' + this.backgroundPosition.y + 'px'});
    },
    'onUpdateScope': this,
    'onComplete': onCompleteFunc,
    'onCompleteScope': this
  });
};


jomv3.views.elements.RoundThumb.prototype.updateBackgroundOffset = function() {
  this.backgroundPosition.x += (this.backgroundOrigin.x - this.mouseOffsetFromOrigin.x - this.backgroundPosition.x) * .05;
  this.backgroundPosition.y += (this.backgroundOrigin.y - this.mouseOffsetFromOrigin.y - this.backgroundPosition.y) * .05;

  this.tweenObj.backgroundX = this.backgroundPosition.x;
  this.tweenObj.backgroundY = this.backgroundPosition.y;
};


jomv3.views.elements.RoundThumb.prototype.onAnimationFrame = function(now) {
  this.updateBackgroundOffset();
  goog.style.setStyle(this.innerDom, 'background-position', this.backgroundPosition.x + 'px ' + this.backgroundPosition.y + 'px');
};


jomv3.views.elements.RoundThumb.prototype.onExpanded = function() {
  this.isExpanded = true;

  // start animation loop for background movement
  goog.fx.anim.registerAnimation(this);
};


jomv3.views.elements.RoundThumb.prototype.onOver = function(e) {
  this.setStatus(jomv3.views.elements.RoundThumb.Status.EXPANDED);
};


jomv3.views.elements.RoundThumb.prototype.onOut = function(e) {
  if(!e.relatedTarget || !goog.dom.contains(this.innerDom, e.relatedTarget)) {
    this.setStatus(jomv3.views.elements.RoundThumb.Status.DEFAULT);
  }
};


jomv3.views.elements.RoundThumb.prototype.onMove = function(e) {
  var positionRelToScreen = goog.style.getPageOffset(this.domElement);
  var mouseX = e.clientX - positionRelToScreen.x;
  var mouseY = e.clientY - positionRelToScreen.y;
  
  //console.log(mouseX, mouseY);
  
  this.mouseOffsetFromOrigin.x = mouseX * .2;
  this.mouseOffsetFromOrigin.y = mouseY * .2;

  if(TweenMax.isTweening(this.tweenObj)) {
    this.tweener.updateTo({backgroundX: this.backgroundOrigin.x - this.mouseOffsetFromOrigin.x, backgroundY: this.backgroundOrigin.y - this.mouseOffsetFromOrigin.y});
  }
};


jomv3.views.elements.RoundThumb.prototype.onClick = function(e) {

};


jomv3.views.elements.RoundThumb.prototype.onResize = function(windowSize) {

};


jomv3.views.elements.RoundThumb.Status = {
  DEFAULT: 'default',
  EXPANDED: 'expanded',
  SHRINKED: 'shrinked'
};


jomv3.views.elements.RoundThumb.ClassName = {
  VIDEO: 'video',
  IMAGE: 'image',
  FLASH: 'flash'
};