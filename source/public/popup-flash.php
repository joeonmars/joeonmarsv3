<?php
	if(isset($_GET['swftitle'])) {
		$swftitle = $_GET['swftitle'];
	}else {
		$swftitle = '';
	}

	if(isset($_GET['swfurl'])) {
		$swfurl = $_GET['swfurl'];
	}else {
		$swfurl = '';
	}

	if(isset($_GET['swfwidth'])) {
		$swfwidth = $_GET['swfwidth'];
	}else {
		$swfwidth = 0;
	}

	if(isset($_GET['swfheight'])) {
		$swfheight = $_GET['swfheight'];
	}else {
		$swfheight = 0;
	}

	if(isset($_GET['swfversion'])) {
		$swfversion = $_GET['swfversion'];
	}else {
		$swfversion = '9.0.0';
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1">

		<title>Joe on Mars - Now Playing "<?php echo $swftitle; ?>"</title>

		<link rel="icon" type="image/x-icon" href="assets/images/favicon.ico"/>
		<link rel="stylesheet" href="assets/css/popup-flash.css" media="screen"/>
		
		<script type="text/javascript" src="assets/js/popupflash.js"></script>
	</head>

	<body>

		<div id="flash-wrapper">
		</div>
		<div id="footer">
		</div>

		<script type="text/javascript">
			jomv3.popupflash("<?php echo $swfurl; ?>", "<?php echo $swfwidth; ?>", "<?php echo $swfheight; ?>", "<?php echo $swfversion; ?>");
		</script>

		<noscript>
			<div class="headline">CHANGE THE SCRIPT.</div>
			<div class="subheadline">You need to enable Javascript to view this site.</div>
		</noscript>

	</body>
</html>