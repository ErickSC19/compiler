export default SymbolsTable = {
  symbols: {
    principal: {
      $dfs: { type: "boolea", value: "true" },
    },
  },
  get: (name, scope) => {
    if (this.symbols[scope][name]) {
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
  add: (name, type, scope, value) => {
    if (this.get(name, scope)) {
      throw new Error("identifier already exists, can not add");
    } else {
      this.symbols[scope][name] = { type: type, value: value };
    }
  },
  update: (name, scope, newValue, valueType) => {
    const prev = this.get(name, scope);
    if (prev) {
      if (prev.type === valueType) {
        this.symbols[scope][name].value = newValue;
      }
    } else {
      throw new Error("identifier does not exists, can not update");
    }
  },
  delete: (name, scope) => {
    if (this.get(name, scope)) {
      const newScope = this.symbols[scope].filter((v) => v !== name);
      this.symbols[scope] = newScope;
    } else {
      throw new Error("identifier does not exists, can not delete");
    }
  },
};
