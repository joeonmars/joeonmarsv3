<?php

$tempDir = 'setup-project-temp';

function downloadDirViaCurl ($dirPath) {
	global $tempDir;

	if ($dirPath !== '.') {
		echo "mkdir -p $tempDir/$dirPath\n";
	}

	$dirHandle = opendir($dirPath);
	$skipFilePaths = array('.', '..', 'index.php', '.DS_Store');
	while (false !== ($filePath = readdir($dirHandle))) {
		if (in_array($filePath, $skipFilePaths) === false) {
			$fullPath = ($dirPath == '.') ? $filePath : ($dirPath . '/' . $filePath);
			if (is_dir($fullPath)) {
				downloadDirViaCurl($fullPath);
			} else {
				downloadViaCurl($fullPath);
			}
		}
	}
};

function downloadViaCurl ($filePath) {
	global $tempDir;

	echo 'curl -s ' . $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'] . '?fetch=' . urlencode($filePath) . " > $tempDir/$filePath\n";
}

function deliverFile ($filePath) {
	echo file_get_contents($filePath);
}

function main () {
	global $tempDir;

	echo "#!/bin/sh\n\n";
	echo "mkdir -p $tempDir\n\n";
	echo "echo \"Downloading files...\"\n\n";
	downloadDirViaCurl('.');
	echo "chmod +x $tempDir/setup-project.sh\n";
	echo "(exec 0</dev/tty $tempDir/setup-project.sh $tempDir/assets/)\n";
	echo "rm -r $tempDir/";
}

if (isset($_GET['fetch'])) {
	deliverFile(urldecode($_GET['fetch']));
} else {
	main();
}

?>