/**
 * Core project class.
 * @constructor
 */

goog.provide('joeonmars');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.xml');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.userAgent');
goog.require('joeonmars.Utils');

joeonmars.VARS = {};

joeonmars.ASSETS_URL = window['assetsPath'];
joeonmars.SHARE_URL = 'http://www.fanjiangdesign.com';

/**
 * The main placeholder of assets
 */
joeonmars.assets = {};

joeonmars.main = null;
joeonmars.utils = joeonmars.Utils.getInstance();


/**
 * Global variables getter & setter
 */
joeonmars.GET_VAR = function(key) {
  return joeonmars.VARS[key];
};


joeonmars.SET_VAR = function(key, val) {
  joeonmars.VARS[key] = val;
};


joeonmars.getWindowSize = function() {
  return joeonmars.GET_VAR('resizeController').getWindowSize();
};


joeonmars.getText = function(textId, xmlId) {
  xmlId = xmlId || 'copy.xml';
  if (!this.cachedTexts) {
    this.cachedTexts = {};
  }
  if (!this.cachedTexts[xmlId]) {
    this.cachedTexts[xmlId] = this.processTextsXml(joeonmars.main.getAsset(xmlId));
  }
  return this.cachedTexts[xmlId][textId];
};


joeonmars.processTextsXml = function(xml) {
  var texts = {};
  var textLength = xml.getElementsByTagName('Text').length;
  for(var k = 0; k < textLength; k++) {
    var t = xml.getElementsByTagName('Text')[k];
    if(t.attributes) {
      texts[t.getAttribute('id')] = t.firstChild.data;
    }
  }
  return texts;
};


/**
 * initiate the site
 */
joeonmars.init = function() {
  this.main = joeonmars.Main.getInstance();
  this.main.init();
};


/**
 * Export getter & setters functions for possible use in the HTML
 */
goog.exportSymbol('joeonmars', joeonmars);
goog.exportProperty(joeonmars, 'GET_VAR', joeonmars.GET_VAR);
goog.exportProperty(joeonmars, 'SET_VAR', joeonmars.SET_VAR);
