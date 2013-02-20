goog.provide('joeonmars.controllers.SectionController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.EventTarget');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.Timer');

goog.require('joeonmars.events.SectionEvent');
goog.require('joeonmars.views.sections.AboutSection');
goog.require('joeonmars.views.sections.DetailSection');
goog.require('joeonmars.views.sections.GraphicDesignSection');
goog.require('joeonmars.views.sections.HomeSection');
goog.require('joeonmars.views.sections.SideDesignSection');

/**
 * @constructor
 */

joeonmars.controllers.SectionController = function() {
  goog.base(this);

  this.sectionWrapper = goog.dom.getElement('section-wrapper');
  this.sections = {};

  this.lastSection = null;
  this.currentSection = null;
  this.totalWidth = 0;
  this.pageSize = null;
  this.leftBound = 0;
  this.rightBound = 0;

  // page scroller
  this.pageScroller = new joeonmars.fx.PageScroller(goog.bind(this.onPageScroll, this));

  // zynga scroller
  var scrollerOptions = {
    'scrollingY': false,
    'paging': false,
    'bouncing': false,
    'snapping': true,
    'animationDuration': 1000
  };

  this.scroller = new Scroller(goog.bind(this.onScrolled, this), scrollerOptions);
  this.documentObj = goog.dom.getDocument();

  this.isDown = false;

  this.repositionTimer = null;
};
goog.inherits(joeonmars.controllers.SectionController, goog.events.EventTarget);


joeonmars.controllers.SectionController.prototype.init = function() {
  // create sections
  var sectionIds = joeonmars.controllers.SectionController.Sections;

  goog.object.forEach(sectionIds, function(sectionId) {
    var SectionClass;
    var SectionCssClass;
    switch(sectionId) {
      case joeonmars.controllers.SectionController.Sections.HOME:
      SectionClass = 'HomeSection';
      SectionCssClass = 'homeSection';
      break;

      case joeonmars.controllers.SectionController.Sections.GRAPHIC_DESIGN:
      SectionClass = 'GraphicDesignSection';
      SectionCssClass = 'graphicDesignSection';
      break;

      case joeonmars.controllers.SectionController.Sections.SIDE_DESIGN:
      SectionClass = 'SideDesignSection';
      SectionCssClass = 'sideDesignSection';
      break;

      case joeonmars.controllers.SectionController.Sections.GRAPHIC_DESIGN_DETAIL:
      case joeonmars.controllers.SectionController.Sections.SIDE_DESIGN_DETAIL:
      SectionClass = 'DetailSection';
      SectionCssClass = 'detailSection';
      break;

      case joeonmars.controllers.SectionController.Sections.ABOUT:
      SectionClass = 'AboutSection';
      SectionCssClass = 'aboutSection';
      break;
    };

    var section = new joeonmars['views']['sections'][SectionClass](sectionId, SectionCssClass, this.sectionWrapper);
    this.sections[sectionId] = section;

    section.init();
  }, this);

  // register current section
  this.currentSection = this.sections[joeonmars.controllers.SectionController.Sections.HOME];
  this.lastSection = this.currentSection;

  // add event listeners
  goog.events.listen(this, joeonmars.events.SectionEvent.EventType.SECTION_IN, this.onSectionIn, false, this);
  goog.events.listen(this, joeonmars.events.SectionEvent.EventType.SECTION_HIDE, this.onSectionHide, false, this);
};


joeonmars.controllers.SectionController.prototype.setCopy = function() {
  goog.object.forEach(this.sections, function(section) {
    section.setCopy();
  });
};


joeonmars.controllers.SectionController.prototype.enableDrag = function() {

  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.DOWN, this.onDown, false, this);
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.MOVE, this.onMove, false, this);
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.UP, this.onUp, false, this);

  return;
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.DOWN, this.onDown, false, this);
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.MOVE, this.onMove, false, this);
  goog.events.listen(this.documentObj, joeonmars.events.ScrollEvent.EventType.UP, this.onUp, false, this);

  goog.dom.classes.add(this.sectionWrapper, 'draggable');
};


joeonmars.controllers.SectionController.prototype.disableDrag= function() {

  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.DOWN, this.onDown, false, this);
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.MOVE, this.onMove, false, this);
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.UP, this.onUp, false, this);

  return;
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.DOWN, this.onDown, false, this);
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.MOVE, this.onMove, false, this);
  goog.events.unlisten(this.documentObj, joeonmars.events.ScrollEvent.EventType.UP, this.onUp, false, this);

  goog.dom.classes.remove(this.sectionWrapper, 'draggable');

  this.isDown = false;
};


joeonmars.controllers.SectionController.prototype.gotoSection = function(sectionId, disableScroll) {
  var section = this.sections[sectionId];
  this.scroller.scrollTo(section.position.x, section.position.y, !disableScroll);
};


joeonmars.controllers.SectionController.prototype.onDown = function(e) {
  this.pageScroller.onDown(e);

  return;
  var browserEvent = e.getBrowserEvent();
  
  if(e.type == 'mousedown') {
    this.scroller.doTouchStart([browserEvent], browserEvent.timeStamp);
  }else {
    this.scroller.doTouchMove(browserEvent.touches, browserEvent.timeStamp);
  }
  
  e.preventDefault();
};


