goog.provide('joeonmars.events.ScrollEvent');

goog.require('goog.events.Event');

joeonmars.events.ScrollEvent = function(type, args){
	goog.base(this, type);

	this.args = args;
};
goog.inherits(joeonmars.events.ScrollEvent, goog.events.Event);

joeonmars.events.ScrollEvent.EventType = {
	SCROLL_IN: 'scroll_in',
	SCROLL_OUT: 'scroll_out',
	DOWN: (goog.userAgent.MOBILE ? 'touchstart' : 'mousedown'),
  	MOVE: (goog.userAgent.MOBILE ? 'touchmove' : 'mousemove'),
  	UP: (goog.userAgent.MOBILE ? ['touchend', 'touchcancel'] : 'mouseup')
};