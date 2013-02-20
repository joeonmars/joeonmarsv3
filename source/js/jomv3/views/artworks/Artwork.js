goog.provide('joeonmars.views.artworks.Artwork');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.string');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.artworks.Artwork = function(component, parentDom, asset, artworkId, pageId) {
  goog.base(this, component, parentDom);

	this.asset = asset;
	this.artworkId = artworkId;
  this.pageId = pageId;

  this.titleDom = goog.dom.createDom('h3');
  this.mediaDom = goog.dom.createDom('div', 'mediaWrapper');
  this.descDom = goog.dom.createDom('p', 'description');

  goog.dom.appendChild(this.contentDom, this.titleDom);
  goog.dom.appendChild(this.contentDom, this.mediaDom);
  goog.dom.appendChild(this.contentDom, this.descDom);

  goog.dom.classes.add(this.domElement, 'artwork');

  // debug
  goog.style.setStyle(this.domElement, 'background-color', joeonmars.utils.getRandomCssColor());
};
goog.inherits(joeonmars.views.artworks.Artwork, joeonmars.views.artworks.ArtworkPage);


joeonmars.views.artworks.Artwork.prototype.setCopy = function(xml) {
	this.titleDom.innerHTML = joeonmars.getText(this.artworkId + '.' + this.pageId+'.title', xml);
	this.descDom.innerHTML = joeonmars.getText(this.artworkId + '.' + this.pageId+'.description', xml);
};