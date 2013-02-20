goog.provide('breel.debug.NodeConsole');

goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger.Level');
goog.require('goog.debug.Formatter');

/**
 * Create and install a log handler that logs to window.console if available
 * @constructor
 */
breel.debug.NodeConsole = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);

  /**
   * Formatter for formatted output.
   * @type {!breel.debug.NodeConsole.TextFormatter}
   * @private
   */
  this.formatter_ = new breel.debug.NodeConsole.TextFormatter();
  this.formatter_.showAbsoluteTime = false;
  this.formatter_.showExceptionText = false;

  this.isCapturing_ = false;
  this.logBuffer_ = '';

  /**
   * Loggers that we shouldn't output.
   * @type {!Object.<boolean>}
   * @private
   */
  this.filteredLoggers_ = {};
};


/**
 * Returns the text formatter used by this console
 * @return {!breel.debug.NodeConsole.TextFormatter} The text formatter.
 */
breel.debug.NodeConsole.prototype.getFormatter = function() {
  return this.formatter_;
};


/**
 * Sets whether we are currently capturing logger output.
 * @param {boolean} capturing Whether to capture logger output.
 */
breel.debug.NodeConsole.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }

  // attach or detach handler from the root logger
  var rootLogger = goog.debug.LogManager.getRoot();
  if (capturing) {
    rootLogger.addHandler(this.publishHandler_);
  } else {
    rootLogger.removeHandler(this.publishHandler_);
    this.logBuffer = '';
  }
  this.isCapturing_ = capturing;
};


/**
 * Adds a log record.
 * @param {goog.debug.LogRecord} logRecord The log entry.
 */
breel.debug.NodeConsole.prototype.addLogRecord = function(logRecord) {

  // Check to see if the log record is filtered or not.
  if (this.filteredLoggers_[logRecord.getLoggerName()]) {
    return;
  }

  var record = this.formatter_.formatRecord(logRecord);
  var console = breel.debug.NodeConsole.console_;
  if (console) {
    switch (logRecord.getLevel()) {
      case goog.debug.Logger.Level.SHOUT:
        breel.debug.NodeConsole.logToConsole_(console, 'info', record);
        break;
      case goog.debug.Logger.Level.SEVERE:
        breel.debug.NodeConsole.logToConsole_(console, 'error', record);
        break;
      case goog.debug.Logger.Level.WARNING:
        breel.debug.NodeConsole.logToConsole_(console, 'warn', record);
        break;
      default:
        breel.debug.NodeConsole.logToConsole_(console, 'debug', record);
        break;
    }
  } else if (window.opera) {
    // window.opera.postError is considered an undefined property reference
    // by JSCompiler, so it has to be referenced using array notation instead.
    window.opera['postError'](record);
  } else {
    this.logBuffer_ += record;
  }
};


/**
 * Adds a logger name to be filtered.
 * @param {string} loggerName the logger name to add.
 */
breel.debug.NodeConsole.prototype.addFilter = function(loggerName) {
  this.filteredLoggers_[loggerName] = true;
};


/**
 * Removes a logger name to be filtered.
 * @param {string} loggerName the logger name to remove.
 */
breel.debug.NodeConsole.prototype.removeFilter = function(loggerName) {
  delete this.filteredLoggers_[loggerName];
};


/**
 * Global console logger instance
 * @type {breel.debug.NodeConsole}
 */
breel.debug.NodeConsole.instance = null;


/**
 * The console to which to log.  This is a property so it can be mocked out in
 * this unit test for breel.debug.NodeConsole.
 * @type {Object}
 * @private
 */
breel.debug.NodeConsole.console_ = window.console;


/**
 * Sets the console to which to log.
 * @param {!Object} console The console to which to log.
 */
breel.debug.NodeConsole.setConsole = function(console) {
  breel.debug.NodeConsole.console_ = console;
};


/**
 * Logs the record to the console using the given function.  If the function is
 * not available on the console object, the log function is used instead.
 * @param {!Object} console The console object.
 * @param {string} fnName The name of the function to use.
 * @param {string} record The record to log.
 * @private
 */
breel.debug.NodeConsole.logToConsole_ = function(console, fnName, record) {
	record = record.replace(/\s+$/, '');
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
};

/**
 * Formatter that returns formatted plain text
 *
 * @param {string=} opt_prefix The prefix to place before text records.
 * @constructor
 * @extends {goog.debug.Formatter}
 */
breel.debug.NodeConsole.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(breel.debug.NodeConsole.TextFormatter, goog.debug.Formatter);


/**
 * Formats a record as text
 * @param {goog.debug.LogRecord} logRecord the logRecord to format.
 * @return {string} The formatted string.
 * @override
 */
breel.debug.NodeConsole.TextFormatter.prototype.formatRecord = function(logRecord) {
	var red, blue, reset;
	red     = '\033[31m';
	blue    = '\033[34m';
	reset   = '\033[0m';
	bold    = '\x1B[1m';
	white   = '\x1B[39m';
	yellow  = '\x1B[33m';
	magenta = '\x1B[35m';
	cyan    = '\x1B[36m';

	var loggerName = logRecord.getLoggerName();
	var namespaceColor = (loggerName.indexOf('goog.') === 0 ? green : (loggerName.indexOf('breel.') === 0 ? cyan : blue));
	var levelColor = red;

  // Build message html
  var sb = [];
  sb.push(this.prefix_, ' ');
  if (this.showAbsoluteTime) {
    sb.push(red, goog.debug.Formatter.getDateTimeStamp_(logRecord), ' ');
  }
  if (this.showRelativeTime) {
    sb.push(red, goog.debug.Formatter.getRelativeTime_(logRecord,
        this.startTimeProvider_.get()), 's ');
  }

  if (this.showLoggerName) {
    sb.push(namespaceColor, bold, logRecord.getLoggerName(), ' ');
  }
  if (this.showSeverityLevel) {
    sb.push(levelColor, logRecord.getLevel().name, ' ');
  }
  sb.push(reset, logRecord.getMessage());
  if (this.showExceptionText && logRecord.getException()) {
    sb.push('\n', logRecord.getExceptionText());
  }
  // If the logger is enabled, open window and write html message to log
  // otherwise save it
  return sb.join('');
};

