<?php

$HOST_URL = $_SERVER['SERVER_NAME'];
$CDN_URL_MAP = array(
    "joeonmars.com" => "",
    "joeonmarsv3.com" => "",
);
$CDN_URL = '';

 foreach ($CDN_URL_MAP as $host => $cdn) {
 	if ($host == $HOST_URL) {
 		$CDN_URL = $cdn;
 		break;
 	}
 }

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">

		<title>Joe on Mars</title>
		<meta name="description" content="" />
		<meta name="keywords" content="joeonmars, joe, joe on mars, yixiong, yixong zhou, web developer, interactive, designer" />
		