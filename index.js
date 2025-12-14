// DOM Elements
const currentChordEl = document.getElementById('currentChord');
const nextChordEl = document.getElementById('nextChord');
const currentChordImage = document.getElementById('currentChordImage');
const nextChordImage = document.getElementById('nextChordImage');
const bpmInput = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');
const chordDuration = document.getElementById('chordDuration');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const nextBtn = document.getElementById('nextBtn');
const progressionBtns = document.querySelectorAll('.progression-btn');
const chordDisplay = document.querySelector('.chord-display');

// Audio Context and Nodes
let audioContext;
let metronomeInterval;
let beatCount = 0;
let isPlaying = false;
let currentChordIndex = 0;
let currentProgression = ['C', 'G', 'Am', 'F']; // Default progression

// Initialize audio context on user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play a metronome click sound
function playClick(beat) {
    if (!audioContext) initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = beat === 0 ? 'sine' : 'sine';
    oscillator.frequency.value = beat === 0 ? 800 : 400;
    
    gainNode.gain.value = 0.1;
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Update chord display and charts
function updateChord() {
    // Set current chord to next chord, and get the following chord
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
}

// Update a chord image element with the appropriate chord diagram
function updateChordImage(imageElement, chordName) {
    // Assuming chord images are named like "C.png", "G.png", etc.
    // Fallback to a default image if the chord image doesn't exist
    imageElement.src = `chords/${chordName}.png`;
    imageElement.alt = `${chordName} Chord`;
    
    // Handle image loading errors
    imageElement.onerror = function() {
        console.warn(`Chord image not found: ${chordName}.png`);
        // You could set a default/placeholder image here if desired
        // imageElement.src = 'chords/default.png';
    };
}

// Start the metronome
function startMetronome() {
    if (isPlaying) return;
    
    isPlaying = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    const bpm = parseInt(bpmInput.value);
    const beatsPerMeasure = 4; // 4/4 time
    const interval = (60 / bpm) * 1000; // Convert BPM to milliseconds
    
    // Initial chord display
    currentChordIndex = 0;
    updateChord();
    
    // Start metronome
    let beat = 0;
    metronomeInterval = setInterval(() => {
        playClick(beat);
        
        // Change chord based on selected duration
        const duration = parseInt(chordDuration.value);
        if (beat % duration === 0 && beat > 0) {
            updateChord();
        }
        
        beat = (beat + 1) % beatsPerMeasure;
    }, interval);
}

// Stop the metronome
function stopMetronome() {
    clearInterval(metronomeInterval);
    isPlaying = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    chordDisplay.classList.remove('active');
}

// Go to next chord manually
function nextChord() {
    if (!isPlaying) {
        updateChord();
    }
}

// Update BPM display
function updateBpmValue() {
    bpmValue.textContent = bpmInput.value;
}

// Set a new chord progression
function setProgression(progression) {
    currentProgression = progression.split(',');
    currentChordIndex = 0;
    
    // Update chord displays and images
    const currentChord = currentProgression[0];
    const nextChord = currentProgression[1] || currentProgression[0];
    
    currentChordEl.textContent = currentChord;
    nextChordEl.textContent = nextChord;
    
    // Update chord images
    updateChordImage(currentChordImage, currentChord);
    updateChordImage(nextChordImage, nextChord);
    
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

// Event Listeners
startBtn.addEventListener('click', startMetronome);
stopBtn.addEventListener('click', stopMetronome);
nextBtn.addEventListener('click', nextChord);
bpmInput.addEventListener('input', updateBpmValue);

// Progression buttons
progressionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setProgression(btn.dataset.progression);
    });
});

// Initialize
updateBpmValue();

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