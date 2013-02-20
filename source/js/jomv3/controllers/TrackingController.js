goog.provide('joeonmars.controllers.TrackingController');

/**
 * @constructor
 */

joeonmars.controllers.TrackingController = function() {
  this.siteDomain = window.location.hostname;  
};

/**
 * Dispatches to Google Analytics a page click
 * @param {string} category
 * @param {string} label
 */
joeonmars.controllers.TrackingController.prototype.gaTrackPageClick = function(category, label){
  var trackEvent = ['_trackEvent', category, 'Click', label];
  _gaq.push(trackEvent);
  trackEvent[0] = 'b._trackEvent';
  _gaq.push(trackEvent);
  //console.log('GA click', '_trackEvent', category, 'Click', label);
};
  

/**
 * Dispatches to Google Analytics a page view
 * @param {string} token
 */
joeonmars.controllers.TrackingController.prototype.gaTrackPageView = function(){
  var url = window.location.pathname + window.location.search + window.location.hash;
  _gaq.push(['_trackPageview', url]);
  _gaq.push(['b._trackPageview', url]);
  //console.log('GA page', '_trackPageview', url);
};