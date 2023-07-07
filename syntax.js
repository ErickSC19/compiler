import * as ohm from "ohm-js";
import { SymbolsTableGlobal } from "./symbols.js";
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

export const syntacticAnalizer = (tokens, rsl) => {
  const matchResult = prog.match(tokens);
  if (!matchResult.failed()) {
    const toksArr = rsl;
    let declaring = false;
    let currType = "";
    for (let index = 0; index < toksArr.length; index++) {
      const element = toksArr[index];
      if (element.type === "RESERVED" && element.value === "var") {
        declaring = true;
        const typ = toksArr.findIndex((el) => el.type === "COLON");
        currType = toksArr[typ + 1].value;
        continue;
      }
      if (element.type === "IDENTIFIER") {
        if (currType) {
          SymbolsTableGlobal.add(element.value, currType, null);
        } else if (toksArr[index + 1].type === "EQUAL") {
          const newVal = toksArr[index + 2].value;
          let atype = toksArr[index + 2].type.toLocaleLowerCase();
          if (newVal === "true" || newVal === "false") {
            atype = "boolean";
          }
          console.log(element);
          SymbolsTableGlobal.update(element.value, newVal, atype);
        }
        if (
          toksArr[index + 1].type === "COLON"
        ) {
          if (toksArr[index + 4].type === "IDENTIFIER") {
            const currArr = toksArr.slice(index + 4);
            const typ = currArr.findIndex((el) => el.type === "COLON");
            currType = currArr[typ + 1].value;
          } else {
            currType = "";
            declaring = false;
          }
        }
      }
    }
    console.log("Finished successfully");
    return SymbolsTableGlobal.symbols;
  } else {
    throw new Error(`Syntax Error: ${matchResult.message}`);
  }
};
