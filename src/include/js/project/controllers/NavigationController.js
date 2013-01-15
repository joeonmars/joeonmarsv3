goog.provide('joeonmars.controllers.NavigationController');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.object');

/**
 * @constructor
 */
 
joeonmars.controllers.NavigationController = function(){
  goog.base(this);

  this.setParentEventTarget( joeonmars.Main.getInstance() );

  this.navSettings = joeonmars.main.getAsset('navigation-settings.json');

  this.hashLinks = [];
  this.currentLinks = [];
  this.linkHistory = [];
  this.maxLengthOfLinkHistory = 6;

  this.linkBeforeMainLoaded = null;
  this.stageLinkBeforeMainLoaded = null;

  // immediately fire an event for the current location
  var input = goog.dom.createDom('input');
  var iframe = goog.dom.createDom('iframe');
  this.navHistory = new goog.History(false, null, input, iframe);

  goog.events.listen(this.navHistory, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
  this.navHistory.setEnabled(true);
};
goog.inherits(joeonmars.controllers.NavigationController, goog.events.EventTarget);


joeonmars.controllers.NavigationController.prototype.init = function(){
  // init history stack
  var i;
  var l = this.maxLengthOfLinkHistory;
  for(i = 0; i < l; ++i) {
    this.linkHistory[i] = '';
  }

  // navigate to the initial link
  this.navHistory.setToken('');
  this.setHashLink(this.linkBeforeMainLoaded);
};


joeonmars.controllers.NavigationController.prototype.setHashLink = function(link){
  this.navHistory.setToken(link);
};


joeonmars.controllers.NavigationController.prototype.getIdByLink = function(link){
  return goog.object.findKey(this.navSettings, function(val) {return val === link});
};


joeonmars.controllers.NavigationController.prototype.getLinkById = function(id){
  return this.navSettings[id];
};


joeonmars.controllers.NavigationController.prototype.onNavigate = function(e){

  if(!joeonmars.Main.getInstance().isLoaded) {
    this.linkBeforeMainLoaded = e.token;
    return;
  }

  var links = e.token.split('/');
  goog.array.forEachRight(links, function(str, index) {
    if(str === '') goog.array.removeAt(links, index);
  });

  if(links === this.currentLinks || goog.array.equals(links, this.currentLinks)) return;
  else this.currentLinks = links;

  this.linkHistory.push(e.token);
  if(this.linkHistory.length > this.maxLengthOfLinkHistory) goog.array.removeAt(this.linkHistory, 0);

  //console.log('link history: ', this.linkHistory);
  //console.log('current hash links: ', this.currentLinks);

  var sectionController = joeonmars.GET_VAR('sectionController');

  if(this.currentLinks.length === 0) {
    
    console.log('no hash link..');

  }else if(this.currentLinks.length === 1) {
    
    // test home
    if(this.currentLinks[0] === this.getLinkById('home')) {
      console.log('navigate to home section...');
      sectionController.gotoSection('home');
      return;
    }

    // test graphic design
    if(this.currentLinks[0] === this.getLinkById('graphic-design')) {
      console.log('navigate to graphic design section...');
      sectionController.gotoSection('graphic-design');
      return;
    }

    // test side design
    if(this.currentLinks[0] === this.getLinkById('side-design')) {
      console.log('navigate to side design...');
      sectionController.gotoSection('side-design');
      return;
    }

    // test about
    if(this.currentLinks[0] === this.getLinkById('about')) {
      console.log('navigate to about section...');
      sectionController.gotoSection('about');
      return;
    }
  }else if(this.currentLinks.length > 1) {

    var sectionIds = ['graphic-design', 'side-design'];

    goog.array.forEach(sectionIds, function(sectionId) {

      // test graphic design detail
      if(this.currentLinks[0] === this.getLinkById(sectionId)) {
        var assets = joeonmars.main.getAsset('asset-settings.json')['sections'][sectionId];
        var workExist = goog.object.containsKey(assets, this.currentLinks[1]);
        if(workExist) {
          var pageId;
          if(this.currentLinks.length > 2) pageId = this.currentLinks[2];

          sectionController.gotoSection(sectionId+'-detail');
          sectionController.sections[sectionId+'-detail'].gotoArtwork( this.currentLinks[1], pageId );
        }
      }

    }, this);
  }
  
};
