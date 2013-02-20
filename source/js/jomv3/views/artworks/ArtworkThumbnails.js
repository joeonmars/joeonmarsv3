goog.provide('joeonmars.views.artworks.ArtworkThumbnails');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.math.Size');

/**
 * @constructor
 */

joeonmars.views.artworks.ArtworkThumbnails = function(artworkData, artworkId, sectionId) {
	this.artworkData = artworkData;
  this.artworkId = artworkId;
  this.sectionId = sectionId;

  this.domElement = goog.dom.createDom('ul', 'artworkThumbnails');

  this.thumbnails = [];
};


joeonmars.views.artworks.ArtworkThumbnails.prototype.init = function() {
  // populate artworks from data
  goog.object.forEach(this.artworkData, function(asset, pageId) {
    var hashLink = '#' + this.sectionId + '/' + this.artworkId + '/' + pageId;
    var imgSrc = joeonmars.ASSETS_URL + 'images/thumbnails/' + this.artworkId + '/' + pageId + '.jpg';
    var thumb = new joeonmars.views.artworks.ArtworkThumbnail(imgSrc, hashLink, this.domElement);
    this.thumbnails.push(thumb);
  }, this);
};


joeonmars.views.artworks.ArtworkThumbnails.prototype.activate = function() {

};


joeonmars.views.artworks.ArtworkThumbnails.prototype.deactivate = function() {

};


joeonmars.views.artworks.ArtworkThumbnails.prototype.onResize = function(sectionSize) {
	var size = goog.style.getSize(this.domElement);
	var thumbSize = joeonmars.views.artworks.ArtworkThumbnail.MIN_SIZE;
	goog.array.forEach(this.thumbnails, function(thumb) {
		thumb.setSize(thumbSize);
	});
};




/**
 * @constructor
 */

joeonmars.views.artworks.ArtworkThumbnail = function(imgSrc, hashLink, parentDom) {
  this.liDom = goog.dom.createDom('li', 'artworkThumbnail', [
    this.linkDom = goog.dom.createDom('a', null, [
      this.img = goog.dom.createDom('img', {'src': imgSrc})
    ])
  ]);

  this.linkDom.href = hashLink;

  goog.dom.appendChild(parentDom, this.liDom);
};


joeonmars.views.artworks.ArtworkThumbnail.prototype.setSize = function(size) {
	this.img.width = size.width;
	this.img.height = size.height;
};


joeonmars.views.artworks.ArtworkThumbnail.MIN_SIZE = new goog.math.Size(40, 60);