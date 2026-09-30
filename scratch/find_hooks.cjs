const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            walk(path.join(dir, file), fileList);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

const files = walk('C:/Users/lenovo/Desktop/WEBBDEV/JDCA/src');
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let earlyReturnLevel = -1;
    let hookLevel = -1;
    let lastReturnLine = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Match return statement
        const returnMatch = line.match(/^(\s*)(if\s*\(.*?\)\s*)?return\b/);
        if (returnMatch) {
            const indentLevel = returnMatch[1].length;
            // Only care about top-level returns (e.g. indent length 2 or 4 in components)
            if (indentLevel <= 4) { 
                earlyReturnLevel = indentLevel;
                lastReturnLine = i + 1;
            }
        }
        
        // Reset if we see a closing brace at the same or outer level (end of function)
        const braceMatch = line.match(/^(\s*)\}/);
        if (braceMatch) {
            if (braceMatch[1].length <= earlyReturnLevel) {
                earlyReturnLevel = -1; // End of component function
            }
        }

        // Match hook
        if (earlyReturnLevel !== -1) {
            const hookMatch = line.match(/^(\s*)(const|let|var)\s+.*?=\s*use[A-Z]\w*\(/);
            if (hookMatch) {
                const indentLevel = hookMatch[1].length;
                if (indentLevel <= 4) {
                    console.log(`File: ${file} (Return at ${lastReturnLine}, Hook at ${i + 1})`);
                    // reset to avoid spamming
                    earlyReturnLevel = -1;
                }
            }
        }
    }
}
