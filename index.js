import fs from 'fs';
import readline from 'readline';
import { tokenPatterns } from './table.js';
import { tokens, States, Finals } from './table.js';

const inputFile = 'file.txt';
const outputFile = 'output.txt';
const errorFile = 'error.txt';

// Create a readable stream to read the input file line by line
const readStream = fs.createReadStream(inputFile, 'utf8');

// Create a writable stream to write the results to the output file
const writeStream = fs.createWriteStream(outputFile, 'utf8');

// Create a writable stream to write the results to the error file
const errorStream = fs.createWriteStream(errorFile, 'utf8');

// Create an interface to read lines from the input stream
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity
});

// Tokenize the source code line by line
const analyzeLine = (line) => {
  const results = [];
  let prev = '';
  let source = line;
  let totalCount = line.length;
  let count = 0;

  while (source.length) {
    let foundMatch = false;
    count++;

    // Check for each token pattern
    for (const token in tokenPatterns) {
      const pattern = tokenPatterns[token];
      const match = source.match(pattern);

      if (match) {
        foundMatch = true;
        prev = match[0];
        // Add the matched token to the results
        results.push({ type: tokens[token], value: match[0] });

        // Remove the matched token from the source code
        source = source.slice(match[0].length);
        // console.log(source);
        break;
      }
    }

    if (!foundMatch) {
      // If no match is found, there is an invalid character
      let position = totalCount - source.length + count;
      throw new Error(
        `Invalid character: ${source[0]}, at position ${position}`
      );
    }
  }

  return results;
};

// Process each line of the input file
let lineCount = 0;
rl.on('line', (line) => {
  try {
    const results = analyzeLine(line);

    lineCount++;
    // Write the results to the output file
    writeStream.write(
      results.map((token) => JSON.stringify(token)).join('\n') + '\n'
    );
  } catch (error) {
    lineCount++;
    errorStream.write('Error on line ' + lineCount + ' -> ' + error);
    console.error('Error on line ' + lineCount + ' -> ' + error);
  }
});

// Close the write stream when all lines have been processed
rl.on('close', () => {
  console.log('Finished');
  writeStream.end();
});

function verify(States, Finals, line) {
  let results = { data: [], error: [] };
  function recursiveCheck(state, nline, results, carries) {
    const curr = line.slice(0, 1);
    const nextLine = line.slice(1, -1);
    for (const key in States.moves) {
      let compare = '';
      if (key.length > 1) {
        if (curr === key) {
          recursiveCheck(States.moves[key], nextLine, results, carries);
        }
      } else {
      }
    }
  }
  try {
    results = recursiveCheck(0, line, results, false);
    return;
  } catch (error) {
    results = error;
    throw new Error(results);
  }
}
