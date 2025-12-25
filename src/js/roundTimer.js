export class RoundTimer {
    constructor() {
        this.roundTimer = null;
        this.timeLeft = 60;
        this.currentRound = 0;
        this.totalRounds = 4;
        this.onTimeUpdate = null;
        this.onRoundComplete = null;
        this.onAllRoundsComplete = null;
    }

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

    stop() {
        if (this.roundTimer) {
            clearInterval(this.roundTimer);
            this.roundTimer = null;
        }
        this.currentRound = 0;
        this.timeLeft = 0;
    }

    reset(durationInSeconds) {
        this.stop();
        this.timeLeft = durationInSeconds;
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.timeLeft);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    getRoundDisplay() {
        if (this.totalRounds > 0) {
            return `Round ${this.currentRound} of ${this.totalRounds}`;
        }
        return '';
    }
}
