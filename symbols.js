const SymbolsTable = {
  symbols: {
    principal: {
      $dfs: { type: "boolean", value: "true" },
    },
  },
  get: function (name, scope) {
    if (this.symbols[scope] && this.symbols[scope][name]) {
      return {
        name: name,
        type: this.symbols[scope][name].type,
        scope: scope,
        value: this.symbols[scope][name].value,
      };
    } else {
      return false;
    }
  },
  add: function (name, type, scope, value) {
    if (this.get(name, scope)) {
      throw new Error("identifier already exists, can not add");
    } else {
      if (this.symbols[scope]) {
        this.symbols[scope][name] = { type: type, value: value };
      } else {
        const newScope = {};
        newScope[scope] = { type: type, value: value };
        const returnedScope = Object.assign(this.symbols, newScope);
        this.symbols = returnedScope;
      }
    }
  },
  update: function (name, scope, newValue, valueType) {
    const prev = this.get(name, scope);
    if (prev) {
      if (prev.type === valueType) {
        this.symbols[scope][name].value = newValue;
      }
    } else {
      throw new Error("identifier does not exists, can not update");
    }
  },
  delete: function (name, scope) {
    if (this.get(name, scope)) {
      const { [name]: v, ...rest } = this.symbols[scope];
      this.symbols[scope] = rest;
    } else {
      throw new Error("identifier does not exists, can not delete");
    }
  },
};
export default SymbolsTable;

export const SymbolsTableGlobal = {
  symbols: {},
  get: function (name) {
    if (this.symbols[name]) {
      return {
        name: name,
        type: this.symbols[name].type,
        value: this.symbols[name].value,
      };
    } else {
      return false;
    }
  },
  add: function (name, type, value) {
    if (this.get(name)) {
      throw new Error("identifier already exists, can not add");
    } else {
      this.symbols[name] = { type: type, value: value };
    }
  },
  update: function (name, newValue, valueType) {
    // console.log('--> updating: ', name, newValue, valueType);
    const prev = this.get(name);
    if (prev) {
      if (prev.type === valueType) {
        this.symbols[name].value = newValue;
      } else {
        throw new Error("Value to assign does not match type with identifier");
      }
    } else {
      throw new Error("identifier does not exists, can not update");
    }
  },
  delete: function (name) {
    if (this.get(name)) {
      const { [name]: a, ...rest } = this.symbols;
      this.symbols = rest;
    } else {
      throw new Error("identifier does not exists, can not delete");
    }
  },
};

/**
 * @param {string[]} params - A string containing the tokens at the right side of the expression, including closing semicolon.
 * @param {string} rtype - The type of the identifier to be asigned
 * @returns {string} Final value.
 */
export function optimize(params, rtype) {
  const len = params.length;
  if (len > 2) {
    const scopes = [[]]
    let scope = 0;
    for (let index = 0; index < params.length; index++) {
      const token = params[index];
      let newVal;
      let atype;

      if (token.type === "IDENTIFIER") {
        const id = SymbolsTableGlobal.get(token.value);
        newVal = id.value;
        atype = id.type;
      } else if(token.value === '(' || token.value === ')') {

      } else {
        newVal = token.value;
        atype = token.type.toLocaleLowerCase();
        if (newVal === "true" || newVal === "false") {
          atype = "boolean";
        }
      }
      if (atype !== rtype) {
        throw new Error('types does not match');
      }
      scopes[scope].push(newVal)
    }
  } else {
    let newVal;
    let atype;

    if (params[0].type === "IDENTIFIER") {
      const id = SymbolsTableGlobal.get(params[0].value);
      newVal = id.value;
      atype = id.type;
    } else {
      newVal = params[0].value;
      atype = params[0].type.toLocaleLowerCase();
      if (newVal === "true" || newVal === "false") {
        atype = "boolean";
      }
    }
    if (atype !== rtype) {
      throw new Error('types does not match');
    }
    return newVal;
  }

  return len;
}
