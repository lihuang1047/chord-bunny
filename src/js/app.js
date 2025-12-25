import { Metronome } from './metronome.js';
import { ChordManager } from './chordManager.js';
import { RoundTimer } from './roundTimer.js';
import { UIController } from './uiController.js';
import { availableChords } from './chordData.js';

/**
 * Main application class for the Chord Bunny practice app.
 * Coordinates metronome, chord progression, timing, and UI components.
 * Provides a structured practice session with chord changes at specified intervals.
 */
class ChordBunnyApp {
    /**
     * Initializes the Chord Bunny application.
     * Sets up all components and establishes the initial state.
     */
    constructor() {
        this.metronome = new Metronome();
        this.chordManager = new ChordManager();
        this.roundTimer = new RoundTimer();
        this.uiController = new UIController();
        
        this.isPlaying = false;
        
        this.initialize();
    }

    /**
     * Initializes all application components and sets up event callbacks.
     * Establishes communication between timer, UI, and chord management systems.
     */
    initialize() {
        // Setup timer callbacks
        this.roundTimer.onTimeUpdate = (timeLeft) => {
            this.uiController.updateTimerDisplay(timeLeft);
        };

        this.roundTimer.onRoundComplete = (currentRound) => {
            this.updateChordAndDisplay();
            this.uiController.updateRoundDisplay(this.roundTimer.getRoundDisplay());
        };

        this.roundTimer.onAllRoundsComplete = () => {
            this.stop();
        };

        // Setup UI callbacks
        this.uiController.onStart(() => this.toggleMetronome());
        this.uiController.onNextChord(() => this.changeChords());
        this.uiController.onChordSelectionChange((selectedChords) => {
            this.generateNewProgression(selectedChords);
        });

        // Initialize UI
        this.uiController.populateProgressionDropdown();
        this.uiController.updateChordLibrary();
        this.uiController.updateTimerDisplay(this.uiController.getRoundDuration());
        this.uiController.updateRoundDisplay(this.roundTimer.getRoundDisplay());

        this.setupKeyboardShortcuts();
        this.setupAudioInit();
    }

    /**
     * Sets up keyboard shortcuts for application control.
     * Space: Start/Stop, ArrowRight/N: Change chords, Escape: Stop
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleMetronome();
            } else if (e.code === 'ArrowRight' || e.code === 'KeyN') {
                this.changeChords();
            } else if (e.code === 'Escape') {
                this.stop();
            }
        });
    }

    /**
     * Sets up audio context initialization on first user interaction.
     * Required by browsers to enable audio playback.
     */
    setupAudioInit() {
        // Initialize audio context on user interaction
        const initAudio = () => {
            this.metronome.initAudio();
            document.removeEventListener('touchstart', initAudio);
            document.removeEventListener('click', initAudio);
        };

        document.addEventListener('touchstart', initAudio, { once: true });
        document.addEventListener('click', initAudio, { once: true });
    }

    /**
     * Toggles metronome playback between start and stop states.
     * Called by UI button and spacebar shortcut.
     */
    toggleMetronome() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Starts the practice session.
     * Initializes metronome, timer, and displays the first chord.
     */
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.uiController.updateToggleButton(true);
        
        const bpm = this.uiController.getBPM();
        const roundDuration = this.uiController.getRoundDuration();
        const totalRounds = this.uiController.getTotalRounds();
        
        // Reset chord manager
        this.chordManager.reset();
        
        // Show first chord without advancing
        const firstChord = this.chordManager.currentProgression[0];
        const secondChord = this.chordManager.currentProgression[1] || this.chordManager.currentProgression[0];
        
        this.updateChordDisplay(firstChord, secondChord);
        
        // Start metronome and timer
        this.metronome.start(bpm);
        this.roundTimer.start(roundDuration, totalRounds);
        
        // Update round display
        this.uiController.updateRoundDisplay(this.roundTimer.getRoundDisplay());
    }

    /**
     * Stops the practice session.
     * Halts metronome, timer, and resets all displays to initial state.
     */
    stop() {
        this.isPlaying = false;
        this.uiController.updateToggleButton(false);
        
        this.metronome.stop();
        this.roundTimer.stop();
        
        // Reset displays
        const roundDuration = this.uiController.getRoundDuration();
        this.uiController.updateTimerDisplay(roundDuration);
        this.uiController.updateRoundDisplay(this.roundTimer.getRoundDisplay());
    }

    /**
     * Advances to the next chord manually.
     * Resets beat counter and round timer for the new chord.
     */
    changeChords() {
        this.updateChordAndDisplay();
        
        if (this.isPlaying) {
            // Reset beat counter and metronome visualization
            this.metronome.resetBeatCount();
            
            // Reset the round timer
            const roundDuration = this.uiController.getRoundDuration();
            this.roundTimer.reset(roundDuration);
        }
    }

    /**
     * Updates the chord progression and displays the new current and next chords.
     * Called automatically on round completion and manually via nextChord().
     */
    updateChordAndDisplay() {
        const { currentChord, nextChord } = this.chordManager.updateChord();
        this.updateChordDisplay(currentChord, nextChord);
    }

    /**
     * Updates the UI display with current and next chord information.
     * Updates both text displays and chord diagram images.
     * @param {string} currentChord - The current chord to display
     * @param {string} nextChord - The next chord to display
     */
    updateChordDisplay(currentChord, nextChord) {
        // Update UI text
        this.uiController.updateChordDisplay(currentChord, nextChord);
        
        // Update chord images
        this.chordManager.updateChordImage(this.uiController.currentChordImage, currentChord);
        this.chordManager.updateChordImage(this.uiController.nextChordImage, nextChord);
    }

    /**
     * Generates a new chord progression from selected chords.
     * Filters to available chords with images and creates a 4-chord progression.
     * @param {string[]} selectedChords - Array of chord names selected by the user
     */
    generateNewProgression(selectedChords) {
        // Filter to only available chords (those with images)
        const availableSelectedChords = selectedChords.filter(chord => availableChords.includes(chord));
        
        if (availableSelectedChords.length === 0) {
            // Fallback to basic chords if none of the selected chords have images
            this.chordManager.setProgression(['C', 'G', 'Am', 'F']);
        } else {
            // Generate a 4-chord progression from available selected chords
            const progression = [];
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * availableSelectedChords.length);
                progression.push(availableSelectedChords[randomIndex]);
            }
            this.chordManager.setProgression(progression);
        }
        
        // Update display with new progression
        const firstChord = this.chordManager.currentProgression[0];
        const secondChord = this.chordManager.currentProgression[1] || this.chordManager.currentProgression[0];
        this.updateChordDisplay(firstChord, secondChord);
        
        // Restart if currently playing
        if (this.isPlaying) {
            this.stop();
            this.start();
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    new ChordBunnyApp();
    console.log('App initialized');
});
