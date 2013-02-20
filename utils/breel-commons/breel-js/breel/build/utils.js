goog.provide('breel.build.utils');

goog.require('node.fs');
goog.require('node.assert');

breel.build.utils.recurseDirectory = function (path, callback) {
	// Assert that the path is a directory
	node.assert.ok(node.fs.statSync(path).isDirectory());

	visitDirectory(path);

	function visitDirectory (path) {
		var fileNames = node.fs.readdirSync(path);
		for (var index = 0; index < fileNames.length; index++) {
			var fileName = fileNames[index];
			var childPath = path + '/' + fileName;
			var stat = node.fs.statSync(childPath);
			if (stat.isFile()) {
				callback(childPath);
			} else if (stat.isDirectory()) {
				visitDirectory(childPath);
			}
		}
	}
};