// DOM Elements
const currentChordEl = document.getElementById('currentChord');
const nextChordEl = document.getElementById('nextChord');
const currentChordImage = document.getElementById('currentChordImage');
const nextChordImage = document.getElementById('nextChordImage');
const bpmInput = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');
const roundDurationInput = document.getElementById('roundDuration');
const totalRoundsInput = document.getElementById('totalRounds');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const nextBtn = document.getElementById('nextBtn');
const progressionBtns = document.querySelectorAll('.progression-btn');
const chordDisplay = document.querySelector('.chord-display');
const bpmValueDisplay = document.getElementById('bpmValue');
const roundDisplay = document.getElementById('roundDisplay');
const chordCheckboxes = document.querySelectorAll('input[name="chord"]');
const chordProgressionSelect = document.getElementById('chordProgression');
const chordSelector = document.getElementById('chordSelector');

// Audio Context and Nodes
let audioContext;
let metronomeInterval;
let beatCount = 0;
let isPlaying = false;
let currentChordIndex = 0;
let currentProgression = ['C', 'G', 'Am', 'F']; // Default progression

// All available chords with their roman numeral equivalents
const allChords = [
    { name: 'C', roman: 'I' },
    { name: 'C#', roman: 'I#' },
    { name: 'Db', roman: 'bII' },
    { name: 'D', roman: 'II' },
    { name: 'D#', roman: 'II#' },
    { name: 'Eb', roman: 'bIII' },
    { name: 'E', roman: 'III' },
    { name: 'F', roman: 'IV' },
    { name: 'F#', roman: 'IV#' },
    { name: 'Gb', roman: 'bV' },
    { name: 'G', roman: 'V' },
    { name: 'G#', roman: 'V#' },
    { name: 'Ab', roman: 'bVI' },
    { name: 'A', roman: 'VI' },
    { name: 'A#', roman: 'VI#' },
    { name: 'Bb', roman: 'bVII' },
    { name: 'B', roman: 'VII' },
    { name: 'Cm', roman: 'i' },
    { name: 'C#m', roman: 'i#' },
    { name: 'Dm', roman: 'ii' },
    { name: 'D#m', roman: 'ii#' },
    { name: 'Ebm', roman: 'biii' },
    { name: 'Em', roman: 'iii' },
    { name: 'Fm', roman: 'iv' },
    { name: 'F#m', roman: 'iv#' },
    { name: 'Gm', roman: 'v' },
    { name: 'G#m', roman: 'v#' },
    { name: 'Abm', roman: 'bvi' },
    { name: 'Am', roman: 'vi' },
    { name: 'A#m', roman: 'vi#' },
    { name: 'Bbm', roman: 'bvii' },
    { name: 'Bm', roman: 'vii' }
];

// Progression definitions with display names
const progressionOptions = [
    {
        value: 'basic',
        displayText: 'Basic Chords',
        chords: allChords.filter(chord => ['C', 'D', 'Dm', 'E', 'Em', 'F', 'G', 'A', 'Am', 'Bm'].includes(chord.name))
    },
    {
        value: 'pop',
        displayText: 'Pop',
        chords: allChords.filter(chord => ['C', 'G', 'Am', 'F'].includes(chord.name))
    },
    {
        value: 'rock',
        displayText: 'Rock',
        chords: allChords.filter(chord => ['C', 'G', 'F'].includes(chord.name))
    },
    {
        value: 'christianWorship',
        displayText: 'Christian Worship',
        chords: allChords.filter(chord => ['G', 'D', 'Em', 'C'].includes(chord.name))
    },
    // {
    //     value: 'all',
    //     displayText: 'All Chords',
    //     chords: allChords
    // },
];

// Create a lookup object for easier access
const progressions = {};
progressionOptions.forEach(option => {
    progressions[option.value] = option.chords;
});

// Populate the dropdown with progression options
function populateProgressionDropdown() {
    chordProgressionSelect.innerHTML = '';
    
    progressionOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.displayText;
        
        // Set as default if it's the first option or 'random'
        if (option.value === 'basic') {
            optionElement.selected = true;
        }
        
        chordProgressionSelect.appendChild(optionElement);
    });
}

// Update chord library based on selected progression
function updateChordLibrary() {
    const selectedProgression = chordProgressionSelect.value;
    const chordsToShow = progressions[selectedProgression] || allChords;
    
    // Clear existing checkboxes
    chordSelector.innerHTML = '';
    
    // Determine if we should limit display (only for random chords with more than 8)
    const shouldLimit = selectedProgression === 'all' && chordsToShow.length > 8;
    const chordsToDisplay = shouldLimit ? chordsToShow.slice(0, 12) : chordsToShow;
    const remainingChords = shouldLimit ? chordsToShow.slice(12) : [];
    
    // Create checkboxes for displayed chords
    chordsToDisplay.forEach((chord, index) => {
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
        chordSelector.appendChild(label);
    });
    
    // Add expand button if there are remaining chords
    if (remainingChords.length > 0) {
        const expandButton = document.createElement('button');
        expandButton.className = 'expand-chords-btn';
        expandButton.textContent = `Show ${remainingChords.length} more chords`;
        expandButton.type = 'button';
        
        expandButton.addEventListener('click', () => {
            // Remove the expand button
            expandButton.remove();
            
            // Add remaining chords
            remainingChords.forEach((chord) => {
                const label = document.createElement('label');
                label.className = 'chord-option';
                
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.name = 'chord';
                input.value = chord.name;
                input.checked = true;
                
                const chordLabel = document.createElement('span');
                chordLabel.className = 'chord-label';
                chordLabel.textContent = `${chord.name} (${chord.roman})`;
                
                label.appendChild(input);
                label.appendChild(chordLabel);
                chordSelector.appendChild(label);
            });
        });
        
        chordSelector.appendChild(expandButton);
    }
}

