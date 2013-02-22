goog.provide('jomv3.controllers.NavigationController');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.object');
goog.require('goog.string');

/**
 * @constructor
 */
 
jomv3.controllers.NavigationController = function(){
  goog.base(this);

  this.navSettings = null;
  this.lastLink = null;
  this.currentLink = null;
  this.linkBeforeLoaded = null;
  this.mapLinks = [];

  // immediately fire an event for the current location
  var input = goog.dom.createDom('input');
  var iframe = goog.dom.createDom('iframe');
  this.navHistory = new goog.History(false, null, input, iframe);

  goog.events.listen(this.navHistory, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
  this.navHistory.setEnabled(true);
};
goog.inherits(jomv3.controllers.NavigationController, goog.events.EventTarget);
goog.addSingletonGetter(jomv3.controllers.NavigationController);


jomv3.controllers.NavigationController.prototype.init = function(){
  var assetsController = jomv3.controllers.AssetsController.getInstance();
  this.navSettings = assetsController.getAssetById('navigation-settings', 'settings');
  console.log(assetsController, this.navSettings);

  var demoLink = this.navSettings['demo'];
  this.mapLink(demoLink + '/:demo-id');

  // navigate immediately to the initial link before loaded
  this.navHistory.replaceToken('');
  this.navHistory.replaceToken(this.linkBeforeLoaded);
};


jomv3.controllers.NavigationController.prototype.formatLink = function(link){
  return '#' + link;
};


jomv3.controllers.NavigationController.prototype.mapLink = function(link){
  // example: this.mapLink('/menu/sub-menu/:menu-button');
  var strs = link.split(':');
  this.mapLinks.push(strs);
};


jomv3.controllers.NavigationController.prototype.onNavigate = function(e){
  // put down whole string of the links
  this.lastLink = this.currentLink;
  this.currentLink = e.token;

  if(!this.navSettings) {
    this.linkBeforeLoaded = this.currentLink;
    return;
  }
  
  // check map links
  goog.array.forEach(this.mapLinks, function(mapLink, index) {
    if(goog.string.startsWith(this.currentLink, mapLink[0])) {
      var param = goog.string.remove(this.currentLink, mapLink[0]);
      param = (param === '' ? undefined : param);
      e[mapLink[1]] = param;
      console.log(e);
      return;
    }
  }, this);

  //
};