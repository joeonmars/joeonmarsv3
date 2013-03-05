goog.provide('joeonmars.views.artworks.ArtworkIntro');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.string');
goog.require('goog.style');

/**
 * @constructor
 */

joeonmars.views.artworks.ArtworkIntro = function(component, parentDom, asset, artworkId) {
  goog.base(this, component, parentDom);

  this.pageId = 'intro';
	this.artworkId = artworkId;
  this.asset = asset;

  goog.dom.append(this.contentDom, [
    this.titleDom = goog.dom.createDom('h3'),
    this.categoryDom = goog.dom.createDom('p', 'category'),
    this.mediaDom = goog.dom.createDom('div', 'mediaWrapper'),
    this.dateDom = goog.dom.createDom('p', 'date'),
    this.orgDom = goog.dom.createDom('p', 'organization'),
    this.toolsDom = goog.dom.createDom('p', 'tools'),
    this.descDom = goog.dom.createDom('p', 'description')
  ]);

  goog.dom.classes.add(this.domElement, 'intro');
};
goog.inherits(joeonmars.views.artworks.ArtworkIntro, joeonmars.views.artworks.ArtworkPage);


joeonmars.views.artworks.ArtworkIntro.prototype.setCopy = function() {
  var xml = 'graphic-design.xml';
	this.titleDom.innerHTML = joeonmars.getText(this.artworkId+'.title', xml);
  this.categoryDom.innerHTML = joeonmars.getText(this.artworkId+'.category', xml);
	this.dateDom.innerHTML = joeonmars.getText(this.artworkId+'.date', xml);
  this.orgDom.innerHTML = joeonmars.getText(this.artworkId+'.organization', xml);
	this.toolsDom.innerHTML = joeonmars.getText(this.artworkId+'.tools', xml);
	this.descDom.innerHTML = joeonmars.getText(this.artworkId+'.description', xml);
};