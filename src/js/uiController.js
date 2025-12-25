import { progressionOptions, progressions } from './chordData.js';
import { ErrorHandler } from './errorHandler.js';

export class UIController {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // DOM Elements
        this.currentChordEl = document.getElementById('currentChord');
        this.nextChordEl = document.getElementById('nextChord');
        this.currentChordImage = document.getElementById('currentChordImage');
        this.nextChordImage = document.getElementById('nextChordImage');
        this.bpmInput = document.getElementById('bpm');
        this.bpmValue = document.getElementById('bpmValue');
        this.roundDurationInput = document.getElementById('roundDuration');
        this.totalRoundsInput = document.getElementById('totalRounds');
        this.startBtn = document.getElementById('startBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.chordDisplay = document.querySelector('.chord-display');
        this.roundDisplay = document.getElementById('roundDisplay');
        this.chordProgression = document.getElementById('chordProgression');
        this.chordSelector = document.getElementById('chordSelector');

        // Debug: Check if critical elements are found
        if (!this.chordProgression) {
            console.error('chordProgression element not found!');
        }
        if (!this.chordSelector) {
            console.error('chordSelector element not found!');
        }
    }

    setupEventListeners() {
        // Update BPM display
        this.bpmInput.addEventListener('input', () => {
            this.bpmValue.textContent = this.bpmInput.value;
        });

        // Update chord library when progression changes
        this.chordProgression.addEventListener('change', () => {
            this.updateChordLibrary();
        });

        // Update total rounds
        this.totalRoundsInput.addEventListener('change', () => {
            const totalRounds = parseInt(this.totalRoundsInput.value) || 4;
            if (totalRounds < 1) {
                this.totalRoundsInput.value = 1;
            }
        });
    }

    populateProgressionDropdown() {
        console.log('Populating progression dropdown...');
        console.log('chordProgression:', this.chordProgression);
        console.log('progressionOptions:', progressionOptions);
        
        if (!this.chordProgression) {
            console.error('Cannot populate dropdown: chordProgression is null');
            return;
        }
        
        this.chordProgression.innerHTML = '';
        
        progressionOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.displayText;
            
            // Set as default if it's the first option
            if (option.value === 'basic') {
                optionElement.selected = true;
            }
            
            this.chordProgression.appendChild(optionElement);
        });
        
        console.log('Dropdown populated with', this.chordProgression.options.length, 'options');
    }

    updateChordLibrary() {
        const selectedProgression = this.chordProgression.value;
        const chordsToShow = progressions[selectedProgression] || [];
        
        // Clear existing checkboxes
        this.chordSelector.innerHTML = '';
        
        // Create checkboxes for chords
        chordsToShow.forEach((chord) => {
            const label = document.createElement('label');
            label.className = 'chord-option';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'chord';
            input.value = chord.name;
            input.checked = true; // Check all by default
            
            const chordLabel = document.createElement('span');
            chordLabel.className = 'chord-label';
            chordLabel.textContent = `${chord.name} (${chord.roman})`;
            
            label.appendChild(input);
            label.appendChild(chordLabel);
            this.chordSelector.appendChild(label);
        });
    }

    getSelectedChords() {
        const checkboxes = document.querySelectorAll('input[name="chord"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    updateChordDisplay(currentChord, nextChord) {
        this.currentChordEl.textContent = currentChord;
        this.nextChordEl.textContent = nextChord;
        
        // Add active class for animation
        this.chordDisplay.classList.add('active');
        
        // Remove active class after animation
        setTimeout(() => {
            this.chordDisplay.classList.remove('active');
        }, 100);
    }

    updateTimerDisplay(seconds) {
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
    }

    updateRoundDisplay(roundText) {
        if (this.roundDisplay) {
            this.roundDisplay.textContent = roundText;
        }
    }

    updateToggleButton(isPlaying) {
        if (isPlaying) {
            this.startBtn.textContent = 'Stop';
            this.startBtn.className = 'btn btn-stop';
            this.startBtn.classList.remove('btn-primary');
            this.nextBtn.disabled = true;
        } else {
            this.startBtn.textContent = 'Start';
            this.startBtn.className = 'btn btn-primary';
            this.startBtn.classList.remove('btn-stop');
            this.nextBtn.disabled = false;
        }
    }

    getBPM() {
        const bpm = parseInt(this.bpmInput.value);
        if (!ErrorHandler.validateInput(bpm, 20, 200, 'BPM')) {
            return 60; // Default BPM
        }
        return bpm;
    }

    getRoundDuration() {
        const duration = parseInt(this.roundDurationInput.value);
        if (!ErrorHandler.validateInput(duration, 5, 300, 'Round duration')) {
            return 60; // Default duration
        }
        return duration;
    }

    getTotalRounds() {
        const rounds = parseInt(this.totalRoundsInput.value) || 4;
        if (!ErrorHandler.validateInput(rounds, 1, 100, 'Number of rounds')) {
            return 4; // Default rounds
        }
        return rounds;
    }

    onStart(callback) {
        this.startBtn.addEventListener('click', callback);
    }

    onNextChord(callback) {
        this.nextBtn.addEventListener('click', callback);
    }

    onChordSelectionChange(callback) {
        // Use event delegation for dynamically created checkboxes
        this.chordSelector.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const selectedChords = this.getSelectedChords();
                if (selectedChords.length === 0) {
                    e.target.checked = true; // Re-check the current one
                    alert('At least one chord must be selected');
                    return;
                }
                callback(selectedChords);
            }
        });
    }
}
