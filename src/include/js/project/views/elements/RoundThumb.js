goog.provide('joeonmars.views.elements.RoundThumb');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.elements.RoundThumb = function(radius, position, thumbClassName) {
  goog.base(this);

  this.thumbClassName = thumbClassName;

  this.tweenRadiusObj = {outerRad:0, innerRad:0, backgroundSize:0};
  this.toBackgroundPosition = new goog.math.Coordinate();
  this.backgroundPosition = new goog.math.Coordinate();

  this.radius = radius || joeonmars.views.elements.RoundThumb.Radius.LARGE;
  this.position = position || new goog.math.Coordinate();
  this.status = null;
  this.isExpanded = false;

  this.create();
};
goog.inherits(joeonmars.views.elements.RoundThumb, goog.events.EventTarget);


joeonmars.views.elements.RoundThumb.prototype.create = function() {
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

  // set default status
  this.setStatus(joeonmars.views.elements.RoundThumb.Status.DEFAULT, true);

  // set start position
  goog.style.setPosition(this.domElement, this.position);

  // add event listeners
  this.activate();
};


joeonmars.views.elements.RoundThumb.prototype.activate = function() {
  goog.events.listen(this.innerDom, 'mouseover', this.onOver, false, this);
  goog.events.listen(this.innerDom, 'mouseout', this.onOut, false, this);
  goog.events.listen(this.innerDom, 'mousemove', this.onMove, false, this);
  goog.events.listen(this.innerDom, 'click', this.onClick, false, this);
};


joeonmars.views.elements.RoundThumb.prototype.deactivate = function() {
  goog.events.unlisten(this.innerDom, 'mouseover', this.onOver, false, this);
  goog.events.unlisten(this.innerDom, 'mouseout', this.onOut, false, this);
  goog.events.unlisten(this.innerDom, 'mousemove', this.onMove, false, this);
  goog.events.unlisten(this.innerDom, 'click', this.onClick, false, this);
};


joeonmars.views.elements.RoundThumb.prototype.setStatus = function(status, isInstant) {
  if(this.status === status) return;
  else this.status = status;

  switch(this.status) {
    case joeonmars.views.elements.RoundThumb.Status.DEFAULT:
      var outerRad = this.radius;
      var innerRad = outerRad * (1 - joeonmars.views.elements.RoundThumb.BorderRatio.DEFAULT);
      var backgroundSize = innerRad * 2 * 1.5;
      this.tweenTo(outerRad, innerRad, backgroundSize, null, isInstant);

      this.isExpanded = false;
      goog.style.setStyle(this.innerDom, 'background-position', 'center center');

      // stop animation loop for background movement
      goog.fx.anim.unregisterAnimation(this);
      break;

    case joeonmars.views.elements.RoundThumb.Status.EXPANDED:
      var outerRad = this.radius + 20;
      var innerRad = outerRad * (1 - joeonmars.views.elements.RoundThumb.BorderRatio.EXPANDED);
      var backgroundSize = innerRad * 2;
      this.tweenTo(outerRad, innerRad, backgroundSize, this.onExpanded, isInstant);

      this.isExpanded = false;
      this.backgroundPosition.x = 0;
      this.backgroundPosition.y = 0;
      goog.style.setStyle(this.innerDom, 'background-position', 'center center');

      // start animation loop for background movement
      goog.fx.anim.registerAnimation(this);
      break;

    case joeonmars.views.elements.RoundThumb.Status.SHRINKED:
      this.tweenTo(this.radius * .5, 0, 0, null, isInstant);

      this.isExpanded = false;
      goog.style.setStyle(this.innerDom, 'background-position', 'center center');

      // stop animation loop for background movement
      goog.fx.anim.unregisterAnimation(this);
      break;
  }
};


joeonmars.views.elements.RoundThumb.prototype.tweenTo = function(toOuterRad, toInnerRad, toBackgroundSize, onCompleteFunc, isInstant) {
  TweenMax.killTweensOf(this.tweenRadiusObj);

  var duration = (isInstant === true) ? 0 : .6;

  TweenMax.to(this.tweenRadiusObj, duration, {
    outerRad: toOuterRad,
    innerRad: toInnerRad,
    backgroundSize: toBackgroundSize || this.tweenRadiusObj.backgroundSize,
    'ease': Strong.easeOut,
    'onUpdate': function() {
      var currentOuterRad = this.tweenRadiusObj.outerRad;
      var currentInnerRad = this.tweenRadiusObj.innerRad;

      var outerDia = currentOuterRad * 2;
      var innerDia = currentInnerRad * 2;
      var outerPos = - currentOuterRad;
      var innerPos = - currentInnerRad;

      goog.style.setStyle(this.outerDom, {'width': outerDia + 'px', 'height': outerDia + 'px',
        'left': outerPos + 'px', 'top': outerPos + 'px'});

      goog.style.setStyle(this.innerDom, {
        'width': innerDia + 'px', 'height': innerDia + 'px',
        'left': innerPos + 'px', 'top': innerPos + 'px',
        'background-size': this.tweenRadiusObj.backgroundSize + 'px'});
    },
    'onUpdateScope': this,
    'onComplete': onCompleteFunc,
    'onCompleteScope': this
  });
};


joeonmars.views.elements.RoundThumb.prototype.onAnimationFrame = function(now) {
  if(this.isExpanded) {
    if(goog.math.Coordinate.distance(this.backgroundPosition, this.toBackgroundPosition) > 1) {
      this.backgroundPosition.x += (this.toBackgroundPosition.x - this.backgroundPosition.x) * .2;
      this.backgroundPosition.y += (this.toBackgroundPosition.y - this.backgroundPosition.y) * .2;

      goog.style.setStyle(this.innerDom, 'background-position', this.backgroundPosition.x + 'px ' + this.backgroundPosition.y + 'px');
    }
  }
};


joeonmars.views.elements.RoundThumb.prototype.onExpanded = function() {
  this.isExpanded = true;
};


joeonmars.views.elements.RoundThumb.prototype.onOver = function(e) {
  this.setStatus(joeonmars.views.elements.RoundThumb.Status.EXPANDED);
};


joeonmars.views.elements.RoundThumb.prototype.onOut = function(e) {
  if(!goog.dom.contains(this.innerDom, e.relatedTarget)) {
    this.setStatus(joeonmars.views.elements.RoundThumb.Status.DEFAULT);
  }
};


joeonmars.views.elements.RoundThumb.prototype.onMove = function(e) {

  if(this.isExpanded) {
    var positionRelToScreen = goog.style.getPageOffset(this.domElement);
    var mouseX = e.clientX - positionRelToScreen.x;
    var mouseY = e.clientY - positionRelToScreen.y;
    
    //console.log(mouseX, mouseY);
    
    this.toBackgroundPosition.x = - mouseX * .2;
    this.toBackgroundPosition.y = - mouseY * .2;
  }
};


joeonmars.views.elements.RoundThumb.prototype.onClick = function(e) {

};


joeonmars.views.elements.RoundThumb.prototype.onResize = function(windowSize) {

};


joeonmars.views.elements.RoundThumb.BorderRatio = {
  DEFAULT: .03,
  EXPANDED: .01
};


joeonmars.views.elements.RoundThumb.Status = {
  DEFAULT: 'default',
  EXPANDED: 'expanded',
  SHRINKED: 'shrinked'
};


joeonmars.views.elements.RoundThumb.ClassName = {
  VIDEO: 'video',
  IMAGE: 'image',
  FLASH: 'flash'
};