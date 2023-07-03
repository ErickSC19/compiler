import * as ohm from 'ohm-js';
const prog = ohm.grammar(String.raw`
Lang {
  program = "program.init;" body
  body = declaration principal --decrbody
    | principal
  declaration = "var" list_id ":" types ";" aux1 ?
  aux1 = list_id ":" types ";" aux1 ?
  list_id = "IDENTIFIER" aux2 ?
  aux2 = ",IDENTIFIER" aux2 ? 
  types = standard | vec
  standard = "int" | "float" | "string" | "boolean"
  principal = "{" statutes "}"
  statutes = estatute ";" statutes ?
  vec = "array[INTEGER..INTEGER" aux3
  aux3 = ",INTEGER..INTEGER" aux3 | "]of" standard
  estatute = asignation | forloop | whileloop | repeatloop | input | output | conditional
  asignation = var "=" expresion
  var = "IDENTIFIER" aux4?
  aux4 = "[" expresion aux5 
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
  conditional = "if(" expresion ")then{" statutes aux8
  aux8 = "}else{" statutes "}" --doelse
    |  "}"
  expresion = exp aux9 ?
  aux9 = relational expresion 
  exp = term aux10 ?
  aux10 = "+" exp --plus
    | "-" exp --less
    | "||" exp --or
  relational = "==" | "<" | ">" | "<=" | ">=" | "!=" 
  term = factor aux11 ?
  aux11 = "*" factor --mult
    | "/" factor --div
      | "%" factor --mod
      | "&&" factor --and
  factor = "(" expresion ")" --fexpr
    | var --fvar
      | "true" 
      | "false"
      | "INTEGER" 
      | "FLOAT"
      | "STRING"
      | "!" expresion --neg
}
`);

export const syntacticAnalizer = (tokens) => {
  const matchResult = prog.match(tokens);
  if (!matchResult.failed()) {
    return console.log('Finished successfully');
  } else {
    throw new Error(`Syntax Error: ${matchResult.message}`);
  }
};
