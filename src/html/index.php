<?php
  $assetsPath = 'assets/';
?>

<!DOCTYPE html>
<html>

	<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
     <meta property="og:type"                 content="website"> 
     <meta property="og:url"                  content="http://www.joeonmars.com/"> 
     <meta property="og:image"                content="http://www.joeonmars.com/assets/images/sharethumbnail.jpg">
     <meta property="og:title"                content="joeonmars / Joe Zhou's Portfolio">
     <meta property="og:description"          content="joeonmars / Joe Zhou's Portfolio Description"> 
		<title>joeonmars / Joe Zhou's Portfolio</title>

    <script type="text/javascript">
      window.assetsPath = '<?php echo $assetsPath; ?>';
    </script>

		<meta charset="utf-8">
    <meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		<meta name="description" content="" />
		
		<meta property="og:title" content="" />
		<meta property="og:description" content="" />
		<meta property="og:image" content="<?php echo $assetsPath; ?>images/share.png" />

    <link rel="stylesheet" href="<?php echo $assetsPath; ?>css/main.css" media="screen"/>
  </head>

  <body>
    <script type="text/javascript">
      document.body.style.display = 'none';
    </script>
    
    <div id="content-wrapper">
      <div id="section-wrapper"></div>
      <div id="footer-wrapper">
        <div id="footer-info"></div>
        <div id="footer-navigation"></div>
      </div>
    </div>

    <div id="orientation-wrapper"></div>

    <div id="hidden-dom-wrapper">
      <!-- put css spritesheets here to preload with the document -->
    </div>

		<!-- COMPILE -->
    <!-- google closure -->
		<script type="text/javascript" src="../include/closure/goog/base.js"></script>
    <script>
    	goog.require('goog.array');
      goog.require('goog.dom');
      goog.require('goog.events');
      goog.require('goog.events.EventTarget');
      goog.require('goog.fx.Animation');
      goog.require('goog.style');
      goog.require('goog.userAgent');
      goog.require('goog.userAgent.flash');
    </script>

    <!-- third-party js -->
    <script type="text/javascript" src="../include/js/libs/third-party/modernizr.custom.js"></script>
    <script type="text/javascript" src="../include/js/libs/third-party/consoleshim.min.js"></script>
    <script type="text/javascript" src="../include/js/libs/third-party/greensock/TweenMax.min.js"></script>
    <script type="text/javascript" src="../include/js/libs/third-party/createjs/preloadjs-0.2.0.min.js"></script>
    <script type="text/javascript" src="../include/js/libs/third-party/zynga-scroller/Animate.js"></script>
    <script type="text/javascript" src="../include/js/libs/third-party/zynga-scroller/EasyScroller.js"></script>
    <script type="text/javascript" src="../include/js/libs/third-party/zynga-scroller/Scroller.js"></script>

		<!-- project js -->
    <script type="text/javascript" src="../include/js/project/Utils.js"></script>
    <script type="text/javascript" src="../include/js/project/joeonmars.js"></script>
    
    <script type="text/javascript" src="../include/js/project/events/OverlayEvent.js"></script>
    <script type="text/javascript" src="../include/js/project/events/SectionEvent.js"></script>
    <script type="text/javascript" src="../include/js/project/events/ScrollEvent.js"></script>

    <script type="text/javascript" src="../include/js/project/fx/PageScroller.js"></script>

    <script type="text/javascript" src="../include/js/project/views/elements/UISpinner.js"></script>
    <script type="text/javascript" src="../include/js/project/views/elements/RoundThumb.js"></script>

    <script type="text/javascript" src="../include/js/project/views/MainComponent.js"></script>
    <script type="text/javascript" src="../include/js/project/views/MainPreloader.js"></script>
    <script type="text/javascript" src="../include/js/project/views/Overlay.js"></script>
    <script type="text/javascript" src="../include/js/project/views/Header.js"></script>
    <script type="text/javascript" src="../include/js/project/views/Footer.js"></script>
    <script type="text/javascript" src="../include/js/project/views/artworks/ArtworkPage.js"></script>
    <script type="text/javascript" src="../include/js/project/views/artworks/Artwork.js"></script>
    <script type="text/javascript" src="../include/js/project/views/artworks/ArtworkIntro.js"></script>
    <script type="text/javascript" src="../include/js/project/views/artworks/ArtworkThumbnails.js"></script>
    <script type="text/javascript" src="../include/js/project/views/artworks/ArtworkComponent.js"></script>
    <script type="text/javascript" src="../include/js/project/views/sections/Section.js"></script>
    <script type="text/javascript" src="../include/js/project/views/sections/DetailSection.js"></script>
    <script type="text/javascript" src="../include/js/project/views/sections/AboutSection.js"></script>
    <script type="text/javascript" src="../include/js/project/views/sections/HomeSection.js"></script>
    <script type="text/javascript" src="../include/js/project/views/sections/GraphicDesignSection.js"></script>
    <script type="text/javascript" src="../include/js/project/views/sections/SideDesignSection.js"></script>

    <script type="text/javascript" src="../include/js/project/controllers/NavigationController.js"></script>
    <script type="text/javascript" src="../include/js/project/controllers/ResizeController.js"></script>
    <script type="text/javascript" src="../include/js/project/controllers/SectionController.js"></script>
    <script type="text/javascript" src="../include/js/project/controllers/ShareController.js"></script>
		<script type="text/javascript" src="../include/js/project/controllers/TrackingController.js"></script>

    <script type="text/javascript" src="../include/js/project/Main.js"></script>
		<!-- END COMPILE -->

		<script type="text/javascript">
			joeonmars.init();
		</script>
		
  </body>

</html>