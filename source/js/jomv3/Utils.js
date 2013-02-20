goog.provide('jomv3.Utils');

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

jomv3.Utils = function() {
  // check css vendors
  this.cssVendor = (function() {
    if (goog.userAgent.IE) {
      return '-ms';
    } else if (goog.userAgent.WEBKIT) {
      return '-webkit';
    } else if (goog.userAgent.OPERA) {
      return '-o';
    } else if (goog.userAgent.GECKO) {
      return '-moz';
    } else {
      return '';
    }
  })();

  // check css transform vendors
  this.transformProperty = this.cssVendor + '-transform';
  this.transformStyleAttribute = this.cssVendor.replace(/^\-/, '') + 'Transform';
  this.transformStyleAttribute[0].toUpperCase();

  // Modernizr's detection on this isnt correct...
  this.supportTransform3d = (function() {
    return ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
  })();

  // a zero size object for comparing with a goog.math.Size object
  this.zeroSize = new goog.math.Size(0, 0);
};
goog.addSingletonGetter(jomv3.Utils);


jomv3.Utils.prototype.addLeadingZero = function(integer) {
  return (integer<10) ? '0'+integer : integer;
};


jomv3.Utils.prototype.setCssTransform = function(element, property) {
  if(Modernizr.csstransforms) {
    element.style[this.transformStyleAttribute] = property;
    element.style['transform'] = property;
  }
};


jomv3.Utils.prototype.setDomScale = function(element, scale, disableCss3) {
  if(Modernizr.csstransforms && !disableCss3) {
    this.setCssTransform(element, 'scale(' + scale + ')');
  }else {
    goog.style.setStyle(element, 'zoom', scale * 100 + '%');
  }
};


jomv3.Utils.prototype.setRotation = function(element, angle) {
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


jomv3.Utils.prototype.getCssTransformProperty = function() {
  return this.transformProperty.replace(/^\-/, '');
};


jomv3.Utils.prototype.setDomScale = function(element, scale, disableCss3) {
  if(Modernizr.csstransforms && !disableCss3) {
    this.setCssTransform(element, 'scale(' + scale + ')');
  }else {
    goog.style.setStyle(element, 'zoom', scale * 100 + '%');
  }
};


jomv3.Utils.prototype.setRotation = function(element, angle) {
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


jomv3.Utils.prototype.setDomPosition = function(element, x, y, disableCss3) {
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


jomv3.Utils.prototype.fadeTo = function(element, delaySec, sec, start, end, easing, onComplete, onCompleteScope, onCompleteParams) {
  var tweenProp = {'opacity': start};

  TweenMax.to(tweenProp, sec, {
    'delay': delaySec,
    'opacity': end,
    'startAt': start,
    'ease': easing || Strong.easeOut,
    'onUpdate':function() {
      goog.style.setOpacity(element, tweenProp['opacity']);
    },
    'onComplete': function() {
      if(end === 1 && !Modernizr.opacity) goog.style.setOpacity(element, '');

      if(goog.isFunction(onComplete)) {
        onComplete.apply(onCompleteScope || this, onCompleteParams || []);
      }
    }
  });

  return tweenProp;
};


jomv3.Utils.prototype.fadeIn = function(element, delaySec, sec, easing, onComplete, onCompleteScope, onCompleteParams) {
  return this.fadeTo(element, delaySec, sec, 0, 1, easing, onComplete, onCompleteScope, onCompleteParams);
};


jomv3.Utils.prototype.fadeOut = function(element, delaySec, sec, easing, onComplete, onCompleteScope, onCompleteParams) {
  return this.fadeTo(element, delaySec, sec, 1, 0, easing, onComplete, onCompleteScope, onCompleteParams);
};


jomv3.Utils.prototype.tweenToPosition = function(domElement, x, y, duration, ease, onComplete, onCompleteScope, onCompleteParams) {
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


jomv3.Utils.prototype.getRandomCssColor = function() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};


jomv3.Utils.prototype.getRandomString = function(length) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = length || 8;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }

  return randomstring;
};


jomv3.Utils.prototype.getUrlParam = function(name, url) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return results[1];
};


jomv3.Utils.prototype.parseBatchAssets = function(queueData) {
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


jomv3.Utils.prototype.getBatchAssets = function(prefix, numRange, aPreloader) {
  var assets = [];
  var i;
  var preloader = preloader ? preloader : jomv3.GET_VAR('mainPreloader').preloader;
  for(i=numRange[0]; i<=numRange[1]; ++i) {
    assets.push(preloader.getResult(prefix+i));
  }
  return assets;
};


jomv3.Utils.prototype.hasNoSize = function(element) {
  return goog.math.Size.equals(goog.style.getSize(element), this.zeroSize);
};


jomv3.Utils.prototype.getIntegerDivisibleBy = function(val, divider){
  return Math.round(val / divider) * divider;
};


jomv3.Utils.prototype.restoreImageSize = function(img) {
  if(!img.naturalWidth) {
    img.naturalWidth = img.width;
    img.naturalHeight = img.height;
  }else {
    img.width = img.naturalWidth;
    img.height = img.naturalHeight;  
  }
};