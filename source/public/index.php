<?php include 'include/head.php'; ?>

		<link rel="stylesheet" href="<?php echo $CDN_URL; ?>/assets/css/generated/main.css" media="screen"/>

		<script>
			// Share redirect
			if(window.location.pathname != '/') window.location = '/#' + window.location.pathname;
			if((window.devicePixelRatio === undefined ? 1 : window.devicePixelRatio) > 1) document.cookie='HTTP_IS_RETINA=1;path=/';
		</script>
		
		<script type="text/javascript" src="<?php echo $CDN_URL; ?>/assets/js/thirdparty/modernizr_v2.6.2.js"></script>
		<script type="text/javascript" src="<?php echo $CDN_URL; ?>/assets/js/thirdparty.min.js"></script>
		<script type="text/javascript" src="<?php echo $CDN_URL; ?>/assets/js/main.js"></script>
	</head>
	<body>

		<script type="text/javascript">
			jomv3.main();
		</script>

		<noscript>
			<div class="headline">CHANGE THE SCRIPT.</div>
			<div class="subheadline">You need to enable Javascript to view this site.</div>
		</noscript>

	</body>
</html>
