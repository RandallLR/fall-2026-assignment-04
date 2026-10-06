import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2] || 'docs/architecture/schema.mmd';
const outputFile = process.argv[3] || 'docs/architecture/erd.svg';

const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(inputFile)) {
  console.error(`SYNTAX_ERROR: Input file does not exist: ${inputFile}`);
  process.exit(1);
}

try {
  execSync(`npx mmdc -i "${inputFile}" -o "${outputFile}"`, {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  console.log('SUCCESS');
  process.exit(0);
} catch (error) {
  const stderr = error.stderr ? error.stderr.toString() : (error.message || 'Unknown error');
  console.error(`SYNTAX_ERROR:\n${stderr}`);
  process.exit(1);
}
