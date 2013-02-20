var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var closure = require('../node/closure');

var breelPath = path.resolve(__dirname, '..');

var build = {};

build.init = function (options) {

	// Process Argv Options
	var argvOptions = processArgvOptions(process.argv);
	var commandNameIsValid = (options.builders[argvOptions.commandName] !== undefined);
	if (!argvOptions.isValid || !commandNameIsValid) {
		showUsage(options, argvOptions);
		return;
	}

	// Start Closure
	closure.init({
		closureLibraryPath: options.closureLibraryPath
	});

	// B-Reel Deps
	closure.loadScript(breelPath + '/deps.js');

	// Install logger
	goog.require('breel.debug.NodeConsole');
	goog.require('goog.debug.Logger');
	nodeConsole = new breel.debug.NodeConsole();
	nodeConsole.setCapturing(true);
	var rootLogger = goog.debug.Logger.getLogger('');
	if (argvOptions.flags.v >= 3) {
		rootLogger.setLevel(goog.debug.Logger.Level.ALL);
	} else if (argvOptions.flags.v >= 2) {
		rootLogger.setLevel(goog.debug.Logger.Level.FINER);
	} else if (argvOptions.flags.v) {
		rootLogger.setLevel(goog.debug.Logger.Level.FINE);
	}

	// Calc deps for sources
	if (options.sources) {
		for (var sourceIndex = 0; sourceIndex < options.sources.length; sourceIndex++) {
			var sourcePath = process.cwd() + '/' + options.sources[sourceIndex];
			closure.applyDeps(sourcePath);
		}
	}

	// Create builder
	var builderOptions = options.builders[argvOptions.commandName];
	goog.require(builderOptions.className);
	var builderClass = eval(builderOptions.className);
	var builder = new builderClass();

	// Build
	builder.run({
		shouldWatch: (!!argvOptions.flags.w)
	});
};

var processArgvOptions = function (argv) {
	var argvOptions = {
		flags: {},
		binaryName: null,
		commandName: null,
		isValid: false
	};
	var hasPassedBinary = false;

	for (var argIndex = 0; argIndex < argv.length; argIndex++) {
		var arg = argv[argIndex];

		if (!hasPassedBinary) {
			if (arg === 'node') {
				continue;
			} else {
				argvOptions.binaryName = arg.split('/').slice(-1);
				hasPassedBinary = true;
				continue;
			}
		}

		if (arg.indexOf('-') === 0) {
			var flags = arg.slice(1).split('');
			for (var flagIndex = 0; flagIndex < flags.length; flagIndex++) {
				var flag = flags[flagIndex];
				if (argvOptions.flags[flag]) {
					argvOptions.flags[flag]++;
				} else {
					argvOptions.flags[flag] = 1;
				}
			}
			continue;
		}

		if (argvOptions.commandName === null) {
			argvOptions.commandName = arg;
			argvOptions.isValid = true;
			continue;
		} else {
			argvOptions.isValid = false;
			continue;
		}
	}

	return argvOptions;
};

var showUsage = function (options, argvOptions) {
	var binaryName = 'build.sh';
	var usage =
		'\n' +
		'      ____        ____            __\n' +
		'     / __ )      / __ \\___  ___  / /\n' +
		'    / __  ______/ /_/ / _ \\/ _ \\/ / \n' +
		'   / /_/ /_____/ _, _/  __/  __/ /  \n' +
		'  /_____/     /_/ |_|\\___/\\___/_/   \n' +
		'                                    \n' +
		'  --- B U I L D   S Y S T E M ---\n' +
		'\n' +
		'Usage: ./' + binaryName + ' <command>\n' +
		'\n' +
		'Commands:\n';

	var descriptionIndent = 30;
	function commandAndDescription (command, description) {
		var padding = '';
		while ((command.length + padding.length) < descriptionIndent) {
			padding += ' ';
		}
		return '  ' + command + padding + description;
	}

	for (var builderName in options.builders) {
		var builder = options.builders[builderName];
		usage += commandAndDescription('./' + binaryName + ' ' + builderName, builder.description) + '\n';
	}

	usage +=
		'\n' +
		'Options:\n' +
		commandAndDescription('./' + binaryName + ' <command> -w', 'watch for changes') + '\n' +
		commandAndDescription('./' + binaryName + ' <command> -v', 'verbose mode') + '\n' +
		commandAndDescription('./' + binaryName + ' <command> -vv', 'very verbose mode') + '\n';

	console.log(usage);
};

module.exports = build;