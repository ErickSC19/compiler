import fs from 'fs';
import readline from 'readline';
import { States, Finals, Reserved } from './table.js';
import { syntacticAnalizer } from './sintax.js';

const inputFile = 'file2.txt';
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
let carry = false;
const rsl = [];

const analyzeChar = (char, position) => {
  const currState = States[state];
  let matched = false;
  if (currState.moves) {
    for (const key in currState.moves) {
      const compare = RegExp(key);
      console.log('Comparison -> ', compare, ' to: <', char, '>');
      console.log('current token -> ', curr);
      const match = char.match(compare);
      console.log('Matched? -> ', !!match);
      if (match) {
        if (currState.will === 'carry') {
          carry = true;
        }
        state = currState.moves[key];
        matched = true;
        curr.length === 0 ? (curr = char) : (curr = curr + char);
        curr = curr.trimStart();
        console.log('new curr <', curr, '>');
        break;
      }
    }
  } else if (currState.will === 'end') {
    rsl.push({ type: Finals[state], value: curr.trim() });
    carry = false;
    matched = true;
    console.log('--> final -> ', curr);
    state = 0;
    curr = '';
    return true;
  } else if (currState.will === 'reserved') {
    if (Object.keys(Reserved).includes(curr[0])) {
      for (let index = 0; index < Reserved[curr[0]].length; index++) {
        const word = Reserved[curr[0]][index];
        if (word.includes(curr)) {
          console.log();
          if (word.length === curr.length) {
            console.log('Reserved -> ', word, ' to: <', curr, '>');
            rsl.push({ type: 'RESERVED', value: curr.trim() });
            carry = false;
            matched = true;
            console.log('--> final -> ', curr);
            state = 0;
            curr = '';
            return true;
          } else {
            curr = curr + char;
            console.log('Reserved -> ', word, ' to: <', curr, '>');
            matched = true;
            break;
          }
        }
      }
    }
  }
  if (!matched) {
    if (currState.will === 'end') {
      if (currState.predates) {
        if (Finals[currState.predates] === rsl[rsl.length - 1].type) {
          rsl.pop();
        }
      }
      rsl.push({ type: Finals[state], value: curr.trim() });
      carry = false;
      matched = true;
      console.log('--> final -> ', curr);
      state = 0;
      curr = '';
      return true;
    } else {
      throw new Error(`Invalid character: ${char}, at position ${position}`);
    }
  }
};

rl.on('line', (line) => {
  try {
    const chars = line.split('');
    console.log(chars, chars.length);
    for (let index = 0; index <= chars.length; index++) {
      let char;
      if (index < chars.length) {
        char = chars[index];
      } else {
        char = ' ';
      }
      const pos = index + 1;
      console.log('   State -> ', state, ' - Pos -> ', index);
      const n = analyzeChar(char, pos);
      if (n) {
        index--;
      }
    }
    lineCount++;
    // Write the results to the output file
    writeStream.write(
      rsl.map((token) => JSON.stringify(token)).join('\n') + '\n'
    );
  } catch (error) {
    lineCount++;
    // writes correct ones
    if (rsl) {
      writeStream.write(
        rsl.map((token) => JSON.stringify(token)).join('\n') + '\n'
      );
    }
    // writes error
    errorStream.write('Error on line ' + lineCount + ' -> ' + error + '\n');
    console.error('Error on line ' + lineCount + ' -> ' + error + '\n');
    // rl.off();
  }
});

// Close the write stream when all lines have been processed
rl.on('close', () => {
  if (carry) {
    console.error(
      'Error on line ' + lineCount + ' -> ' + curr + ' was not closed \n'
    );
    errorStream.write(
      'Error on line ' + lineCount + ' -> ' + curr + ' was not closed \n'
    );
  }
  let res = '';
  for (let index = 0; index < rsl.length; index++) {
    const element = rsl[index];
    if (
      element.type === 'INTEGER' ||
      element.type === 'FLOAT' ||
      element.type === 'IDENTIFIER' ||
      element.type === 'STRING'
    ) {
      res = res.concat(`${element.type}`);
      // tokens = tokens + element.type;
    } else if (element.type !== 'COMMENT') {
      res = res.concat(`${element.value}`);
      // tokens = tokens + curr;
    }
  }
  // console.log('---->', res);
  try {
    console.log(res);
    syntacticAnalizer(res);
  } catch (error) {
    console.log(rsl);
    console.log(error);
    errorStream.write('Syntax Error');
  }
  writeStream.end();
  errorStream.end();
});
