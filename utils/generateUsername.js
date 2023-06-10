import fs from 'node:fs';

function generateCombinations() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const characters = `${letters}${digits}`
    const combinations = [];

    for (let i = 0; i < characters.length; i++) {
        for (let j = 0; j < characters.length; j++) {
            for (let k = 0; k < characters.length; k++) {
                const combination = characters[i] + characters[j] + characters[k];
                combinations.push(combination);
            }
        }
    }

    return combinations;
}

// Generate combinations
const combinations = generateCombinations();

// Write combinations to a text file
if (!fs.existsSync(`generated/combinations_${combinations[0]}.txt`)) {
    if (!fs.existsSync(`generated/`)) {
        fs.mkdirSync(`generated/`, { recursive: true });
        console.log('Generate directory created successfully.');
    }

    fs.writeFile(`generated/combinations_${combinations[0]}.txt`, combinations.join('\n'), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Combinations have been written to combinations.txt');
    });
}