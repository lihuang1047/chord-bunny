// Available chord images - only these have actual image files
export const availableChords = [
    'C', 'G', 'Am', 'Em', 'F'
];

// All possible chords with their roman numeral equivalents
export const allChords = [
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
export const progressionOptions = [
    {
        value: 'basic',
        displayText: 'Basic Chords',
        type: 'random', // Basic allows user selection and random ordering
        chords: allChords.filter(chord => availableChords.includes(chord.name))
    },
    {
        value: 'pop',
        displayText: 'Pop',
        type: 'ordered', // Ordered progressions follow fixed sequences
        sequence: ['C', 'F', 'G', 'Am'], // Fixed order for pop progression
        chords: allChords.filter(chord => ['C', 'F', 'G', 'Am'].includes(chord.name))
    },
    {
        value: 'rock',
        displayText: 'Rock',
        type: 'ordered',
        sequence: ['C', 'G', 'F'], // Fixed order for rock progression
        chords: allChords.filter(chord => ['C', 'G', 'F'].includes(chord.name))
    },
    {
        value: 'christianWorship',
        displayText: 'Christian Worship',
        type: 'ordered',
        sequence: ['G', 'Em', 'C'], // Fixed order for Christian worship progression
        chords: allChords.filter(chord => ['G', 'Em', 'C'].includes(chord.name))
    }
];

// Create a lookup object for easier access
export const progressions = {};
progressionOptions.forEach(option => {
    progressions[option.value] = option.chords;
});
