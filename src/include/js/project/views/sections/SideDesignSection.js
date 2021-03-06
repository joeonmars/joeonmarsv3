goog.provide('joeonmars.views.sections.SideDesignSection');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');
goog.require('joeonmars.events.SectionEvent');

/**
 * @constructor
 */

joeonmars.views.sections.SideDesignSection = function(sectionId, className, container) {
  goog.base(this, sectionId, className, container);

};
goog.inherits(joeonmars.views.sections.SideDesignSection, joeonmars.views.sections.Section);


joeonmars.views.sections.SideDesignSection.prototype.init = function() {
	goog.base(this, 'init');
};


joeonmars.views.sections.SideDesignSection.prototype.onResize = function(sectionSize) {
	goog.base(this, 'onResize', sectionSize);
};

goog.exportSymbol('joeonmars.views.sections.SideDesignSection', joeonmars.views.sections.SideDesignSection);