// Initialize audio context on user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Update the active beat in the metronome visualization
function updateActiveBeat(beat) {
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

// Play a metronome click sound
function playClick(beat) {
    if (!audioContext) initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // First beat is a higher pitch
    const isFirstBeat = beat % 4 === 0;
    oscillator.type = 'sine';
    oscillator.frequency.value = isFirstBeat ? 800 : 400;
    
    gainNode.gain.value = 0.1;
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Update the visual metronome
    updateActiveBeat(beat);
}

// Update chord display and charts
function updateChord() {
    // Move to next chord in progression
    currentChordIndex = (currentChordIndex + 1) % currentProgression.length;
    const nextChordIndex = (currentChordIndex + 1) % currentProgression.length;
    
    // Get current and next chord names
    const currentChord = currentProgression[currentChordIndex];
    const nextChord = currentProgression[nextChordIndex] || currentProgression[0];
    
    // Update the display
    currentChordEl.textContent = currentChord;
    nextChordEl.textContent = nextChord;
    
    // Update the chord images
    updateChordImage(currentChordImage, currentChord);
    updateChordImage(nextChordImage, nextChord);
    
    // Add active class for animation
    chordDisplay.classList.add('active');
    
    // Remove active class after animation
    setTimeout(() => {
        chordDisplay.classList.remove('active');
    }, 100);
    
    return currentChord;
}

// Update a chord image element with the appropriate chord diagram
function updateChordImage(imageElement, chordName) {
    // Assuming chord images are named like "C.png", "G.png", etc.
    // Fallback to a default image if the chord image doesn't exist
    imageElement.src = `src/assets/chords/${chordName}.png`;
    imageElement.alt = `${chordName} Chord`;
    
    // Handle image loading errors
    imageElement.onerror = function() {
        console.warn(`Chord image not found: ${chordName}.png`);
        // You could set a default/placeholder image here if desired
        // imageElement.src = 'chords/default.png';
    };
}

// Round timer variables
let roundTimer;
let timeLeft;
let currentRound = 0;
let totalRounds = 0;

// Update the round timer display
function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Helper function to update the round display
function updateRoundDisplay() {
    if (totalRounds > 0) {
        roundDisplay.textContent = `Round ${currentRound} of ${totalRounds}`;
    }
}

// Update toggle button state
function updateToggleButton(isPlaying) {
    if (isPlaying) {
        startBtn.textContent = 'Stop';
        startBtn.className = 'btn btn-stop';
        startBtn.classList.remove('btn-primary');
        nextBtn.disabled = true;
    } else {
        startBtn.textContent = 'Start';
        startBtn.className = 'btn btn-primary';
        startBtn.classList.remove('btn-stop');
        nextBtn.disabled = false;
    }
}

// Toggle metronome (Start/Stop)
function toggleMetronome() {
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

// Start metronome
function startMetronome() {
    if (isPlaying) return;
    
    isPlaying = true;
    updateToggleButton(true);
    
    const bpm = parseInt(bpmInput.value);
    const roundDuration = parseInt(roundDurationInput.value);
    totalRounds = parseInt(totalRoundsInput.value) || 4;
    
    // Initialize round counter and chord index
    currentRound = 1;
    currentChordIndex = -1; // Set to -1 so first update shows the first chord
    
    // Show first chord without advancing
    const firstChord = currentProgression[0];
    const secondChord = currentProgression[1] || currentProgression[0];
    
    currentChordEl.textContent = firstChord;
    nextChordEl.textContent = secondChord;
    updateChordImage(currentChordImage, firstChord);
    updateChordImage(nextChordImage, secondChord);
    
    // Start round timer
    timeLeft = roundDuration;
    updateTimerDisplay(timeLeft);
    updateRoundDisplay();
    
    // Start metronome
    const beatInterval = (60 / bpm) * 1000; // Convert BPM to milliseconds
    let beatCount = 0;
    
    // Initial beat visualization
    updateActiveBeat(beatCount - 1);
    
    // Store beatCount globally so nextChord can access it
    window.metronomeBeatCount = beatCount;
    
    // Update metronome beat
    metronomeInterval = setInterval(() => {
        playClick(window.metronomeBeatCount);
        window.metronomeBeatCount++;
    }, beatInterval);
    
    // Update round timer
    roundTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            // Reset timer for the next round
            timeLeft = roundDuration;
            
            // Move to next round and update display
            currentRound++;
            updateRoundDisplay();
            
            // Check if we've completed all rounds
            if (currentRound > totalRounds) {
                stopMetronome();
                return;
            }
            
            // Update to next chord
            updateChord();
        }
    }, 1000);
}

