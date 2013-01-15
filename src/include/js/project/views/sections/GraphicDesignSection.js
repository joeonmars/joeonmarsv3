goog.provide('joeonmars.views.sections.GraphicDesignSection');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');
goog.require('joeonmars.events.SectionEvent');

/**
 * @constructor
 */

joeonmars.views.sections.GraphicDesignSection = function(sectionId, className, container) {
  goog.base(this, sectionId, className, container);

};
goog.inherits(joeonmars.views.sections.GraphicDesignSection, joeonmars.views.sections.Section);


joeonmars.views.sections.GraphicDesignSection.prototype.init = function() {
	goog.base(this, 'init');

	// populate artwork thumbnails from data
	var artworksData = joeonmars.main.getAsset('asset-settings.json')['sections'][this.sectionId];
  goog.object.forEach(artworksData, function(assets, artworkId) {
  	var thumb, img;

    thumb = goog.dom.createDom('a', 'thumbnail', [
    	img = goog.dom.createDom('img', {'width': 70, 'height': 100}),
    ]);
    
    thumb.href = '#' + joeonmars.GET_VAR('navigationController').getLinkById(this.sectionId) + '/' + artworkId;

    goog.dom.appendChild(this.contentDom, thumb);
  }, this);
};


joeonmars.views.sections.GraphicDesignSection.prototype.onResize = function(sectionSize) {
	goog.base(this, 'onResize', sectionSize);
};

goog.exportSymbol('joeonmars.views.sections.GraphicDesignSection', joeonmars.views.sections.GraphicDesignSection);