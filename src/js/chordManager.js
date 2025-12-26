import { availableChords } from './chordData.js';
import { ErrorHandler } from './errorHandler.js';

/**
 * Manages chord progressions and chord-related functionality for the application.
 * Handles chord progression state, chord image updates, and progression management.
 * Supports both random (Basic) and ordered progression types.
 */
export class ChordManager {
    /**
     * Creates a new ChordManager instance with a default chord progression.
     * The default progression is set to ['C', 'G', 'Am', 'F'].
     */
    constructor() {
        this.currentProgression = ['C', 'G', 'Am', 'F'];
        this.currentChordIndex = 0;
        this.progressionType = 'random'; // 'random' or 'ordered'
    }

    /**
     * Sets a new chord progression and resets the current position to the beginning.
     * Supports both random and ordered progression types.
     * @param {string[]|Object} progression - Either an array of chord names (random) 
     *                                      or progression object with sequence (ordered)
     * @param {string} type - Type of progression: 'random' or 'ordered'
     */
    setProgression(progression, type = 'random') {
        this.progressionType = type;
        
        if (type === 'ordered' && progression.sequence) {
            // Ordered progression - use the fixed sequence
            this.currentProgression = [...progression.sequence];
        } else {
            // Random progression - use the chord array
            this.currentProgression = Array.isArray(progression) ? [...progression] : [];
        }
        
        this.currentChordIndex = 0;
    }

    /**
     * Generates a random progression from selected chords for Basic progression type.
     * Creates a 4-chord progression with no consecutive identical chords.
     * @param {string[]} selectedChords - Array of chord names to choose from
     */
    generateRandomProgression(selectedChords) {
        // Filter to only available chords (those with images)
        const availableSelectedChords = selectedChords.filter(chord => availableChords.includes(chord));
        
        if (availableSelectedChords.length < 2) {
            // Fallback to basic chords if fewer than 2 chords have images
            this.currentProgression = ['C', 'G', 'Am', 'F'];
        } else {
            // Generate a 4-chord progression from available selected chords
            const progression = [];
            for (let i = 0; i < 4; i++) {
                let randomIndex;
                let randomChord;
                
                // Keep picking until we get a different chord from the previous one
                do {
                    randomIndex = Math.floor(Math.random() * availableSelectedChords.length);
                    randomChord = availableSelectedChords[randomIndex];
                } while (i > 0 && randomChord === progression[i - 1]);
                
                progression.push(randomChord);
            }
            this.currentProgression = progression;
        }
        
        this.currentChordIndex = 0;
        this.progressionType = 'random';
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
     * For random progressions, ensures current and next chords are different.
     *
     * @returns {Object} An object containing:
     *   - {string} currentChord - The current chord in the progression
     *   - {string} nextChord - The next chord that will be played
     */
    updateChord() {
        let currentChord, nextChord;
        
        if (this.progressionType === 'random') {
            // For random progressions, advance and ensure different chords
            this.currentChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
            currentChord = this.currentProgression[this.currentChordIndex];
            
            // Find next chord that's different from current
            let nextChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
            nextChord = this.currentProgression[nextChordIndex];
            
            // If only one chord in progression or next is same as current, find different one
            if (this.currentProgression.length > 1 && nextChord === currentChord) {
                // Look for a different chord
                for (let i = 0; i < this.currentProgression.length; i++) {
                    if (this.currentProgression[i] !== currentChord) {
                        nextChord = this.currentProgression[i];
                        break;
                    }
                }
            }
        } else {
            // For ordered progressions, follow the sequence normally
            this.currentChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
            const nextChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
            
            currentChord = this.currentProgression[this.currentChordIndex];
            nextChord = this.currentProgression[nextChordIndex] || this.currentProgression[0];
        }
        
        return { currentChord, nextChord };
    }

    /**
     * Resets the current position in the chord progression to the beginning.
     */
    reset() {
        this.currentChordIndex = 0;
    }
}
