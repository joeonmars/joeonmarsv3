goog.provide('breel.build.Pass');

goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
breel.build.Pass = function(options) {
  goog.base(this);

  this.builder = options.builder;
  this.startMark = options.startMark;

  this.phaseIndex = 0;
  this.nextPhaseIndex = 0;
  this.phase = null;
  this.isExecuting = false;
  this.isComplete = false;
  this.numPhasesAffected = 0;
};
goog.inherits(breel.build.Pass, goog.events.EventTarget);

breel.build.Pass.EventType = {
	PHASE_COMPLETE: 'phaseComplete',
	COMPLETE: 'complete'
};

/**
 * @type {goog.debug.Logger}
 * @protected
 */
breel.build.Pass.prototype.logger = goog.debug.Logger.getLogger('breel.build.Pass');

breel.build.Pass.PHASE_TIMEOUT_DURATION = 10000;

breel.build.Pass.prototype.getAffectedPhaseIndexForDelta = function(delta) {
	this.logger.fine('getAffectedPhaseIndexForDelta');

	var affectedPhaseIndex = -1;

	for (var phaseIndex = 0; phaseIndex < this.builder.phases.length; phaseIndex++) {
		var phase = this.builder.phases[phaseIndex];
		var phaseIsAffectedByDelta = phase.getIsAffectedByDelta(delta);

		if (phaseIsAffectedByDelta) {
			affectedPhaseIndex = phaseIndex;
			break;
		}
	}

	this.logger.fine('getAffectedPhaseIndexForDelta = ' + affectedPhaseIndex);
	return affectedPhaseIndex;
};

breel.build.Pass.prototype.execute = function() {
	this.logger.fine('execute');

	this.builder.assertValid();
	this.isExecuting = true;

	if (this.startMark) {
		// Build from mark
		var affectedPhaseIndex = this.getAffectedPhaseIndexForDelta(this.startMark.forwardDelta);
		if (affectedPhaseIndex === -1) {
			// No build required
			this.logger.fine('execute (no build necessary)');
			this.complete();
			return;
		} else {
			this.nextPhaseIndex = affectedPhaseIndex;
		}
	}

	this.executeNextPhase();
};

breel.build.Pass.prototype.executeNextPhase = function() {
	this.logger.fine('executeNextPhase');

	if (this.nextPhaseIndex < this.builder.phases.length) {
		this.phaseIndex = this.nextPhaseIndex++;
		this.numPhasesAffected++;
		this.phase = this.builder.phases[this.phaseIndex];

		this.phaseTimeoutId = setTimeout(this.timeout, breel.build.Pass.PHASE_TIMEOUT_DURATION);

		this.phase.enterPass(this);
		goog.events.listenOnce(this.phase, breel.build.Phase.EventType.COMPLETE, this.onPhaseComplete, false, this);
		this.phase.execute();
	} else {
		this.complete();
	}
};

breel.build.Pass.prototype.onPhaseComplete = function(event) {
	this.logger.fine('onPhaseComplete');

	clearTimeout(this.phaseTimeoutId);

	this.phase.exitPass(this);

	goog.events.dispatchEvent(this, {
		type: breel.build.Pass.EventType.PHASE_COMPLETE,
		phaseIndex: this.phaseIndex,
		phase: this.phase
	});

	this.phase = null;

	this.executeNextPhase();
};

breel.build.Pass.prototype.timeout = function() {
	throw new Error('Timeout! Phase took too long to complete');
};

breel.build.Pass.prototype.complete = function() {
	this.logger.fine('complete');
	
	this.isExecuting = false;
	this.isComplete = true;
	
	goog.events.dispatchEvent(this, {
		type: breel.build.Pass.EventType.COMPLETE,
		phaseIndex: this.phaseIndex,
		phase: this.phase
	});
};

    
    