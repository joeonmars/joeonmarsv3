goog.provide('joeonmars.Main');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.json');
goog.require('goog.Timer');
goog.require('goog.userAgent');

goog.require('joeonmars.controllers.NavigationController');
goog.require('joeonmars.controllers.SectionController');
goog.require('joeonmars.controllers.ShareController');
goog.require('joeonmars.controllers.TrackingController');
goog.require('joeonmars.controllers.ResizeController');
goog.require('joeonmars.views.MainPreloader');
goog.require('joeonmars.views.Header');
goog.require('joeonmars.views.Footer');


/**
 * @constructor
 */
joeonmars.Main = function() {
  goog.base(this);

  this.mainPreloader = null;
  this.isLoaded = false;

  /* @private
   * name / value pairings of the main assets
   */
  this.assets_ = {};
};
goog.inherits(joeonmars.Main, goog.events.EventTarget);
goog.addSingletonGetter(joeonmars.Main);


joeonmars.Main.prototype.init = function() {
  // preload assets
  this.mainPreloader = joeonmars.views.MainPreloader.getInstance();
  this.mainPreloader.init();
};


joeonmars.Main.prototype.getAsset = function(id) {
  return this.assets_[id];
};


joeonmars.Main.prototype.setAsset = function(id, asset) {
  this.assets_[id] = asset;
};


joeonmars.Main.prototype.onInitialLoadComplete = function() {
  // render body element
  document.body.style.display = 'block';

  // init prior components
  joeonmars.SET_VAR('header', new joeonmars.views.Header());
  joeonmars.GET_VAR('header').init();

  joeonmars.SET_VAR('footer', new joeonmars.views.Footer());
  joeonmars.GET_VAR('footer').init();

  joeonmars.SET_VAR('trackingController', new joeonmars.controllers.TrackingController());
  joeonmars.SET_VAR('shareController', new joeonmars.controllers.ShareController());

  joeonmars.SET_VAR('navigationController', new joeonmars.controllers.NavigationController());

  joeonmars.SET_VAR('sectionController', new joeonmars.controllers.SectionController());
  joeonmars.GET_VAR('sectionController').init();

  joeonmars.SET_VAR('resizeController', new joeonmars.controllers.ResizeController());
  joeonmars.GET_VAR('resizeController').init();
};


joeonmars.Main.prototype.onLoadComplete = function() {
  // flag loaded
  this.isLoaded = true;

  // init other components
  joeonmars.GET_VAR('sectionController').setCopy();

  // navigate to the initial componenet after delay to
  // prevent UI freezing while initiating all the components
  goog.Timer.callOnce(function() {
    joeonmars.GET_VAR('sectionController').enableDrag();
    joeonmars.GET_VAR('navigationController').init();
  }, 2000);

  joeonmars.GET_VAR('resizeController').onResize();
};