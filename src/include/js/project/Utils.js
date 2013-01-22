goog.provide('joeonmars.Utils');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.fx.css3');
goog.require('goog.fx.Transition');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('goog.math');

/**
 * @constructor
 */

joeonmars.Utils = function() {
  // check css vendors
  this.cssVendor = (function() {
    if (goog.userAgent.IE) {
      return '-ms';
    } else if (goog.userAgent.WEBKIT) {
      return '-webkit';
    } else if (goog.userAgent.OPERA) {
      return'-o';
    } else if (goog.userAgent.GECKO) {
      return '-moz';
    } else {
      return '';
    }
  })();

  // check css transform vendors
  this.transformProperty = this.cssVendor + '-transform';

  // Modernizr's detection on this isnt correct...
  this.supportTransform3d = (function() {
    return ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
  })();

  // Make it safe to use console.log in all browsers
  (function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
  {console.log();return window.console;}catch(err){return window.console={};}})());

  if (console == undefined) {
   console = {};
   console.log = function ( str ) {
     //window.alert( str );
   }
  }
  
  // usage: log('inside coolFunc',this,arguments);
  // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
  window.log = function(){
    if(self.debug){
      log.history = log.history || [];   // store logs to an array for reference
      log.history.push(arguments);
      console.log( Array.prototype.slice.call(arguments) );
    }
  };

  // a zero size object for comparing with a goog.math.Size object
  this.zeroSize = new goog.math.Size(0, 0);
  
  this.soundIsEnabled = true;
  this.allSounds = [];
};
goog.addSingletonGetter(joeonmars.Utils);


joeonmars.Utils.prototype.setCssTransform = function(element, property) {
  if(Modernizr.csstransforms) {
    goog.style.setStyle(element, this.transformProperty.replace(/^\-/, ''), property);
    element.style['transform'] = property;
  }
};


joeonmars.Utils.prototype.getCssTransformProperty = function() {
  return this.transformProperty.replace(/^\-/, '');
};


joeonmars.Utils.prototype.setDomScale = function(element, scale, disableCss3) {
  if(Modernizr.csstransforms && !disableCss3) {
    this.setCssTransform(element, 'scale(' + scale + ')');
  }else {
    goog.style.setStyle(element, 'zoom', scale * 100 + '%');
  }
};


joeonmars.Utils.prototype.setRotation = function(element, angle) {
  if(Modernizr.csstransforms) {
    this.setCssTransform(element, 'rotate('+angle+'deg)');
  }else {
    var rotation;

    if (angle >= 0) rotation = Math.PI * angle / 180;
    else rotation = Math.PI * (360+angle) / 180;

    var c = Math.cos(rotation);
    var s = Math.sin(rotation);
    element.style['filter'] = "progid:DXImageTransform.Microsoft.Matrix(M11="+c+",M12="+(-s)+",M21="+s+",M22="+c+",SizingMethod='auto expand')";
  }
};


joeonmars.Utils.prototype.setDomPosition = function(element, x, y, disableCss3) {
  if(Modernizr.csstransforms && !disableCss3) {
    var x_ = x ? x : 0;
    var y_ = y ? y : 0;

    if(this.supportTransform3d) {
      this.setCssTransform(element, 'translate3d('+x_+'px,'+y_+'px, 0px)');
    }else {
      this.setCssTransform(element, 'translate('+x_+'px,'+y_+'px)');
    }
  }else {
    if(x && y) {
      goog.style.setPosition(element, x, y);
    }else if(x) {
      goog.style.setStyle(element, 'left', x+'px');
    }else if(y) {
      goog.style.setStyle(element, 'top', y+'px');
    }
  }
};


joeonmars.Utils.prototype.fadeTo = function(element, sec, start, end, onComplete, onCompleteScope, onCompleteParams, disallowCss) {
  this.fadeToWithDelay(element, null, sec, start, end, onComplete, onCompleteScope, onCompleteParams, disallowCss);
};


