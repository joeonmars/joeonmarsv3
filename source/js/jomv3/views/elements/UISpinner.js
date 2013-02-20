goog.provide('jomv3.views.elements.UISpinner');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.style');

/**
 * @constructor
 */

jomv3.views.elements.UISpinner = function(radius, color, progress) {
  goog.base(this);

  this.radius = radius || 100;
  this.diameter = this.radius * 2;
  this.progress = progress || 0;

  // construct html dom elements
  this.domElement = goog.dom.createDom('div', 'roundLoader');

  // svg namespace
  var svgNS = "http://www.w3.org/2000/svg"; 

  this.svg = document.createElementNS(svgNS, 'svg');
  this.loader = document.createElementNS(svgNS, 'path');

  goog.dom.appendChild(this.svg, this.loader);
  goog.dom.appendChild(this.domElement, this.svg);

  this.setSize(this.radius);
  this.setColor(color || '#0088cc');
  this.setProgress(this.progress);
};
goog.inherits(jomv3.views.elements.UISpinner, goog.events.EventTarget);


jomv3.views.elements.UISpinner.prototype.setColor = function(color) {
  this.color = color;
  goog.style.setStyle(this.loader, 'fill', color);
};


jomv3.views.elements.UISpinner.prototype.setProgress = function(prog) {
  this.progress = prog;
  this.draw();
};


jomv3.views.elements.UISpinner.prototype.setSize = function(radius) {
  this.radius = radius;
  this.diameter = this.radius * 2;

  goog.style.setSize(this.domElement, this.diameter, this.diameter);
  
  this.svg.setAttribute('width', this.diameter);
  this.svg.setAttribute('height', this.diameter);
  this.svg.setAttribute('viewbox', '0 0 ' + this.diameter + ' ' + this.diameter);

  this.loader.setAttribute('transform', 'translate('+this.radius+','+this.radius+')');

  this.draw();
};


jomv3.views.elements.UISpinner.prototype.draw = function() {
  var a = this.progress * 360;
  var r = ( a * Math.PI / 180 ),
      x = Math.sin( r ) * this.radius,
      y = Math.cos( r ) * - this.radius,
      mid = ( a > 180 ) ? 1 : 0,
      anim = 'M 0 0 v -' + this.radius + ' A ' + this.radius + ' ' + this.radius + ' 1 ' 
             + mid + ' 1 ' 
             +  x  + ' ' 
             +  y  + ' z';

  x = Math.round( x * 1000 ) / 1000;
  y = Math.round( y * 1000 ) / 1000;
  this.loader.setAttribute('d', anim);
};