// Stop the metronome
function stopMetronome() {
    clearInterval(metronomeInterval);
    clearInterval(roundTimer);
    isPlaying = false;
    updateToggleButton(false);
    chordDisplay.classList.remove('active');
    currentRound = 0;
    timeLeft = 0;
    
    // Reset to initial values
    const roundDuration = parseInt(roundDurationInput.value);
    timeLeft = roundDuration;
    updateTimerDisplay(timeLeft);
    updateRoundDisplay();
}

// Go to next chord manually
function nextChord() {
    // If this is the first click, initialize the chord index properly
    if (currentChordIndex === -1) {
        currentChordIndex = 0; // Set to 0 so the first update shows the next chord
    }
    
    updateChord();
    
    if (isPlaying) {
        // Reset beat counter and update visualization to show first beat
        if (window.metronomeBeatCount !== undefined) {
            window.metronomeBeatCount = 0;
            updateActiveBeat(-1); // This will make beat 1 active (0 % 4 + 1 = 1)
        }
        
        // Reset the round timer
        clearInterval(roundTimer);
        timeLeft = parseInt(roundDurationInput.value);
        updateTimerDisplay(timeLeft);
        
        roundTimer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                updateChord();
                timeLeft = parseInt(roundDurationInput.value);
                currentRound++;
                
                if (totalRounds > 0) {
                    document.getElementById('roundDisplay').textContent = `Round ${currentRound} of ${totalRounds}`;
                }
            }
        }, 1000);
    } else {
        // If not playing, just update the visualization to show first beat
        updateActiveBeat(-1);
    }
}

// Update BPM display
function updateBpmValue() {
    bpmValue.textContent = bpmInput.value;
}

// Get the currently selected chords from checkboxes
function getSelectedChords() {
    const selectedChords = [];
    chordCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedChords.push(checkbox.value);
        }
    });
    return selectedChords.length > 0 ? selectedChords : ['C']; // Default to C if none selected
}

// Generate a random chord progression from selected chords
function generateRandomProgression(length = 4) {
    const selectedChords = getSelectedChords();
    const progression = [];
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * selectedChords.length);
        progression.push(selectedChords[randomIndex]);
    }
    
    return progression;
}

// Set a new chord progression
function setProgression(progression) {
    // If no progression is provided, generate a random one from selected chords
    if (!progression) {
        currentProgression = generateRandomProgression(4);
    } else {
        currentProgression = progression.split(',');
    }
    
    currentChordIndex = 0;
    currentRound = 1;
    totalRounds = parseInt(totalRoundsInput.value) || currentProgression.length;
    
    // Update chord displays and images
    const currentChord = currentProgression[0];
    const nextChord = currentProgression[1] || currentProgression[0];
    
    currentChordEl.textContent = currentChord;
    nextChordEl.textContent = nextChord;
    
    // Update chord images
    updateChordImage(currentChordImage, currentChord);
    updateChordImage(nextChordImage, nextChord);
    
    // Update round display
    updateRoundDisplay();
    
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

// Event Listeners
startBtn.addEventListener('click', toggleMetronome);
nextBtn.addEventListener('click', nextChord);
bpmInput.addEventListener('input', updateBpmValue);

// Update chord library when progression changes
chordProgressionSelect.addEventListener('change', updateChordLibrary);

// Progression buttons
progressionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setProgression(btn.dataset.progression);
    });
});

// Update progression when chord selection changes
chordCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // If no chords are selected, prevent unchecking and show a message
        const selectedChords = getSelectedChords();
        if (selectedChords.length === 0) {
            checkbox.checked = true; // Re-check the current one
            alert('At least one chord must be selected');
            return;
        }
        
        // Generate a new progression with the updated chord selection
        setProgression();
    });
});

// Update round display when total rounds changes
totalRoundsInput.addEventListener('change', () => {
    totalRounds = parseInt(totalRoundsInput.value) || 4;
    if (totalRounds < 1) {
        totalRounds = 1;
        totalRoundsInput.value = 1;
    }
    // Reset current round to 1 when changing total rounds
    currentRound = 1;
    updateRoundDisplay();
});

// Initialize
updateBpmValue();
populateProgressionDropdown();
updateChordLibrary();

// Touch start event for mobile devices
document.addEventListener('touchstart', function() {
    if (!audioContext) {
        initAudio();
    }
}, { once: true });

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
            stopMetronome();
        } else {
            startMetronome();
        }
    } else if (e.code === 'ArrowRight' || e.code === 'KeyN') {
        nextChord();
    } else if (e.code === 'Escape') {
        stopMetronome();
    }
});