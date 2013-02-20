goog.provide('joeonmars.views.sections.DetailSection');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('joeonmars.events.SectionEvent');
goog.require('joeonmars.views.artworks.ArtworkComponent');

/**
 * @constructor
 */

joeonmars.views.sections.DetailSection = function(sectionId, className, container) {
  goog.base(this, sectionId, className, container);

  this.parentSectionId = this.sectionId.replace('-detail', '');

  this.leftDom = goog.dom.createDom('div', 'left');
  this.rightDom = goog.dom.createDom('div', 'right');
  goog.dom.appendChild(this.contentDom, this.leftDom);
  goog.dom.appendChild(this.contentDom, this.rightDom);

  // components created by unique artwork IDs
  this.artworkComponents = {};
  this.currentArtworkComponent = null;

  this.currentSectionSize = null;
};
goog.inherits(joeonmars.views.sections.DetailSection, joeonmars.views.sections.Section);


joeonmars.views.sections.DetailSection.prototype.init = function() {
	goog.base(this, 'init');

	// get artwork ids from data
	var artworksData = joeonmars.main.getAsset('asset-settings.json')['sections'][this.parentSectionId];

	goog.object.forEach(artworksData, function(artworkData, artworkId) {
		var artworkComponent = new joeonmars.views.artworks.ArtworkComponent(artworkData, artworkId, this);
		artworkComponent.init();
		this.artworkComponents[artworkId] = artworkComponent;
	}, this);

	this.currentArtworkComponent = this.artworkComponents['designwork1'];
	this.currentArtworkComponent.show();
};


joeonmars.views.sections.DetailSection.prototype.activate = function() {
	if(this.isActivated) return;
	else this.isActivated = true;

	goog.base(this, 'activate');

	if(this.currentArtworkComponent) this.currentArtworkComponent.activate();
};


joeonmars.views.sections.DetailSection.prototype.deactivate = function() {
	if(!this.isActivated) return;
	else this.isActivated = false;

	goog.base(this, 'deactivate');

	if(this.currentArtworkComponent) this.currentArtworkComponent.deactivate();
};


joeonmars.views.sections.DetailSection.prototype.setCopy = function() {
	goog.base(this, 'setCopy');

	goog.object.forEach(this.artworkComponents, function(artworkComponent) {
		artworkComponent.setCopy();
	});
};


joeonmars.views.sections.DetailSection.prototype.gotoArtwork = function(artworkId, pageId) {
	if(this.currentArtworkComponent) {
		this.currentArtworkComponent.deactivate();
		this.currentArtworkComponent.hide();
	}

	this.currentArtworkComponent = this.artworkComponents[artworkId];
	this.currentArtworkComponent.show();
	this.currentArtworkComponent.activate();

	this.onResize(this.currentSectionSize);

	if(pageId) this.currentArtworkComponent.gotoPage(pageId);
};


joeonmars.views.sections.DetailSection.prototype.onScrolled = function(left, top, zoom) {
	goog.base(this, 'onScrolled', left, top, zoom);
/*
	if(left !== this.position.x && goog.style.isElementShown(this.domElement)) {
		goog.style.showElement(this.domElement, false);
		this.dispatchEvent(new joeonmars.events.SectionEvent(joeonmars.events.SectionEvent.EventType.SECTION_HIDE));
	}*/
};


joeonmars.views.sections.DetailSection.prototype.onResize = function(sectionSize) {
	this.currentSectionSize = sectionSize || this.currentSectionSize;

	goog.base(this, 'onResize', this.currentSectionSize);

	if(this.currentArtworkComponent) this.currentArtworkComponent.onResize(this.currentSectionSize);
};

goog.exportSymbol('joeonmars.views.sections.DetailSection', joeonmars.views.sections.DetailSection);