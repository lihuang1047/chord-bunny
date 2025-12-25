import { ErrorHandler } from './errorHandler.js';

/**
 * A metronome class that provides audio and visual beat timing.
 * Generates click sounds at specified BPM and provides visual beat indicators.
 */
export class Metronome {
    /**
     * Initializes the metronome instance.
     * Sets up initial state variables for audio context, timing, and playback status.
     */
    constructor() {
        this.audioContext = null;
        this.interval = null;
        this.beatCount = 0;
        this.isPlaying = false;
    }

    /**
     * Initializes the Web Audio API context if not already created.
     * Creates audio context for sound generation with browser compatibility fallback.
     * @throws {Error} If audio context creation fails
     */
    initAudio() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                ErrorHandler.handleAudioError(error);
                throw error;
            }
        }
    }

    /**
     * Updates the visual beat indicators to show the current active beat.
     * Removes active class from all beat dots and adds it to the current beat.
     * @param {number} beat - The current beat number (0-indexed)
     */
    updateActiveBeat(beat) {
        // Remove active class from all beat dots
        document.querySelectorAll('.beat-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to the current beat (1-4)
        const currentBeat = (beat % 4) + 1;
        const activeDot = document.querySelector(`.beat-dot[data-beat="${currentBeat}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    }

    /**
     * Plays a single click sound for the specified beat.
     * Generates a sine wave click with different pitch for the first beat of each measure.
     * Also updates the visual beat indicator.
     * @param {number} beat - The beat number (0-indexed)
     */
    playClick(beat) {
        if (!this.audioContext) this.initAudio();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // First beat is a higher pitch
        const isFirstBeat = beat % 4 === 0;
        oscillator.type = 'sine';
        oscillator.frequency.value = isFirstBeat ? 800 : 400;
        
        gainNode.gain.value = 0.5;
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
        
        // Update the visual metronome
        this.updateActiveBeat(beat);
    }

    /**
     * Starts the metronome playback at the specified beats per minute.
     * Begins playing regular click sounds and updating visual indicators.
     * @param {number} bpm - Beats per minute (tempo)
     */
    start(bpm) {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.beatCount = 0;
        
        const beatInterval = (60 / bpm) * 1000; // Convert BPM to milliseconds
        
        // Initial beat visualization
        this.updateActiveBeat(this.beatCount - 1);
        
        this.interval = setInterval(() => {
            this.playClick(this.beatCount);
            this.beatCount++;
        }, beatInterval);
    }

    /**
     * Stops the metronome playback.
     * Clears the interval timer, resets playback state, and clears visual indicators.
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isPlaying = false;
        this.beatCount = 0;
        
        // Clear visual metronome
        document.querySelectorAll('.beat-dot').forEach(dot => {
            dot.classList.remove('active');
        });
    }

    /**
     * Resets the beat counter to zero and updates visual indicators.
     * Useful for restarting the beat count without stopping playback.
     */
    resetBeatCount() {
        this.beatCount = 0;
        this.updateActiveBeat(-1);
    }
}