joeonmars.controllers.SectionController.prototype.onMove = function(e) {
  this.pageScroller.onMove(e);

  return;
  var browserEvent = e.getBrowserEvent();

  if(e.type == 'mousemove') {
    this.scroller.doTouchMove([browserEvent], browserEvent.timeStamp);
  }else {
    this.scroller.doTouchMove(browserEvent.touches, browserEvent.timeStamp);
  }

  e.preventDefault();
};


joeonmars.controllers.SectionController.prototype.onUp = function(e) {
  this.pageScroller.onUp(e);

  return;
  // check and toggle bouncing effect
  if(this.scroller.getValues()['left'] < 0 ||
    this.scroller.getValues()['left'] > this.rightBound) {
    this.scroller.options['bouncing'] = true;
  }else {
    this.scroller.options['bouncing'] = false;
  }

  var browserEvent = e.getBrowserEvent();
  this.scroller.doTouchEnd(browserEvent.timeStamp);

  e.preventDefault();
};


joeonmars.controllers.SectionController.prototype.onPageScroll = function(position) {
  console.log(position);

  joeonmars.utils.setDomPosition(this.sectionWrapper, position, 0);

  // position footer
  var footerLeft = 0;
  if(position > this.leftBound) footerLeft = position;
  else if(-position > this.rightBound) footerLeft = this.rightBound + position;

  joeonmars.GET_VAR("footer").onScrolled(footerLeft);

  goog.object.forEach(this.sections, function(section) {
    section.onScrolled(position);
  });
};


joeonmars.controllers.SectionController.prototype.onScrolled = function(left, top, zoom) {
  //console.log(left, top);
  joeonmars.utils.setDomPosition(this.sectionWrapper, -left, top);

  // position footer
  var footerLeft = 0;
  if(left < this.leftBound) footerLeft = -left;
  else if(left > this.rightBound) footerLeft = this.rightBound - left;

  joeonmars.GET_VAR("footer").onScrolled(footerLeft);

  goog.object.forEach(this.sections, function(section) {
    section.onScrolled(left, top, zoom);
  });
};


joeonmars.controllers.SectionController.prototype.onSectionIn = function(e, args) {
  this.lastSection = this.currentSection;
  this.lastSection.deactivate();

  this.currentSection = e.target;
  this.currentSection.activate();

  // for updating footer mode
  var footer = joeonmars.GET_VAR('footer');

  if(this.currentSection.sectionId === joeonmars.controllers.SectionController.Sections.HOME || 
    this.currentSection.sectionId === joeonmars.controllers.SectionController.Sections.ABOUT ) {

    // change footer mode to info
    footer.setMode(joeonmars.views.Footer.Mode.INFO);

    // enable bouncing for the first and last sections
    this.scroller.options['bouncing'] = true;

  }else {

    // change footer mode to navigation
    footer.setMode(joeonmars.views.Footer.Mode.NAVIGATION);

    // disable bouncing for in-between sections
    this.scroller.options['bouncing'] = false;

  }
};


joeonmars.controllers.SectionController.prototype.onSectionHide = function(e, args) {
  // if a section is hidden, re-layout all the rest sections
  this.onResize( joeonmars.GET_VAR('resizeController').pageSize );
  this.gotoSection( this.currentSection.sectionId, true );
};


joeonmars.controllers.SectionController.prototype.onResize = function(pageSize) {
  this.pageSize = pageSize;

  // resize section wrapper to the total width of the visible sections
  var totalVisibleSections = 0;
  goog.object.forEach(this.sections, function(section) {
    if(goog.style.isElementShown(section.domElement)) totalVisibleSections ++;
  });

  this.totalWidth = pageSize.width * totalVisibleSections;
  goog.style.setSize(this.sectionWrapper, this.totalWidth, pageSize.height);

  // resize inner sections
  goog.object.forEach(this.sections, function(section) {
    section.onResize(pageSize);
  }, this);

  // set scroller bounds
  this.leftBound = 0;
  this.rightBound = this.totalWidth - this.pageSize.width;

  // restore last section position after resizing
  if(this.repositionTimer) goog.Timer.clear(this.repositionTimer);
  this.repositionTimer = goog.Timer.callOnce(
    goog.bind(function() {
      goog.Timer.clear(this.repositionTimer);
      // set scroller props
      this.pageScroller.setDimensions(pageSize.width, pageSize.height, this.totalWidth, pageSize.height);

      this.scroller.setDimensions(pageSize.width, pageSize.height, this.totalWidth, pageSize.height);
      this.scroller.setSnapSize(pageSize.width, pageSize.height);
      // restore current section position
      this.gotoSection(this.currentSection.sectionId);
    }, this),
  1000);
};


joeonmars.controllers.SectionController.Sections = {
  HOME: 'home',
  GRAPHIC_DESIGN: 'graphic-design',
  GRAPHIC_DESIGN_DETAIL: 'graphic-design-detail',
  SIDE_DESIGN: 'side-design',
  SIDE_DESIGN_DETAIL: 'side-design-detail',
  ABOUT: 'about'
};