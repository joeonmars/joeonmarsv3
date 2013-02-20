#!/usr/bin/env node

var fs = require('fs');

var utils = require('./breel/node/utils');
var closure = require('./breel/node/closure');

var outputFileName = 'breel/deps.js';
var output = '';

if (fs.existsSync(outputFileName)) {
	fs.unlinkSync(outputFileName);
}

console.log(process.cwd() + '/goog');

utils.recurseDirectory('breel', function (path) {
	var dependency = closure.calcDeps(path, process.cwd() + '/goog');
	if (dependency) {
		output += 'goog.addDependency("' +
			dependency.fileName +
			'", ' +
			JSON.stringify(dependency.provides) +
			', ' +
			JSON.stringify(dependency.requires) +
			');\n';
	}
	console.log(path);
});

fs.writeFileSync(outputFileName, output, 'utf8');