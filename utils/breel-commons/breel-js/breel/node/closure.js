var assert = require('assert');
var vm = require('vm');
var path = require('path');
var fs = require('fs');

var noop = function () {};
var logger = { warn: noop, info: noop, fine: noop, finer: noop, finest: noop };
// var logger = { debug: console.log, info: console.log }; // TEMP

var init = function (options) {
	global.goog = {};
	global.CLOSURE_BASE_PATH = options.closureLibraryPath;
	global.CLOSURE_IMPORT_SCRIPT = loadScript;
	global.window = {
		setTimeout: setTimeout,
		clearTimeout: clearTimeout,
		setInterval: setInterval,
		clearInterval: clearInterval,
		console: console
	};
	global.execScript = function(code) {
		runScript(code, 'execScript');
		return null;
	};
	global.node = {};
	global.node.require = require;

	// Load base.js
  assert(options.closureLibraryPath.slice(-1) === '/', "closureLibraryPath must end with '/'");
	loadScript(options.closureLibraryPath + 'base.js', true);

	// Add node package deps
	var nodePackageNames = ['fs', 'path', 'assert', 'events', 'util'];
	for (var index = 0; index < nodePackageNames.length; index++) {
		var nodePackageName = nodePackageNames[index];
		goog.addDependency('$' + nodePackageName, ['node.' + nodePackageName], []);
	}

	// Create logger
	goog.require('goog.debug.Logger');
	logger = goog.debug.Logger.getLogger('breel.node.closure');
};

var loadScriptQueue = [];
var loadScriptIsActive = false;
var loadScriptCurrentFileName;

var loadScript = function (fileName) {
	// Node package
	var relativeFileName = path.relative(global.CLOSURE_BASE_PATH, fileName);
	if (relativeFileName.indexOf('$') === 0) {
		var nodePackageName = relativeFileName.slice(1);
		global.node[nodePackageName] = require(nodePackageName);
		return;
	}

	// Defer if locked
	if (loadScriptIsActive) {
		loadScriptQueue.push(fileName);
		var fileNameShort = loadScriptCurrentFileName.split('/').slice(-1);
		logger.fine('loadScript (deferring, current: ' + fileNameShort + ')', fileName);
		return;
	}

	logger.finer('loadScript: ' + fileName);

	// Fetch code
	fileName = path.resolve(fileName);
	var code = readFile(fileName);

	// Lock loadScript
	loadScriptCurrentFileName = fileName;
	loadScriptIsActive = true;

	// Run
	runScript(code, fileName);

	// Unlock loadScript
	loadScriptCurrentFileName = null;
	loadScriptIsActive = false;

	// Tell closure not to revisit this script
	var relativeFileName = path.relative(CLOSURE_BASE_PATH, fileName);
	goog.dependencies_.visited[relativeFileName] = true;
	goog.dependencies_.written[relativeFileName] = true;

	// Call deferred loadScripts
	while (loadScriptQueue.length > 0) {
		loadScript(loadScriptQueue.shift());
	}
};

var runScript = function (code, fileName) {
	vm.runInThisContext(code, fileName);
};

var readFile = function (fileName) {
	fileName = path.resolve(fileName);
	var code = fs.readFileSync(fileName, 'utf8');

	return code;
};

var calcDeps = function (fileName, closureBasePath) {
	if (!closureBasePath) {
		closureBasePath = global.CLOSURE_BASE_PATH || '.';
	}

	var code = readFile(fileName);

	var depStatementRE = /goog.(require|provide)\s*\(\s*('|")([a-zA-Z\.0-9_]+?)('|")\s*\)/g;

	var hasDeps = false;
	var dependency = {
		fileName: path.relative(closureBasePath, fileName),
		requires: [],
		provides: []
	};
	var matches;

	while ((matches = depStatementRE.exec(code)) !== null) {
		var method = matches[1];
		var name = matches[3];
		if (method == 'provide') {
			dependency.provides.push(name);
		} else if (method == 'require') {
			dependency.requires.push(name);
		}
		hasDeps = true;
	}

	if (hasDeps) {
		return dependency;
	}

	return null;
};

var applyDeps = function (fileName) {
	var dependency = calcDeps(fileName);
	if (dependency) {
		goog.addDependency(dependency.fileName, dependency.provides, dependency.requires);
	}
};

module.exports.init = init;
module.exports.loadScript = loadScript;
module.exports.calcDeps = calcDeps;
module.exports.applyDeps = applyDeps;