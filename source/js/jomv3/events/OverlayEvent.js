goog.provide('joeonmars.events.OverlayEvent');

goog.require('goog.events.Event');

joeonmars.events.OverlayEvent = function(type, args){
	goog.base(this, type);

	this.args = args;
};
goog.inherits(joeonmars.events.OverlayEvent, goog.events.Event);

joeonmars.events.OverlayEvent.EventType = {
	FADED_IN: 'faded_in',
	FADED_OUT: 'faded_out'
};