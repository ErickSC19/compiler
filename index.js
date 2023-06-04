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

// Tokenize the source code line by line
const analyzeLine = (line) => {
  const results = [];
  let prev = '';
  let source = line;
  const totalCount = line.length;
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
      const position = totalCount - source.length + count;
      throw new Error(
        `Invalid character: ${source[0]}, at position ${position}`
      );
    }
  }

  return results;
};

// Process each line of the input file
let lineCount = 0;
let curr = '';
let state = 0;
const rsl = [];
rl.on('line', (line) => {
  const analyzeChar = (char, position) => {
    console.log(state);
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
    writeStream.write(
      error.data.map((token) => JSON.stringify(token)).join('\n') + '\n'
    );
    errorStream.write('Error on line ' + lineCount + ' -> ' + error.error);
    console.error('Error on line ' + lineCount + ' -> ' + error.error);
  }
});

// Close the write stream when all lines have been processed
rl.on('close', () => {
  console.log(rsl);
  console.log('Finished');
  writeStream.end();
});

/* function verify(line) {
  let results = { data: [], error: [] };

  const recursiveCheck = (state, nline, results, carries, currCheck) => {
    if (nline.length === 0) {
      if (carries) {
        return {
          state: state,
          data: results,
          carries: carries,
          curr: currCheck,
        };
      } else {
        return {
          data: results,
        };
      }
    }
    const currState = States[state];
    const curr = line.slice(0, 1);
    const nextLine = line.slice(1, -1);
    if (currState.moves) {
      for (const key in currState.moves) {
        const compare = RegExp(key);
        const match = curr.match(compare);
        if (match) {
          const willCarry = currState?.will === "carries" ? true : false;
          const nextCheck = currCheck.concat(curr);
          return recursiveCheck(
            currState.moves[key],
            nextLine,
            results,
            willCarry,
            nextCheck
          );
        }
      }
    } else if (currState?.will === "end") {
      results.push({ type: Finals[state], value: currCheck });
      recursiveCheck(currState.moves[key], nextLine, results, false, "");
    }
  };
  try {
    results = recursiveCheck(0, line, results, false);
    return;
  } catch (error) {
    results = error;
    throw new Error(results);
  }
}
 */
