export const tokenPatterns = {
  identifier: /^\$[a-zA-Z_]\w*/,
  float: /^\d+(\.\d+)/,
  integer: /^\d+/,
  string: /^\'.*\'/,
  comment: /^\/\*.*\*\//,
  plus: /^\+/,
  minus: /^-/,
  div: /^\//,
  multiply: /^\*/,
  equal: /^==/,
  assign: /^=/,
  and: /^&&/,
  or: /^\|\|/,
  different: /^!=/,
  bigequ: /^>=/,
  minequ: /^<=/,
  big: /^>/,
  min: /^</,
  no: /^!/,
  semicolon: /^;/,
  colon: /^:/,
  whitespace: /^\s+/,
  tab: /^\t+/,
  break: /^\n+/
};

export const tokenCarryPatterns = {
  integer: /^\d+/,
  string: /^(\n+)?.*\'/,
  comment: /^(\n+)?.*\*\//
};

export const tokens = {
  identifier: 'IDENTIFIER',
  integer: 'INTEGER',
  float: 'FLOAT',
  string: 'STRING',
  comment: 'COMMENT',
  plus: 'PLUS',
  minus: 'MINUS',
  div: 'DIVISION',
  multiply: 'MULTIPLY',
  assign: 'ASSIGN',
  equal: 'EQUAL',
  and: 'AND',
  or: 'OR',
  different: 'DIFFERENT',
  bigequ: 'MORE OR EQUAL',
  minequ: 'LESS OR EQUAL',
  big: 'MORE',
  min: 'LESS',
  no: 'NEGATION',
  semicolon: 'SEMICOLON',
  colon: 'COLON',
  whitespace: 'WHITESPACE',
  tab: 'TAB',
  break: 'LINE-BREAK'
};

export const States = {
  0: {
    moves: {
      $: 1,
      '^d+': 4,
      "'": 6,
      '/': 9,
      '*': 22,
      '+': 23,
      '=': 14,
      '-': 24,
      '>': 16,
      '<': 18,
      '!': 20,
      '|': 25,
      '&': 27,
      ';': 38,
      ':': 39
    }
  },
  1: {
    moves: { '/^$[a-zA-Z_]w*/': 2 }
  },
  2: {
    moves: { '^\\$[a-zA-Z_]\\w*': 2, '^d+': 3 },
    will: 'end'
  },
  3: {
    moves: { '^\\$[a-zA-Z_]\\w*': 2, '^d+': 3 },
    will: 'end'
  },
  4: {
    moves: { '^d+': 4, '.': 5 },
    will: 'end'
  },
  5: {
    moves: { '^d+': 6 }
  },
  6: {
    moves: { '^d+': 6 },
    will: 'end'
  },
  7: {
    moves: { '^.*': 8 },
    will: 'carry'
  },
  8: {
    moves: { '^.*': 8, "'": 9 }
  },
  9: {
    will: 'end'
  },
  10: {
    moves: { '*': 11 },
    will: 'end'
  },
  11: {
    moves: { '^.*': 12 },
    will: 'carry'
  },
  12: {
    moves: { '^.*': 12, '*': 13 }
  },
  13: {
    moves: { '/': 14 }
  },
  14: {
    will: 'end'
  },
  15: {
    moves: { '=': 16 },
    will: 'end'
  },
  16: {
    will: 'end'
  },
  17: {
    moves: { '=': 18 },
    will: 'end'
  },
  18: {
    will: 'end'
  },
  19: {
    moves: { '=': 20 },
    will: 'end'
  },
  20: {
    will: 'end'
  },
  21: {
    moves: { '=': 22 },
    will: 'end'
  },
  22: {
    will: 'end'
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
    moves: { '|': 27 }
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
    moves: { '^.*': 31, '}': 32 },
    will: 'carry'
  },
  31: {
    moves: { '^.*': 31, '}': 32 }
  },
  32: {
    will: 'end'
  },
  33: {
    moves: { '^.*': 34, '}': 35 },
    will: 'carry'
  },
  34: {
    moves: { '^.*': 34, '}': 35 }
  },
  35: {
    will: 'end'
  },
  36: {
    moves: { '^.*': 37, '}': 38 },
    will: 'carry'
  },
  37: {
    moves: { '^.*': 37, '}': 38 }
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
  14: 'COMMENT',
  15: 'EQUAK',
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
  32: 'BRACKETS',
  35: '[sdda]',
  38: 'PARENTASIS',
  39: 'SEMI-COLON',
  40: 'COLON'
};
