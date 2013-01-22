goog.provide('joeonmars.views.elements.RoundThumb');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.elements.RoundThumb = function(radius, position) {
  goog.base(this);

  this.tweenRadiusObj = {outerRad:0, innerRad:0, backgroundSize:0};

  // set thumbnail's default size
  this.radius = radius || joeonmars.views.elements.RoundThumb.Radius.LARGE;
  this.position = position || new goog.math.Coordinate();

  this.create();
};
goog.inherits(joeonmars.views.elements.RoundThumb, goog.events.EventTarget);


joeonmars.views.elements.RoundThumb.prototype.create = function() {
  // create thumbnail dom structure
  this.domElement = goog.dom.createDom('a', 'roundThumb', [
    this.outerDom = goog.dom.createDom('div', 'outer'),
    this.innerDom = goog.dom.createDom('div', 'inner')
    ]);

  // set default status
  this.setStatus(joeonmars.views.elements.RoundThumb.Status.DEFAULT, true);

  // set start position
  goog.style.setPosition(this.domElement, this.position);

  // add event listeners
  this.activate();
};


joeonmars.views.elements.RoundThumb.prototype.activate = function() {
  goog.events.listen(this.domElement, 'mouseover', this.onOver, false, this);
  goog.events.listen(this.domElement, 'mouseout', this.onOut, false, this);
  goog.events.listen(this.domElement, 'click', this.onClick, false, this);
};


joeonmars.views.elements.RoundThumb.prototype.deactivate = function() {
  goog.events.unlisten(this.domElement, 'mouseover', this.onOver, false, this);
  goog.events.unlisten(this.domElement, 'mouseout', this.onOut, false, this);
  goog.events.unlisten(this.domElement, 'click', this.onClick, false, this);
};


joeonmars.views.elements.RoundThumb.prototype.setStatus = function(status, isInstant) {
  switch(status) {
    case joeonmars.views.elements.RoundThumb.Status.DEFAULT:
      this.tweenTo(this.radius, this.radius * (1 - joeonmars.views.elements.RoundThumb.BorderRatio.DEFAULT), 100, isInstant);
      break;

    case joeonmars.views.elements.RoundThumb.Status.EXPANDED:
      this.tweenTo(this.radius + 20, (this.radius + 20) * (1 - joeonmars.views.elements.RoundThumb.BorderRatio.EXPANDED), 80);
      break;

    case joeonmars.views.elements.RoundThumb.Status.SHRINKED:
      this.tweenTo(this.radius * .5, 0);
      break;
  }
};


joeonmars.views.elements.RoundThumb.prototype.tweenTo = function(toOuterRad, toInnerRad, backgroundSize, isInstant) {
  TweenMax.killTweensOf(this.tweenRadiusObj);

  var duration = (isInstant === true) ? 0 : .8;

  TweenMax.to(this.tweenRadiusObj, duration, {
    outerRad: toOuterRad,
    innerRad: toInnerRad,
    backgroundSize: backgroundSize || this.tweenRadiusObj.backgroundSize,
    'ease': Strong.easeOut,
    'onUpdate': function() {
      var currentOuterRad = this.tweenRadiusObj.outerRad;
      var currentInnerRad = this.tweenRadiusObj.innerRad;

      var outerDia = currentOuterRad * 2;
      var innerDia = currentInnerRad * 2;
      var outerPos = - currentOuterRad;
      var innerPos = - currentInnerRad;

      goog.style.setStyle(this.outerDom, {'width': outerDia + 'px', 'height': outerDia + 'px', 'left': outerPos + 'px', 'top': outerPos + 'px'});
      goog.style.setStyle(this.innerDom, {'width': innerDia + 'px', 'height': innerDia + 'px', 'left': innerPos + 'px', 'top': innerPos + 'px', 'background-size': this.tweenRadiusObj.backgroundSize + '%'});
    },
    'onUpdateScope': this
  });
};


joeonmars.views.elements.RoundThumb.prototype.onOver = function(e) {
  this.setStatus(joeonmars.views.elements.RoundThumb.Status.EXPANDED);
};


joeonmars.views.elements.RoundThumb.prototype.onOut = function(e) {
  this.setStatus(joeonmars.views.elements.RoundThumb.Status.DEFAULT);
};


joeonmars.views.elements.RoundThumb.prototype.onClick = function(e) {

};


joeonmars.views.elements.RoundThumb.prototype.onResize = function(windowSize) {

};


joeonmars.views.elements.RoundThumb.BorderRatio = {
  DEFAULT: .06,
  EXPANDED: .02
};


joeonmars.views.elements.RoundThumb.Status = {
  DEFAULT: 'default',
  EXPANDED: 'expanded',
  SHRINKED: 'shrinked'
};