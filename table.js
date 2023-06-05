export const States = {
  0: {
    moves: {
      '\\s': 0,
      '\\t': 0,
      '\\$': 1,
      '\\d': 4,
      "'": 7,
      '\\/': 10,
      '\\*': 23,
      '\\+': 24,
      '=': 15,
      '-': 25,
      '>': 17,
      '<': 19,
      '!': 21,
      '\\|': 26,
      '&': 28,
      '{': 30,
      '}': 31,
      '\\[': 33,
      '\\]': 34,
      '\\(': 36,
      '\\)': 37,
      ';': 39,
      ':': 40
    }
  },
  1: {
    moves: { '[a-zA-Z_]': 2 }
  },
  2: {
    moves: { '[a-zA-Z_]': 2, '\\d': 3 },
    will: 'end'
  },
  3: {
    moves: { '[a-zA-Z_]': 2, '\\d': 3 },
    will: 'end'
  },
  4: {
    moves: { '\\d': 4, '\\.': 5 },
    will: 'end'
  },
  5: {
    moves: { '\\d': 6 }
  },
  6: {
    moves: { '\\d': 6 },
    will: 'end',
    predates: 4
  },
  7: {
    moves: { "^[^']*$": 8, "'": 9 },
    will: 'carry'
  },
  8: {
    moves: { "^[^']*$": 8, "'": 9 }
  },
  9: {
    will: 'end'
  },
  10: {
    moves: { '\\*': 11 },
    will: 'end'
  },
  11: {
    moves: { '^[^\\*]': 12, '\\*': 13 },
    will: 'carry'
  },
  12: {
    moves: { '^[^\\*]': 12, '\\*': 13 }
  },
  13: {
    moves: { '\\/': 14 }
  },
  14: {
    will: 'end'
  },
  15: {
    moves: { '=': 16 },
    will: 'end'
  },
  16: {
    will: 'end',
    predates: 15
  },
  17: {
    moves: { '=': 18 },
    will: 'end'
  },
  18: {
    will: 'end',
    predates: 17
  },
  19: {
    moves: { '=': 20 },
    will: 'end'
  },
  20: {
    will: 'end',
    predates: 19
  },
  21: {
    moves: { '=': 22 },
    will: 'end'
  },
  22: {
    will: 'end',
    predates: 21
  },
  23: {
    will: 'end'
  },
  24: {
    will: 'end'
  },
  25: {
    will: 'end'
  },
  26: {
    moves: { '\\|': 27 }
  },
  27: {
    will: 'end'
  },
  28: {
    moves: { '&': 29 }
  },
  29: {
    will: 'end'
  },
  30: {
    will: 'end'
  },
  31: {
   will: 'end'
  },
  32: {
    will: 'end'
  },
  33: {
    will: 'end'
  },
  34: {
    moves: 'end'
  },
  35: {
    will: 'end'
  },
  36: {
    will: 'end'
  },
  37: {
    will: 'end'
  },
  38: {
    will: 'end'
  },
  39: {
    will: 'end'
  },
  40: {
    will: 'end'
  }
};

export const Finals = {
  2: 'IDENTIFIER',
  3: 'IDENTIFIER',
  4: 'INTEGER',
  6: 'FLOAT',
  9: 'STRING',
  10: 'DIVIDE',
  14: 'COMMENT',
  15: 'EQUAL',
  16: 'IS EQUALS',
  17: 'MORE',
  18: 'MORE OR EQUAL',
  19: 'LESSER',
  20: 'LESSER OR EQUAL',
  21: 'NEGATIVE',
  22: 'DIFFERENT',
  23: 'MULTIPLY',
  24: 'PLUS',
  25: 'MINUS',
  27: 'OR',
  29: 'AND',
  30: 'OPEN BRACKETS',
  31: 'CLOSE BRACKETS',
  33: ' OPEN [',
  34: 'CLOSE ]',
  36: 'OPEN PARENTESIS',
  37: 'CLOSE PARENTESIS',
  39: 'SEMI-COLON',
  40: 'COLON'
};
