import fs from 'fs';
import readline from 'readline';
import { States, Finals } from './table.js';

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

// Process each line of the input file
let lineCount = 0;
let curr = '';
let state = 0;
const rsl = [];
rl.on('line', (line) => {
  const analyzeChar = (char, position) => {
    const currState = States[state];
    let matched = false;
    if (currState.moves) {
      for (const key in currState.moves) {
        const compare = RegExp(key);
        console.log('Comparison -> ', compare, ' to: <', char, '>');
        console.log('current token -> ', curr);
        const match = char.match(compare);
        console.log('Matched? -> ', match);
        if (match) {
          state = currState.moves[key];
          matched = true;
          curr = curr + char;
          break;
        }
      }
    } else if (currState.will === 'end') {
      rsl.push({ type: Finals[state], value: curr });
      matched = true;
      console.log('   final -> ', curr);
      state = 0;
      curr = '';
    }
    if (!matched) {
      if (currState.will === 'end') {
        rsl.push({ type: Finals[state], value: curr });
        matched = true;
        console.log('   final -> ', curr);
        state = 0;
        curr = '';
      } else {
        throw new Error(`Invalid character: ${char}, at position ${position}`);
      }
    }
  };

  try {
    const chars = line.split('');

    for (let index = 0; index < chars.length; index++) {
      const char = chars[index];
      const pos = index + 1;
      console.log('   State -> ', state);
      analyzeChar(char, pos);
    }

    lineCount++;
    // Write the results to the output file
    writeStream.write(
      rsl.map((token) => JSON.stringify(token)).join('\n') + '\n'
    );
  } catch (error) {
    lineCount++;
    errorStream.write('Error on line ' + lineCount + ' -> ' + error);
    console.error('Error on line ' + lineCount + ' -> ' + error);
  }
});

// Close the write stream when all lines have been processed
rl.on('close', () => {
  console.log(rsl);
  console.log('Finished');
  writeStream.end();
});
