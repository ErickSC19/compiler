import { grammar } from "ohm-js";
const prog = grammar(`
Lang {
    program = "program.init;" body
    body = declaration principal --decrbody
    	| principal
    declaration = "var" list_id ":" types ";" aux1
    aux1 = list_id ":" types ";" aux1 --decrcont
    	| ""
    list_id = "IDENTIFIER" aux2
    aux2 = ",IDENTIFIER" aux2 --listcont
    	| "" 
    types = standard | vec
    standard = "int" | "float" | "string" | "boolean"
    principal = "{" statutes "}"
    statutes = estatute ";" statutes
    vec = "array[INTEGER..INTEGER" aux3
    aux3 = ",INTEGER..INTEGER" aux3 | "]of" standard
    estatute = asignation | forloop | whileloop | repeatloop | input | output | conditional
    asignation = var "=" expresion
    var = "IDENTIFIER" aux4
    aux4 = "[" expresion aux5 --arr
    	| ""
    aux5 = "," expresion aux5 --arrcont
    	| "]"
    repeatloop = "repeat" statutes "until" expresion
    forloop = "for" counter "do{" statutes "}"
    counter = "id=" expresion "for" expresion
    whileloop = "while" expresion "do{" statutes "}"
    input = "read(" var aux6
    aux6 = "," var aux6 --readcont
    	| ")"
    output = "write(" expresion aux7
    aux7 = "," expresion aux7 --writecont
    	| ")"
    conditional = "if" expresion "then{" statutes aux8
    aux8 = "else{" statutes "}" --doelse
    	|  "}"
    expresion = exp aux9
    aux9 = relational expresion --exprel
    	| "EPSILON"
    exp = term aux10
    aux10 = "+" exp --plus
    	| "-" exp --less
    	| "||" exp --or
    	| ""
    relational = "==" | "<" | ">" | "<=" | ">=" | "!=" 
    term = factor aux11
    aux11 = "*" factor --mult
    	| "/" factor --div
        | "%" factor --mod
        | "&&" factor --and
        | ""
    factor = "(" expresion ")" --fexpr
    	| var --fvar
        | "true" 
        | "false"
        | "INTEGER" 
        | "FLOAT"
        | "STRING"
        | "!" expresion --neg
}
`)



export const syntacticAnalizer = (code) => {
    const matchResult = prog.match();
    if (matchResult.succeeded()) {
        return console.log('Finished');
    } else {
        throw new Error('Syntax Error');
    }

}

const parsingMap = {
  "<program>": ["program.init;<body>"],
  "<body>": ["<declaration> <principal>", "<principal>"],
  "<declaration>": ["var <list_id>:<types> ; <aux1>"],
  "<aux1>": ["<list_id> : <types> ; <aux1>", "EPSILON"],
  "<list_id>": ["id <aux2>"],
  "<aux2>": [", id <aux2>", "EPSILON"],
  "<types>": ["<standard>", "<vec>"],
  "<standard>": ["int", "float", "string", "boolean"],
  "<principal>": ["{ <statutes> }"],
  "<statutes>": ["<estatute> ; <statutes>"],
  "<vec>": ["array[INTEGER .. INTEGER <aux3> ] of <standard>"],
  "<aux3>": [",INTEGER .. INTEGER <aux3>", "EPSILON"],
  "<estatute>": [
    "<asignation>",
    "<forloop>",
    "<whileloop>",
    "<repeatloop>",
    "<input>",
    "<output>",
    "<conditional>",
  ],
  "<asignation>": ["<var> = <expresion>"],
  "<var>": ["id <aux4>"],
  "<aux4>": ["[<expresion><aux5>]", "EPSILON"],
  "<aux5>": [",<expresion><aux5>", "EPSILON"],
  "<repeatloop>": ["repeat <statutes> until <expresion>"],
  "<forloop>": ["for <counter> do {<statutes>}"],
  "<counter>": ["id=<expresion> for <expresion>"],
  "<whileloop>": ["while <expresion> do { <statutes> }"],
  "<input>": ["read( <var> <aux6> )"],
  "<aux6>": [", <var> <aux6>", "EPSILON"],
  "<output>": ["write( <var> <aux7> )"],
  "<aux7>": [", <var> <aux7>", "EPSILON"],
  "<conditional>": ["if <expresion> then { <statutes> } <aux8>"],
  "<aux8>": ["else { <statutes> } ", "EPSILON"],
  "<expresion>": ["<exp> <aux9>"],
  "<aux9>": ["<relational> <exp>", "EPSILON"],
  "<exp>": ["<term> <aux10>"],
  "<aux10>": ["+ <exp>", "- <exp>", "|| <exp>", "EPSILON"],
  "<relational>": ["==", "<", ">", "<=", ">=", "!="],
  "<term>": ["<factor> <aux11>"],
  "<aux11>": ["*<factor>", "/<factor>", "%<factor>", "&&<factor>", "EPSILON"],
  "<factor>": [
    "(<expresion>)",
    "<var>",
    "true",
    "false",
    "INTEGER",
    "FLOAT",
    "STRING",
    "! <expresion>",
  ],
};

