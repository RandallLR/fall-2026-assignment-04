
import { execSync } from "node:child_process";
import path from 'node:path';

let inputFile = process.argv[2];
if (!inputFile) {
    inputFile = 'docs/architecture/schema.mmd';
}
const inputPath = path.resolve('docs/architecture/schema.mmd');
const outputPath = path.resolve('docs/architecture/erd.svg');

const command = 'npx mmdc - i' + inputPath + ' -o ' + outputPath + '';

try {
    execSync (command, {
        stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    console.log('SUCCESS');
    process.exit(0);
} catch (error) {
    let errorMessage = error.message;
    if (error.stderr) {
        errorMessage = error.stderr.toString().trim();
    }

    console.error('SYNTAX_ERROR: ' + errorMessage);
    process.exit(1);
}