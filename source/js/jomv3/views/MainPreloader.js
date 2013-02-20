goog.provide('joeonmars.views.MainPreloader');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.math.Coordinate');
goog.require('goog.object');
goog.require('joeonmars.views.MainComponent');

/**
 * @constructor
 */

joeonmars.views.MainPreloader = function() {
  goog.base(this);

  this.main = null;
  this.preloader = null;
};
goog.inherits(joeonmars.views.MainPreloader, joeonmars.views.MainComponent);
goog.addSingletonGetter(joeonmars.views.MainPreloader);


joeonmars.views.MainPreloader.prototype.init = function() {
	this.main = joeonmars.Main.getInstance();

  // preload asset-settings.json to retrieve main assets to load
  var initialPreloader = new createjs.PreloadJS();
  var loaderQueue = [
    {'src':joeonmars.ASSETS_URL + 'xml/copy.xml', 'id':'copy.xml'},
    {'src':joeonmars.ASSETS_URL + 'json/asset-settings.json', 'id':'asset-settings.json'},
    {'src':joeonmars.ASSETS_URL + 'json/navigation-settings.json', 'id':'navigation-settings.json'}
  ];

  initialPreloader.loadManifest(loaderQueue);

  initialPreloader.onFileLoad = goog.bind(this.onAssetLoaded, this);

  initialPreloader.onComplete = goog.bind(function (e) {
    this.main.onInitialLoadComplete();
    this.loadMainAssets();
  }, this);
};


joeonmars.views.MainPreloader.prototype.loadMainAssets = function() {
  this.preloader = new createjs.PreloadJS();

  var assetsQueue = [
    {'src':joeonmars.ASSETS_URL + 'xml/tracking.xml', 'id':'tracking.xml'},
    {'src':joeonmars.ASSETS_URL + 'xml/graphic-design.xml', 'id':'graphic-design.xml'},
    {'src':joeonmars.ASSETS_URL + 'xml/side-design.xml', 'id':'side-design.xml'}
  ];

  // append main assets to loader queue
  var mainAssetsQueue = this.main.getAsset('asset-settings.json')['main'];
  goog.array.extend(assetsQueue, mainAssetsQueue);

  // add events listeners to loader
  this.preloader.onFileLoad = goog.bind(this.onAssetLoaded, this);
  this.preloader.onProgress = goog.bind(this.onAssetProgress, this);
  this.preloader.onComplete = goog.bind(this.onAssetComplete, this);
  this.preloader.onError = goog.bind(this.onAssetError, this);

  this.preloader.loadManifest(joeonmars.utils.parseBatchAssets(assetsQueue));
};


joeonmars.views.MainPreloader.prototype.onAssetLoaded = function(e) {
  if (e.type === 'json') {
    this.main.setAsset(e.id, goog.json.parse(e.result));
  } else {
    this.main.setAsset(e.id, e.result);
  }
};


joeonmars.views.MainPreloader.prototype.onAssetError = function(result) {
  console.log('main preloader error: ', result);
};


joeonmars.views.MainPreloader.prototype.onAssetProgress = function() {
  var progress = this.preloader.progress;
};


joeonmars.views.MainPreloader.prototype.onAssetComplete = function() {
  this.main.onLoadComplete();
};


joeonmars.views.MainPreloader.prototype.onResize = function(windowSize) {

};