const grammars = {
  "program.init": ["<program>"],
  "*": [""],
  id: ["<aux1>", "<list_id>"],
  var: ["<body>", "<declaration>"],
  EPSILON: [""],
  ",": [""],
  ";": [""],
  ":": [""],
  int: [""],
  float: [""],
  string: [""],
  boolean: [""],
  "(": [""],
  ")": [""],
  true: [""],
  false: [""],
  "{": ["<body>"],
  array: [""],
  "[": [""],
  "]": [],
  repeat: [""],
  for: [""],
  while: [""],
  read: [""],
  write: [""],
  if: [""],
  then: [""],
  do: [""],
  else: [""],
  "!": [""],
  "+": [""],
  "-": [""],
  "||": [""],
  "=": [""],
  "==": [""],
  "<": [""],
  ">": [""],
  "<=": [""],
  ">=": [""],
  "!=": [""],
  "/": [""],
  "%": [""],
  "&&": [""],
  "INTEGER": [""],
  "FLOAT": [""],
  "STRING": [""],
};

export function u3Grammars(sentence, grammar) {
  const original = sentence;
  let res = false;
  function S(str, rule) {
    if (!rule) {
      rule = Object.keys(grammar)[0];
      str = Object.keys(grammar)[0];
    }
    // console.log('before:' + str + rule);
    const rIncluded = Object.keys(grammar).some((value) => str.includes(value));
    if (rIncluded && str.length <= original.length) {
      for (let i = 0; i < grammar[rule].length; i++) {
        const gen = str.replace(rule, grammar[rule][i]);
        const left = Object.keys(grammar).some((value) => gen.includes(value));
        // console.log('::=' + gen);
        if (left) {
          for (let index = 0; index < Object.keys(grammar).length; index++) {
            const element = Object.keys(grammar)[index];
            if (gen.includes(element)) {
              // console.log(gen, element);
              const ver = S(gen, element);
              if (ver) {
                return true;
              } else {
                res = ver;
              }
            }
          }
        } else {
          if (gen === original) {
            console.log(original + " = " + gen);
            res = true;
            break;
          } else {
            res = false;
            break;
          }
        }
      }
    } else {
      // console.log(str, rule);
      if (str === original) {
        return true;
      } else {
        res = false;
      }
    }
    return res;
  }
  const result = S();
  return result;
}

let currSintax = "";
const posibleProductions = [];

export const sintaxAnalyzer = (tokens, res) => {
  if (!posibleProductions && !currSintax) {
    if (tokens[0].type === "RESERVED") {
      currSintax.concat(tokens[0].value);
    } else {
      currSintax.concat(tokens[0].type);
    }
    Object.keys(grammars).includes(currSintax);
  }
};

function parser(tokens) {
  // Again we keep a `current` variable that we will use as a cursor.
  let current = 0;

  // But this time we're going to use recursion instead of a `while` loop. So we
  // define a `walk` function.
  function walk() {
    // Inside the walk function we start by grabbing the `current` token.
    let token = tokens[current];

    // We're going to split each type of token off into a different code path,
    // starting off with `number` tokens.
    //
    // We test to see if we have a `number` token.
    if (token.type === "number") {
      // If we have one, we'll increment `current`.
      current++;

      // And we'll return a new AST node called `NumberLiteral` and setting its
      // value to the value of our token.
      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    // If we have a string we will do the same as number and create a
    // `StringLiteral` node.
    if (token.type === "string") {
      current++;

      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    // Next we're going to look for CallExpressions. We start this off when we
    // encounter an open parenthesis.
    if (token.type === "paren" && token.value === "(") {
      // We'll increment `current` to skip the parenthesis since we don't care
      // about it in our AST.
      token = tokens[++current];

      // We create a base node with the type `CallExpression`, and we're going
      // to set the name as the current token's value since the next token after
      // the open parenthesis is the name of the function.
      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      // We increment `current` *again* to skip the name token.
      token = tokens[++current];

      // And now we want to loop through each token that will be the `params` of
      // our `CallExpression` until we encounter a closing parenthesis.
      //
      // Now this is where recursion comes in. Instead of trying to parse a
      // potentially infinitely nested set of nodes we're going to rely on
      // recursion to resolve things.
      //
      // To explain this, let's take our Lisp code. You can see that the
      // parameters of the `add` are a number and a nested `CallExpression` that
      // includes its own numbers.
      //
      //   (add 2 (subtract 4 2))
      //
      // You'll also notice that in our tokens array we have multiple closing
      // parenthesis.
      //
      //   [
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'add'      },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'subtract' },
      //     { type: 'number', value: '4'        },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
      //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
      //   ]
      //
      // We're going to rely on the nested `walk` function to increment our
      // `current` variable past any nested `CallExpression`.

      // So we create a `while` loop that will continue until it encounters a
      // token with a `type` of `'paren'` and a `value` of a closing
      // parenthesis.
      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        // we'll call the `walk` function which will return a `node` and we'll
        // push it into our `node.params`.
        node.params.push(walk());
        token = tokens[current];
      }

      // Finally we will increment `current` one last time to skip the closing
      // parenthesis.
      current++;

      // And return the node.
      return node;
    }

    // Again, if we haven't recognized the token type by now we're going to
    // throw an error.
    throw new TypeError(token.type);
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  let ast = {
    type: "Program",
    body: [],
  };

  // And we're going to kickstart our `walk` function, pushing nodes to our
  // `ast.body` array.
  //
  // The reason we are doing this inside a loop is because our program can have
  // `CallExpression` after one another instead of being nested.
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // At the end of our parser we'll return the AST.
  return ast;
}
