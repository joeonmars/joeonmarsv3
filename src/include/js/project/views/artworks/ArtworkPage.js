goog.provide('joeonmars.views.artworks.ArtworkPage');

goog.require('goog.events.EventTarget');
goog.require('joeonmars.events.ScrollEvent');

/**
 * @constructor
 */

joeonmars.views.artworks.ArtworkPage = function(component, parentDom) {
  goog.base(this);
  this.setParentEventTarget(component);

  this.domElement = goog.dom.createDom('div', 'artworkPage');
  goog.dom.appendChild(parentDom, this.domElement);

  this.contentDom = goog.dom.createDom('div', 'content');
  goog.dom.appendChild(this.domElement, this.contentDom);

  this.position = null;
};
goog.inherits(joeonmars.views.artworks.ArtworkPage, goog.events.EventTarget);


joeonmars.views.artworks.ArtworkPage.prototype.init = function() {

};


joeonmars.views.artworks.ArtworkPage.prototype.activate = function() {

};


joeonmars.views.artworks.ArtworkPage.prototype.deactivate = function() {

};


joeonmars.views.artworks.ArtworkPage.prototype.setCopy = function(xml) {

};


joeonmars.views.artworks.ArtworkPage.prototype.onScrolled = function(top) {
  if(top === this.position.y) {
    this.dispatchEvent(new joeonmars.events.ScrollEvent(joeonmars.events.ScrollEvent.EventType.SCROLL_IN));
  }
};


joeonmars.views.artworks.ArtworkPage.prototype.onResize = function(sectionSize) {
	goog.style.setStyle(this.domElement, 'height', sectionSize.height + 'px');

	var contentSize = goog.style.getSize(this.contentDom);
	goog.style.setStyle(this.contentDom, 'top', (sectionSize.height - contentSize.height)/2 + 'px');

  this.position = goog.style.getPosition(this.domElement);
};