// Tracking
var _gaq = [];
_gaq.push = function(){};
var dcsMultiTrack = function(){};

var Modernizr = {};
Modernizr.audio = function() {};
Modernizr.video = function() {};
Modernizr.canvas = function() {};
Modernizr.csstransitions = function() {};
Modernizr.csstransforms = function() {};
Modernizr.csstransforms3d = function() {};

// Animation
var TweenMax = function(target, duration, vars) {};
TweenMax.to = function(target, duration, vars) {};
TweenMax.from = function(target, duration, vars) {};
TweenMax.fromTo = function(target, duration, fromVars, toVars) {};
TweenMax.killTweensOf = function(target, vars) {};
TweenMax.getTweensOf = function(target) {};
TweenMax.progress = function(a) {};
TweenMax.play = function(a, b) {};
TweenMax.resume = function(a, b) {};
TweenMax.pause = function(a, b) {};
TweenMax.restart = function(a, b) {};
TweenMax.clear = function(a) {};
TweenMax.staggerFromTo = function(b, c, h, d, f, e, g, u) {};
TweenMax.staggerTo = function(d, c, b, f, h, e, K, I, n) {};
TweenMax.isTweening = function(b) {};
TweenMax.delayedCall = function(a, b, c, d, e) {};
TweenMax.killDelayedCallsTo = function(a) {};

var TimelineMax = function(a) {};
TimelineMax.append = function(a, b) {};
TimelineMax.play = function(a, b) {};
TimelineMax.resume = function(a, b) {};
TimelineMax.pause = function(a, b) {};

var Elastic = {};
Elastic.easeOut = function(){};

var Expo = {};
Expo.easeIn = function(){};
Expo.easeOut = function(){};

var Sine = {};
Sine.easeIn = function(){};
Sine.easeInOut = function(){};
Sine.easeOut = function(){};

var Strong = {};
Strong.easeOut = function(){};
Strong.easeInOut = function(){};

var Back = {};
Back.easeOut = function(){};
Back.easeInOut = function(){};

var Linear = {};
Linear.ease = function(){};
Linear.easeNone = function(){};

var createjs = {};
createjs.Stage = function(canvas){};
createjs.Stage.mouseEnabled = {};
createjs.Stage.addChild = function(a){};
createjs.Stage.addChildAt = function(a, b){};
createjs.Stage.getChildIndex = function(a){};
createjs.Stage.setChildIndex = function(a, b){};
createjs.Stage.swapChildren = function(a, b){};
createjs.Stage.removeAllChildren = function(){};
createjs.Stage.clear = function(){};
createjs.Stage.update = function(){};

createjs.PreloadJS = function(){};
createjs.PreloadJS.IMAGE = function(){};
createjs.PreloadJS.loadFile = function(a, b){};
createjs.PreloadJS.loadManifest = function(a, b){};
createjs.PreloadJS.setPaused = function(boolean){};
createjs.PreloadJS.getResult = function(a){};
createjs.PreloadJS.onComplete = function(e){};
createjs.PreloadJS.onProgress = function(e){};
createjs.PreloadJS.onFileLoad = function(e){};
createjs.PreloadJS.onError = function(e){};

createjs.SpriteSheetUtils = function(){};
createjs.SpriteSheetUtils.mergeAlpha = function(a, b){};
createjs.SpriteSheet = function(a){};

createjs.BitmapAnimation = function(a){};
createjs.BitmapAnimation.x = {};
createjs.BitmapAnimation.y = {};
createjs.BitmapAnimation.scaleX = {};
createjs.BitmapAnimation.scaleY = {};
createjs.BitmapAnimation.alpha = {};
createjs.BitmapAnimation.spriteSheet = {};
createjs.BitmapAnimation.currentFrame = {};
createjs.BitmapAnimation.currentAnimation = {};
createjs.BitmapAnimation.visible = {};
createjs.BitmapAnimation.mouseEnabled = {};
createjs.BitmapAnimation.play = function(){};
createjs.BitmapAnimation.stop = function(){};
createjs.BitmapAnimation.gotoAndPlay = function(a){};
createjs.BitmapAnimation.gotoAndStop = function(a){};
createjs.BitmapAnimation.onAnimationEnd = function(){};
createjs.BitmapAnimation.onTick = function(){};

createjs.Ticker = function(){};
createjs.Ticker.useRAF = function(){};
createjs.Ticker.setFPS = function(a){};
createjs.Ticker.addDomListener = function(a){};
createjs.Ticker.removeListener = function(a){};

var google = {};

google.maps = function(){};
google.maps.Map = function(a, b){};
google.maps.Map.getPov = function(){};
google.maps.Map.getPosition = function(){};
google.maps.Map.setCenter = function(a){};
google.maps.setStreetView = function(a){};
google.maps.fitBounds = function(a){};
google.maps.MapTypeId.HYBRID = function(){};

google.maps.LatLng = function(a, b){};
google.maps.LatLng.lat = function(){};
google.maps.LatLng.lng = function(){};

google.maps.StreetViewPanorama = function(a, b) {};
google.maps.StreetViewPanorama.set = function(a, b){};
google.maps.StreetViewPanorama.getPov = function(){};
google.maps.StreetViewPanorama.getPosition = function(){};
google.maps.StreetViewPanorama.setPov = function(a){};
google.maps.StreetViewPanorama.setPosition = function(a){};
google.maps.StreetViewPanorama.getPano = function(){};
google.maps.StreetViewPanorama.setPano = function(a){};
google.maps.StreetViewPanorama.getLinks = function(){};

google.maps.StreetViewService = function(){};
google.maps.StreetViewService.getPanoramaByLocation = function(a, b, c){};
google.maps.StreetViewStatus = function(){};
google.maps.StreetViewStatus.OK = function(){};
google.maps.geometry = function(){};
google.maps.geometry.spherical = function(){};
google.maps.geometry.spherical.computeHeading = function(a, b){};

google.maps.Rectangle = function(a){};
google.maps.LatLngBounds = function(a, b){};

google.maps.Marker = function(a){};
google.maps.Marker.setMap = function(a){};
google.maps.Marker.setVisible = function(a){};
google.maps.Marker.setShadow = function(a){};
google.maps.Marker.setIcon = function(a){};
google.maps.Marker.setTitle = function(a){};
google.maps.Marker.getIcon = function(){};
google.maps.Marker.getTitle = function(){};

google.maps.event = function(){};
google.maps.event.addListener = function(a, b ,c){};
google.maps.event.addDomListener = function(a, b ,c){};
google.maps.event.removeListener = function(a){};
google.maps.event.clearListeners = function(a, b){};
google.maps.event.clearInstanceListeners = function(a){};
google.maps.event.trigger = function(a, b){};

google.maps.OverlayView = function(){};
google.maps.OverlayView.setMap = function(a){};
google.maps.OverlayView.show = function(){};
google.maps.OverlayView.hide = function(){};
google.maps.OverlayView.draw = function(){};
google.maps.OverlayView.onAdd = function(){};
google.maps.OverlayView.onRemove = function(){};
google.maps.OverlayView.getPanes = function(){};
google.maps.OverlayView.getProjection = function(){};

google.maps.MapCanvasProjection = function(){};
google.maps.MapCanvasProjection.fromLatLngToDivPixel = function(a){};

var swfobject = {};

swfobject.embedSWF = function() {};
swfobject.removeSWF = function() {};

var soundManager = {};

soundManager.setup = function () {};
soundManager.createSound = function (options) {};

var SMSound = {};
SMSound.loaded = {};
SMSound.play = function() {};
SMSound.stop = function() {};
SMSound.destruct = function() {};
