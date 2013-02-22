goog.provide('jomv3.controllers.NavigationController');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.object');

/**
 * @constructor
 */
 
jomv3.controllers.NavigationController = function(){
  goog.base(this);

  this.navSettings = {};
};
goog.inherits(jomv3.controllers.NavigationController, goog.events.EventTarget);
goog.addSingletonGetter(jomv3.controllers.NavigationController);


jomv3.controllers.NavigationController.prototype.init = function(){
  var assetsController = jomv3.controllers.AssetsController.getInstance();
  this.navSettings = assetsController.getAssetById('navigation-settings', 'settings');
  console.log(assetsController, this.navSettings);

  /*
  var demoLink = this.formatLink( this.navSettings['demo'] );
  Path.map(demoLink).to(function(){
    console.log("demo");
  });

  var aboutLink = this.formatLink( this.navSettings['about'] );
  Path.map(aboutLink).to(function(){
    console.log("about");
  });

  Path.listen();*/
};


jomv3.controllers.NavigationController.prototype.formatLink = function(link){
  return '#!' + link;
};


jomv3.controllers.NavigationController.prototype.onNavigate = function(e){
  var links = e.token.split('/');
  console.log(links);
};