goog.provide('joeonmars.controllers.ShareController');

goog.require('goog.dom');

/**
 * @constructor
 */

joeonmars.controllers.ShareController = function() {

  this.twitter = function(url) {
    window.open("https://twitter.com/intent/tweet?source=webclient&text="+url, "_blank", "width=575, height=400");
  };

  this.facebook = function(url) {
    window.open("https://www.facebook.com/sharer/sharer.php?u="+url, "_blank", "width=640, height=470");
  };

  this.google = function(url) {
    window.open("https://plus.google.com/share?url="+url, "_blank", "width=640, height=470");
  };

};