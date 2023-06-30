const parsingMap = {
  '<program>': ['program.init; <body>'],
  '<body>': ['<declaration> <principal>', '<principal>'],
  '<declaration>': ['var <list_id>:<types> ; <aux1>'],
  '<aux1>': ['<list_id> : <types> ; <aux1>', 'EPSILON'],
  '<list_id>': ['id <aux2>'],
  '<aux2>': [', id <aux2>', 'EPSILON'],
  '<types>': ['<standard>', '<vec>'],
  '<standard>': ['int', 'float', 'string', 'boolean'],
  '<principal>': ['{ <statutes> }'],
  '<statutes>': ['<estatute> ; <statutes>'],
  '<vec>': ['array[cte.int .. cte.int <aux3> ] of <standard>'],
  '<aux3>': [',cte.int .. cte.int <aux3>', 'EPSILON'],
  '<estatute>': [
    '<asignation>',
    '<forloop>',
    '<whileloop>',
    '<repeatloop>',
    '<input>',
    '<output>',
    '<conditional>'
  ],
  '<asignation>': ['<var> = <expresion>'],
  '<var>': ['id <aux4>'],
  '<aux4>': ['[<expresion><aux5>]', 'EPSILON'],
  '<aux5>': [',<expresion><aux5>', 'EPSILON'],
  '<repeatloop>': ['repeat <statutes> until <expresion>'],
  '<forloop>': ['for <counter> do {<statutes>}'],
  '<counter>': ['id=<expresion> for <expresion>'],
  '<whileloop>': ['while <expresion> do { <statutes> }'],
  '<input>': ['read( <var> <aux6> )'],
  '<aux6>': [', <var> <aux6>', 'EPSILON'],
  '<output>': ['write( <var> <aux7> )'],
  '<aux7>': [', <var> <aux7>', 'EPSILON'],
  '<conditional>': ['if <expresion> then { <statutes> } <aux8>'],
  '<aux8>': ['else { <statutes> } ', 'EPSILON'],
  '<expresion>': ['<exp> <aux9>'],
  '<aux9>': ['<relational> <exp>', 'EPSILON'],
  '<exp>': ['<term> <aux10>'],
  '<aux10>': ['+ <exp>', '- <exp>', '|| <exp>', 'EPSILON'],
  '<relational>': ['==', '<', '>', '<=', '>=', '!='],
  '<term>': ['<factor> <aux11>'],
  '<aux11>': [
    '*<factor>',
    '/<factor>',
    '%<factor>',
    '&&<factor>',
    'EPSILON'
  ],
  '<factor>': [
    '(<expresion>)',
    '<var>',
    'true',
    'false',
    'cte.int',
    'cte.float',
    'cte.string',
    '! <expresion>'
  ]
};

export function u3Grammars (sentence, grammar) {
  const original = sentence;
  let res = false;
  function S (str, rule) {
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
            console.log(original + ' = ' + gen);
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

const currSintax = '';
const posibleProductions = [];
export const sintaxAnalyzer = (token) => {
  if (!posibleProductions) {

  }
};
