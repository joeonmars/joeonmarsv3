goog.provide('jomv3.App');

goog.require('goog.events');
goog.require('goog.userAgent');
goog.require('goog.math');
goog.require('goog.window');
goog.require('jomv3.controllers.AssetsController');
goog.require('jomv3.controllers.NavigationController');
goog.require('jomv3.views.elements.RoundThumb');
goog.require('jomv3.views.elements.UISpinner');
goog.require('jomv3.fx.FermatSpiral');
goog.require('jomv3.fx.DummyScrollBar');


jomv3.App = function () {
/*
	// app assets
	jomv3.ExternalAssets = {}; 

	// test
	var navController = jomv3.controllers.NavigationController.getInstance();

	var assetsController = jomv3.controllers.AssetsController.getInstance();
	assetsController.addDomain('test');

	var roundThumb = new jomv3.views.elements.RoundThumb(200, new goog.math.Coordinate(600, 400), jomv3.views.elements.RoundThumb.ClassName.FLASH);
	goog.dom.appendChild(document.body, roundThumb.domElement);

	var uiSpinner = new jomv3.views.elements.UISpinner(100,'red',.6);
	goog.dom.appendChild(document.body, uiSpinner.domElement);

	var fermatSpiral = new jomv3.fx.FermatSpiral();
	var dotsInfo = fermatSpiral.generate(100, jomv3.fx.FermatSpiral.GOLDEN_ANGLE, 24, 12, 20);

	var dotsWrapper = goog.dom.createDom('div');
	goog.style.setStyle(dotsWrapper, 'position', 'absolute');
	goog.dom.appendChild(document.body, dotsWrapper);
	goog.style.setPosition(dotsWrapper, 300, 300);

	goog.array.forEach(dotsInfo, function(dotInfo, index) {
		var dot = goog.dom.createDom('div', 'round');
		var dotX = dotInfo.x - dotInfo.radius;
		var dotY = dotInfo.y - dotInfo.radius;
		var dotSize = dotInfo.diameter;
		goog.style.setStyle(dot, {'position': 'absolute', 'left': dotX+'px', 'top': dotY+'px', 'width': dotSize+'px', 'height': dotSize+'px', 'background': jomv3.utils.getRandomCssColor()});
		goog.dom.appendChild(dotsWrapper, dot);
	}, this);

	//
	var manifest = [
		{'id':'navigation-settings', 'src':jomv3.ASSETS_PATH+'json/navigation-settings.json'},
		{'id':'randomImage1', 'src':jomv3.ASSETS_PATH+'images/sun_corona.jpg'},
		{'id':'randomImage2', 'src':jomv3.ASSETS_PATH+'images/paper-texture.jpg'}
	];

	var loaderQueue = assetsController.createAssetsLoader(manifest, 'settings');

	loaderQueue.addEventListener("fileload", goog.bind(function(e) {
		console.log('fileload', e);
	}, this));

	loaderQueue.addEventListener("fileprogress", goog.bind(function(e) {
		console.log('fileprogress', e);
	}, this));

 	loaderQueue.addEventListener("complete", goog.bind(function(e) {
 		navController.init();
	}, this));

	loaderQueue.load();

	//
	goog.events.listen(roundThumb.domElement, 'click', function(e) {
		var viewportSize = goog.dom.getViewportSize();

		var swftitle = 'Pacmad Level Editor';
		var swfurl = jomv3.ASSETS_PATH + 'swf/projects/pacmad/level_editor.swf';
		var swfwidth = 640;
		var swfheight = 740;
		var swfversion = '9.0.0';
		var link = 'popup-flash.php'+'?swftitle='+swftitle+'&swfurl='+swfurl+'&swfwidth='+swfwidth+'&swfheight='+swfheight+'&swfversion='+swfversion;
		goog.window.open(link, {
			'width': swfwidth,
			'height': swfheight + 40,
			'left': (window.screenLeft || window.screenX) + (viewportSize.width - swfwidth)/2,
			'top': (window.screenTop || window.screenY) + (viewportSize.height - swfheight)/2,
			'toolbar': false,
			'scrollbars': false,
			'statusbar': false,
			'menubar': false,
			'resizable': false
		});
	}, false, this);

	//
	var draggableCursor = jomv3.utils.addDraggableCursor(document.body);
	//draggableCursor.remove();
*/
	//
	this.container = goog.dom.createDom('div', null, [
			this.outerDom = goog.dom.createDom('div', 'outer', [
				this.innerDom = goog.dom.createDom('div', 'inner')
				])
		]);
	
	goog.style.setStyle(this.container, {'width': '100%', 'height': '100%'});
	goog.style.setStyle(this.outerDom, {'width': '80%', 'height': '80%'});

	var numInnerBoxes = 100;
	var innerBoxWidth = 200;
	var totalWidth = innerBoxWidth * numInnerBoxes;
	goog.style.setStyle(this.innerDom, {'width': totalWidth + 'px', 'height': '200%', 'background': '#333'});

	for(var i = 0; i < numInnerBoxes; ++i) {
		var div = goog.dom.createDom('div');
		goog.style.setStyle(div, {'display': 'inline-block', 'vertical-align': 'top', 'width': innerBoxWidth + 'px', 'height': Math.round(Math.random()*100)+'%', 'background': jomv3.utils.getRandomCssColor()});

		goog.dom.appendChild(this.innerDom, div);
	}

	goog.dom.appendChild(document.body, this.container);

	this.scrollBarV = new jomv3.fx.DummyScrollBar(this.outerDom, this.innerDom, this.container, jomv3.fx.DummyScrollBar.Direction.VERTICAL, {
		layout: 'right',
		sliderWidth: 50,
		sliderHeight: '100%',
		easeWhenJump: true,
		onActiveScrollCallback: goog.bind(onActiveDummyScroll, this)
	});

	goog.style.setStyle(this.scrollBarV.domElement, 'position', 'absolute');

	this.scrollBarH = new jomv3.fx.DummyScrollBar(this.outerDom, this.innerDom, this.container, jomv3.fx.DummyScrollBar.Direction.HORIZONTAL, {
		layout: 'bottom',
		sliderWidth: '100%',
		sliderHeight: 50,
		easeWhenJump: true,
		onActiveScrollCallback: goog.bind(onActiveDummyScroll, this)
	});

	goog.style.setStyle(this.scrollBarH.domElement, 'position', 'absolute');

	//
	this.nested = goog.dom.createDom('div', null, [
		this.outerNestedDom = goog.dom.createDom('div', 'outer', [
			this.innerNestedDom = goog.dom.createDom('div', 'inner')
			])
		]);
	goog.style.setStyle(this.nested, {'position': 'absolute', 'left': '100px', 'top': '100px'});
	goog.style.setStyle(this.outerNestedDom, {'width': '300px', 'height': '300px', 'outline': '2px solid black'});
	goog.style.setStyle(this.innerNestedDom, {'width': '100%', 'height': '1000px', 'background': '-webkit-linear-gradient(green, blue)'});

	goog.dom.appendChild(this.innerDom, this.nested);

	this.nestedScrollBarV = new jomv3.fx.DummyScrollBar(this.outerNestedDom, this.innerNestedDom, this.nested, jomv3.fx.DummyScrollBar.Direction.VERTICAL, {
		layout: 'right',
		sliderWidth: 20,
		ease: .2,
		easeWhenMouseWheel: true,
		easeWhenJump: true
	});

	goog.style.setStyle(this.nestedScrollBarV.domElement, 'position', 'absolute');

  function onActiveDummyScroll() {
  	this.zyngaScroller.scrollTo(this.outerDom.scrollLeft, this.outerDom.scrollTop);
  }

  function onDown(e) {
  	if(jomv3.fx.DummyScrollBar.Manager.isScrolling()) return false;

	  var ev = e.getBrowserEvent();
	  var touches = goog.userAgent.MOBILE ? ev.touches : [{'pageX': ev.clientX, 'pageY': ev.clientY}];

	  this.zyngaScroller.doTouchStart(touches, ev.timeStamp);

	  goog.events.listen(document, ['touchmove', 'mousemove'], onMove, false, this);
	  goog.events.listen(document, ['touchend', 'mouseup'], onUp, false, this);

	  this.scrollBarH.stopAnimating();
	  this.scrollBarV.stopAnimating();
  };

  function onMove(e) {
	  var ev = e.getBrowserEvent();
	  var touches = goog.userAgent.MOBILE ? ev.touches : [{'pageX': ev.clientX, 'pageY': ev.clientY}];

	  this.zyngaScroller.doTouchMove(touches, ev.timeStamp);
  };

  function onUp(e) {
	  var ev = e.getBrowserEvent();
	  this.zyngaScroller.doTouchEnd(ev.timeStamp);

	  goog.events.unlisten(document, ['touchmove', 'mousemove'], onMove, false, this);
	  goog.events.unlisten(document, ['touchend', 'mouseup'], onUp, false, this);
  };

  var zyngaScrollerOptions = {
  	locking: true
  };

  this.zyngaScroller = new Scroller(goog.bind(function(left, top) {
  	this.outerDom.scrollLeft = left;
  	this.outerDom.scrollTop = top;
  }, this), zyngaScrollerOptions);
 
  goog.events.listen(this.outerDom, ['touchstart', 'mousedown'], onDown, false, this);

  var self = this;

	var outerDomSize = goog.style.getSize(self.outerDom);
	var innerDomSize = goog.style.getSize(self.innerDom);
	self.zyngaScroller.setDimensions(outerDomSize.width, outerDomSize.height, innerDomSize.width, innerDomSize.height);

	//
	document.addEventListener('touchstart', function(e) {
		e.preventDefault();
	});

	window.addEventListener('resize', function(e) {
		var outerDomSize = goog.style.getSize(self.outerDom);
		var innerDomSize = goog.style.getSize(self.innerDom);
		self.zyngaScroller.setDimensions(outerDomSize.width, outerDomSize.height, innerDomSize.width, innerDomSize.height);
	});
};


/**
 * Global variables getter & setter
 */
jomv3.GET_VAR = function(key) {
  return jomv3.VARS[key];
};


jomv3.SET_VAR = function(key, val) {
  jomv3.VARS[key] = val;
};