joeonmars.Utils.prototype.fadeToWithDelay = function(element, delaySec, sec, start, end, onComplete, onCompleteScope, onCompleteParams, disallowCss) {
  if(!disallowCss && Modernizr.csstransitions && Modernizr.opacity) {

    var fadeAnim = new goog.fx.css3.Transition(
      element,
      sec,
      {'opacity': start},
      {'opacity': end},
      {property: 'opacity', duration: sec, timing: 'ease-out', delay: (delaySec || 0)}
    );

    goog.events.listenOnce(fadeAnim, goog.fx.Transition.EventType.FINISH, function(e) {
      goog.style.setOpacity(element, '');
      fadeAnim.dispose();
      if(goog.isFunction(onComplete)) {
        onComplete.apply(onCompleteScope || this, onCompleteParams || []);
      }
    });

    fadeAnim.play();

  }else {

    var tweenProp = {'opacity': start};

    TweenMax.to(tweenProp, sec, {
      'delay': delaySec,
      'opacity': end,
      'startAt': start,
      'immediateRender': true,
      'onUpdate':function() {
        goog.style.setOpacity(element, tweenProp['opacity']);
      },
      'onComplete': function() {
        if(end === 1) goog.style.setOpacity(element, '');

        if(goog.isFunction(onComplete)) {
          onComplete.apply(onCompleteScope || this, onCompleteParams || []);
        }
      }
    });

  }
};


joeonmars.Utils.prototype.fadeIn = function(element, sec, onComplete, onCompleteScope, onCompleteParams) {
  this.fadeInWithDelay(element, null, sec, onComplete, onCompleteScope, onCompleteParams);
};


joeonmars.Utils.prototype.fadeInWithDelay = function(element, delaySec, sec, onComplete, onCompleteScope, onCompleteParams) {
  this.fadeToWithDelay(element, delaySec, sec, 0, 1, onComplete, onCompleteScope, onCompleteParams);
};


joeonmars.Utils.prototype.fadeOut = function(element, sec, onComplete, onCompleteScope, onCompleteParams) {
  this.fadeOutWithDelay(element, null, sec, onComplete, onCompleteScope, onCompleteParams);
};


joeonmars.Utils.prototype.fadeOutWithDelay = function(element, delaySec, sec, onComplete, onCompleteScope, onCompleteParams) {
  this.fadeToWithDelay(element, delaySec, sec, 1, 0, onComplete, onCompleteScope, onCompleteParams);
};


joeonmars.Utils.prototype.tweenToPosition = function(domElement, x, y, duration, ease, onComplete, onCompleteScope, onCompleteParams) {
  var cssProp = Modernizr.csstransforms ? {'x': x, 'y': y} : {'left': x, 'top': y};
  var ease_ = ease || Strong.easeInOut;
  TweenMax.to(domElement, 1, {
    'ease': ease_,
    'css': cssProp,
    'immediateRender': true,
    'onComplete': onComplete,
    'onCompleteScope': onCompleteScope,
    'onCompleteParams': onCompleteParams
  });
};


joeonmars.Utils.prototype.getRandomCssColor = function() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}


joeonmars.Utils.prototype.getUrlParam = function(name, url) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return results[1];
};


joeonmars.Utils.prototype.parseBatchAssets = function(queueData) {
  goog.array.forEachRight(queueData, function(val) {
    var batch = val["batch"];
    if(batch) {
      goog.array.remove(queueData, val);

      var i, obj;
      for(i=batch[0]; i<=batch[1]; ++i) {
        obj = {'src':val['src']+val['fileid']+i+val['filetype'], 'id': val['fileid']+i};
        queueData.push(obj);
      }
    }
  }, this);

  return queueData;
};


joeonmars.Utils.prototype.getBatchAssets = function(prefix, numRange, aPreloader) {
  var assets = [];
  var i;
  var preloader = preloader ? preloader : joeonmars.GET_VAR('mainPreloader').preloader;
  for(i=numRange[0]; i<=numRange[1]; ++i) {
    assets.push(preloader.getResult(prefix+i));
  }
  return assets;
};


joeonmars.Utils.prototype.hasNoSize = function(element) {
  return goog.math.Size.equals(goog.style.getSize(element), this.zeroSize);
};


joeonmars.Utils.prototype.getIntegerDivisibleBy = function(val, divider){
  return Math.round(val / divider) * divider;
};


joeonmars.Utils.prototype.restoreImageSize = function(img) {
  if(!img.naturalWidth) {
    img.naturalWidth = img.width;
    img.naturalHeight = img.height;
  }else {
    img.width = img.naturalWidth;
    img.height = img.naturalHeight;  
  }
};


joeonmars.Utils.prototype.getRandomInteger = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};


joeonmars.Utils.prototype.getIOSVersion = function() {
  if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) { 
    if(/OS [2-5]_\d(_\d)? like Mac OS X/i.test(navigator.userAgent)) {  
        return 5;   
    } else if(/CPU like Mac OS X/i.test(navigator.userAgent)) {
        return 1;
    } else {
        return 6;
    }
  }else {
    return undefined;
  }
};