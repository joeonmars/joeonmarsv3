goog.provide('joeonmars.views.sections.Section');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');
goog.require('joeonmars.events.SectionEvent');

/**
 * @constructor
 */

joeonmars.views.sections.Section = function(sectionId, className, container) {
  goog.base(this);
  this.setParentEventTarget(joeonmars.GET_VAR('sectionController'));

  this.sectionId = sectionId;

  // dom elements
  this.parentDomElement = container;
  this.domElement = goog.dom.createDom('div', 'section ' + className);
  goog.dom.appendChild(container, this.domElement);

  this.contentDom = goog.dom.createDom('div', 'content');
  goog.dom.appendChild(this.domElement, this.contentDom);

  this.titleDom = goog.dom.createDom('h2');
  this.titleDom.innerHTML = joeonmars.getText('section.title.'+this.sectionId);
  goog.dom.appendChild(this.contentDom, this.titleDom);

  // props
  this.isActivated = false;
  this.position = new goog.math.Size(0, 0);

  // debug
  goog.style.setStyle(this.domElement, 'background-color', joeonmars.utils.getRandomCssColor());
};
goog.inherits(joeonmars.views.sections.Section, goog.events.EventTarget);


joeonmars.views.sections.Section.prototype.init = function() {

};


joeonmars.views.sections.Section.prototype.activate = function() {
	if(this.isActivated) return;
	else this.isActivated = true;
};


joeonmars.views.sections.Section.prototype.deactivate = function() {
	if(!this.isActivated) return;
	else this.isActivated = false;
};


joeonmars.views.sections.Section.prototype.setCopy = function() {
};


joeonmars.views.sections.Section.prototype.onScrolled = function(left, top, zoom) {
	if(left === this.position.x) {
		if(goog.style.isElementShown(this.domElement)) {
			// dispatch section event to register this section as the current section
			this.dispatchEvent(new joeonmars.events.SectionEvent(joeonmars.events.SectionEvent.EventType.SECTION_IN));
		}
	}
};


joeonmars.views.sections.Section.prototype.onResize = function(sectionSize) {
	goog.style.setSize(this.domElement, sectionSize.width, sectionSize.height);
	this.position.x = goog.style.getPosition(this.domElement).x;
};