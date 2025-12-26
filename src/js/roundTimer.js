/**
 * RoundTimer manages the timing and progression of practice rounds.
 * It handles countdown timing, round progression, and event callbacks
 * for time updates and round completion.
 */
export class RoundTimer {
    /**
     * Creates a new RoundTimer instance.
     * Initializes timer state with default values.
     */
    constructor() {
        this.roundTimer = null;
        this.timeLeft = 60;
        this.currentRound = 0;
        this.totalRounds = 4;
        this.onTimeUpdate = null;
        this.onRoundComplete = null;
        this.onAllRoundsComplete = null;
    }

    /**
     * Starts the round timer with the specified duration and total rounds.
     * Begins countdown and manages round progression.
     * @param {number} durationInSeconds - Duration of each round in seconds
     * @param {number} totalRounds - Total number of rounds to complete
     */
    start(durationInSeconds, totalRounds) {
        this.timeLeft = durationInSeconds;
        this.currentRound = 1;
        this.totalRounds = totalRounds;

        this.roundTimer = setInterval(() => {
            this.timeLeft--;
            
            if (this.onTimeUpdate) {
                this.onTimeUpdate(this.timeLeft);
            }
            
            if (this.timeLeft <= 0) {
                // Reset timer for the next round
                this.timeLeft = durationInSeconds;
                
                // Move to next round
                this.currentRound++;
                
                if (this.onRoundComplete) {
                    this.onRoundComplete(this.currentRound);
                }
                
                // Check if we've completed all rounds
                if (this.currentRound > this.totalRounds) {
                    this.stop();
                    if (this.onAllRoundsComplete) {
                        this.onAllRoundsComplete();
                    }
                }
            }
        }, 1000);
    }

    /**
     * Stops the timer and resets the current round.
     * Clears any active intervals and resets timer state.
     */
    stop() {
        if (this.roundTimer) {
            clearInterval(this.roundTimer);
            this.roundTimer = null;
        }
        this.currentRound = 0;
        this.timeLeft = 0;
    }

    /**
     * Resets the timer with a new duration.
     * Stops any running timer and updates the time left.
     * @param {number} durationInSeconds - New duration in seconds to reset the timer to
     */
    reset(durationInSeconds) {
        this.stop();
        this.timeLeft = durationInSeconds;
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.timeLeft);
        }
    }

    /**
     * Gets a formatted string showing the current round and total rounds.
     * @returns {string} Formatted round display (e.g., 'Round 2 of 4') or empty string if no rounds
     */
    getRoundDisplay() {
        if (this.totalRounds > 0) {
            return `Round ${this.currentRound} of ${this.totalRounds}`;
        }
        return '';
    }
}
