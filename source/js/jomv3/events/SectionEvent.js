goog.provide('joeonmars.events.SectionEvent');

goog.require('goog.events.Event');

joeonmars.events.SectionEvent = function(type, args){
	goog.base(this, type);

	this.args = args;
};
goog.inherits(joeonmars.events.SectionEvent, goog.events.Event);

joeonmars.events.SectionEvent.EventType = {
	SECTION_IN: 'section_in',
	SECTION_OUT: 'section_out',
	SECTION_HIDE: 'section_hide'
};