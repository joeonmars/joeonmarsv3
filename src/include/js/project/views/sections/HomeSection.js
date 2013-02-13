goog.provide('joeonmars.views.sections.HomeSection');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');
goog.require('joeonmars.events.SectionEvent');

/**
 * @constructor
 */

joeonmars.views.sections.HomeSection = function(sectionId, className, container) {
  goog.base(this, sectionId, className, container);

};
goog.inherits(joeonmars.views.sections.HomeSection, joeonmars.views.sections.Section);


joeonmars.views.sections.HomeSection.prototype.init = function() {
	goog.base(this, 'init');

	var roundThumb = new joeonmars.views.elements.RoundThumb(200, new goog.math.Coordinate(600, 400), joeonmars.views.elements.RoundThumb.ClassName.FLASH);
	goog.dom.appendChild(this.contentDom, roundThumb.domElement);

	var uiSpinner = new joeonmars.views.elements.UISpinner('roundThumbLoader');
	goog.dom.appendChild(this.contentDom, uiSpinner.domElement);
};


joeonmars.views.sections.HomeSection.prototype.onResize = function(sectionSize) {
	goog.base(this, 'onResize', sectionSize);
};

goog.exportSymbol('joeonmars.views.sections.HomeSection', joeonmars.views.sections.HomeSection);