goog.provide('jomv3.popupflash');

goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.style');
goog.require('goog.ui.media.FlashObject');

jomv3.popupflash = function(swfurl, swfwidth, swfheight, swfversion) {
	console.log(swfurl, swfwidth, swfheight, swfversion);

	this.flashWrapper = goog.dom.getElement('flash-wrapper');
	this.footer = goog.dom.getElement('footer');
	this.footerHeight = goog.style.getSize(this.footer).height;

	goog.style.setStyle(this.footer, {'min-width': swfwidth+'px'});
	goog.style.setStyle(this.flashWrapper, {'width': swfwidth+'px', 'height': swfheight+'px'});
	goog.style.setStyle(document.body, {'min-width':swfwidth+'px', 'min-height':swfheight+this.footerHeight+'px'});

  this.flashObj = new goog.ui.media.FlashObject(swfurl);
  this.flashObj.setSize(swfwidth+'px', swfheight+'px');
  this.flashObj.setAllowScriptAccess('always');
  this.flashObj.setRequiredVersion(swfversion);
  this.flashObj.setFlashVar('menu', 'false');
  this.flashObj.render(this.flashWrapper);

  this.viewportSizeMonitor = new goog.dom.ViewportSizeMonitor();
  goog.events.listen(this.viewportSizeMonitor, goog.events.EventType.RESIZE, function() {
  	var windowSize = this.viewportSizeMonitor.getSize();
  	goog.style.setStyle(this.flashWrapper, 'margin-top', Math.max(0, (windowSize.height - this.footerHeight - parseInt(swfheight))*.5) + 'px');
  }, false, this);
};