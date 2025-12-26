import { availableChords } from './chordData.js';
import { ErrorHandler } from './errorHandler.js';

/**
 * Manages chord progressions and chord-related functionality for the application.
 * Handles chord progression state, chord image updates, and progression management.
 */
export class ChordManager {
    /**
     * Creates a new ChordManager instance with a default chord progression.
     * The default progression is set to ['C', 'G', 'Am', 'F'].
     */
    constructor() {
        this.currentProgression = ['C', 'G', 'Am', 'F'];
        this.currentChordIndex = 0;
    }

    /**
     * Updates the chord image element with the specified chord.
     * If the chord image is not available, hides the image and triggers an error handler.
     *
     * @param {HTMLImageElement} imageElement - The image element to update
     * @param {string} chordName - The name of the chord to display
     */
    updateChordImage(imageElement, chordName) {
        // Check if chord image exists, otherwise show placeholder
        if (availableChords.includes(chordName)) {
            imageElement.src = `src/assets/chords/${chordName}.png`;
            imageElement.alt = `${chordName} Chord`;
            imageElement.style.display = 'block';
        } else {
            // Hide image for chords without diagrams
            imageElement.style.display = 'none';
            ErrorHandler.handleImageError(chordName);
        }
    }

    /**
     * Advances to the next chord in the current progression and returns the current and next chords.
     * Automatically wraps around to the beginning when reaching the end of the progression.
     *
     * @returns {Object} An object containing:
     *   - {string} currentChord - The current chord in the progression
     *   - {string} nextChord - The next chord that will be played
     */
    updateChord() {
        // Move to next chord in progression
        this.currentChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
        const nextChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
        
        // Get current and next chord names
        const currentChord = this.currentProgression[this.currentChordIndex];
        const nextChord = this.currentProgression[nextChordIndex] || this.currentProgression[0];
        
        return { currentChord, nextChord };
    }

    /**
     * Sets a new chord progression and resets the current position to the beginning.
     *
     * @param {string[]} progression - An array of chord names representing the new progression
     */
    setProgression(progression) {
        this.currentProgression = progression;
        this.currentChordIndex = 0;
    }

    /**
     * Resets the current position in the chord progression to the beginning.
     */
    reset() {
        this.currentChordIndex = 0;
    }
}
