import { availableChords } from './chordData.js';
import { ErrorHandler } from './errorHandler.js';

export class ChordManager {
    constructor() {
        this.currentProgression = ['C', 'G', 'Am', 'F'];
        this.currentChordIndex = 0;
    }

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

    updateChord() {
        // Move to next chord in progression
        this.currentChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
        const nextChordIndex = (this.currentChordIndex + 1) % this.currentProgression.length;
        
        // Get current and next chord names
        const currentChord = this.currentProgression[this.currentChordIndex];
        const nextChord = this.currentProgression[nextChordIndex] || this.currentProgression[0];
        
        return { currentChord, nextChord };
    }

    setProgression(progression) {
        this.currentProgression = progression;
        this.currentChordIndex = 0;
    }

    reset() {
        this.currentChordIndex = 0;
    }
}
