var fs = require('fs');
var assert = require('assert');

var recurseDirectory = function (path, callback) {
	// Assert that the path is a directory
	assert.ok(fs.statSync(path).isDirectory());

	visitDirectory(path);

	function visitDirectory (path) {
		var fileNames = fs.readdirSync(path);
		for (var index = 0; index < fileNames.length; index++) {
			var fileName = fileNames[index];
			var childPath = path + '/' + fileName;
			var stat = fs.statSync(childPath);
			if (stat.isFile()) {
				callback(childPath);
			} else if (stat.isDirectory()) {
				visitDirectory(childPath);
			}
		}
	}
};

module.exports.recurseDirectory = recurseDirectory;