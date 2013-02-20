goog.provide('joeonmars.views.artworks.ArtworkComponent');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('joeonmars.events.ScrollEvent');
goog.require('joeonmars.views.artworks.Artwork');
goog.require('joeonmars.views.artworks.ArtworkIntro');

/**
 * @constructor
 */

joeonmars.views.artworks.ArtworkComponent = function(artworkData, artworkId, section) {
  goog.base(this);

  this.artworkData = artworkData;
  this.artworkId = artworkId;
  this.section = section;

  this.artworkWrapper = goog.dom.createDom('div', 'artworkWrapper');

  this.introPage = null;
  this.pages = [];
  this.thumbnails = null;

  // zynga scroller
  var scrollerOptions = {
    'paging': true,
    'bouncing': false,
    'animationDuration': '1000'
  };

  this.scroller = new Scroller(goog.bind(this.onScrolled, this), scrollerOptions);
  this.documentObj = goog.dom.getDocument();
  this.isDown = false;
  this.pageHeight = null;
  this.totalHeight = null;
  this.currentPage = null;
};
goog.inherits(joeonmars.views.artworks.ArtworkComponent, goog.events.EventTarget);


joeonmars.views.artworks.ArtworkComponent.prototype.init = function() {
  // create pages
  goog.object.forEach(this.artworkData, function(asset, pageId) {
    // intro page
    var page;

    if(pageId == 'intro') {
      page = new joeonmars.views.artworks.ArtworkIntro(this, this.artworkWrapper, asset, this.artworkId);
      this.introPage = page;
    }else {
      page = new joeonmars.views.artworks.Artwork(this, this.artworkWrapper, asset, this.artworkId, pageId);
    }

    this.pages.push(page);

    page.init();

  }, this);

  //
  this.thumbnails = new joeonmars.views.artworks.ArtworkThumbnails(
    this.artworkData, this.artworkId, this.section.parentSectionId
  );
  this.thumbnails.init();
};


joeonmars.views.artworks.ArtworkComponent.prototype.activate = function() {return;
  goog.events.listen(this.section.leftDom, joeonmars.events.ScrollEvent.EventType.DOWN, this.onDown, false, this);
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.MOVE, this.onMove, false, this);
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.UP, this.onUp, false, this);

  goog.events.listen(this, joeonmars.events.ScrollEvent.EventType.SCROLL_IN, this.onScrollIn, false, this);

  goog.dom.classes.add(this.section.leftDom, 'draggable');
};


joeonmars.views.artworks.ArtworkComponent.prototype.deactivate = function() {return;
  goog.events.unlisten(this.section.leftDom, joeonmars.events.ScrollEvent.EventType.DOWN, this.onDown, false, this);
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.MOVE, this.onMove, false, this);
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.UP, this.onUp, false, this);

  goog.events.unlisten(this, joeonmars.events.ScrollEvent.EventType.SCROLL_IN, this.onScrollIn, false, this);

  goog.dom.classes.remove(this.section.leftDom, 'draggable');

  this.isDown = false;
};


joeonmars.views.artworks.ArtworkComponent.prototype.show = function() {
  goog.dom.appendChild(this.section.leftDom, this.artworkWrapper);
  goog.dom.appendChild(this.section.rightDom, this.thumbnails.domElement);
};


joeonmars.views.artworks.ArtworkComponent.prototype.hide = function() {
  goog.dom.removeNode(this.artworkWrapper);
  goog.dom.removeNode(this.thumbnails.domElement);
};


joeonmars.views.artworks.ArtworkComponent.prototype.gotoPage = function(pageId) {
  var page = goog.array.find(this.pages, function(page) {
    return page.pageId === pageId;
  });

  if(!page) return;
  else this.scroller.scrollTo(0, page.position.y, true);
};


joeonmars.views.artworks.ArtworkComponent.prototype.setCopy = function() {
  var xml = this.section.parentSectionId + '.xml';

  goog.array.forEach(this.pages, function(page) {
    page.setCopy(xml);
  });
};


joeonmars.views.artworks.ArtworkComponent.prototype.onDown = function(e) {
  this.isDown = true;

  var browserEvent = e.getBrowserEvent();
  
  if(e.type == 'mousedown') {
    this.scroller.doTouchStart([browserEvent], browserEvent.timeStamp);
  }else {
    this.scroller.doTouchMove(browserEvent.touches, browserEvent.timeStamp);
  }
  
  e.preventDefault();
  e.stopPropagation();
};


joeonmars.views.artworks.ArtworkComponent.prototype.onMove = function(e) {
  if(!this.isDown) return;

  var browserEvent = e.getBrowserEvent();

  if(e.type == 'mousemove') {
    this.scroller.doTouchMove([browserEvent], browserEvent.timeStamp);
  }else {
    this.scroller.doTouchMove(browserEvent.touches, browserEvent.timeStamp);
  }

  e.preventDefault();
  //e.stopPropagation();
};


joeonmars.views.artworks.ArtworkComponent.prototype.onUp = function(e) {
  if(!this.isDown) return;
  else this.isDown = false;

  // check and toggle bouncing effect
  if(this.scroller.getValues()['top'] < 0 ||
    this.scroller.getValues()['top'] > this.totalHeight - this.pageHeight) {
    this.scroller.options['bouncing'] = true;
  }else {
    this.scroller.options['bouncing'] = false;
  }

  var browserEvent = e.getBrowserEvent();
  this.scroller.doTouchEnd(browserEvent.timeStamp);

  e.preventDefault();
  //e.stopPropagation();
};


joeonmars.views.artworks.ArtworkComponent.prototype.onScrolled = function(left, top, zoom) {
  //console.log(top);
  joeonmars.utils.setDomPosition(this.artworkWrapper, 0, -top);

  goog.array.forEach(this.pages, function(page) {
    page.onScrolled( top );
  });
};


joeonmars.views.artworks.ArtworkComponent.prototype.onScrollIn = function(e) {
  if(this.currentPage === e.target) return;
  else {
    this.currentPage = e.target;
  }

  var indexOfPage = goog.array.indexOf(this.pages, this.currentPage);
  if(indexOfPage === 0 || indexOfPage === this.pages.length-1) {
    this.scroller.options['bouncing'] = true;
  }else {
    this.scroller.options['bouncing'] = false;
  }
};


joeonmars.views.artworks.ArtworkComponent.prototype.onResize = function(sectionSize) {
  // resize pages
  goog.array.forEach(this.pages, function(page) {
    page.onResize(sectionSize);
  });

  // resize thumbnails
  this.thumbnails.onResize(sectionSize);

  // resize scroller
  var artworkTotalHeight = goog.style.getSize(this.artworkWrapper).height;
  this.scroller.setDimensions(sectionSize.width, sectionSize.height, sectionSize.width, artworkTotalHeight);
  this.scroller.setSnapSize(sectionSize.width, sectionSize.height);

  this.pageHeight = sectionSize.height;
  this.totalHeight = this.pageHeight * this.pages.length;
};