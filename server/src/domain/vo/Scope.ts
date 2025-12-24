import { DomainError } from "../DomainError.js";

export enum Scope {
  MCP_DEFAULT = "MCP_DEFAULT"
}

const scopeValues = new Set(Object.values(Scope));

export namespace Scope {
  export function fromString(scopeStr: string): Scope {
    if (scopeValues.has(scopeStr as Scope)) {
      return scopeStr as Scope;
    }
    throw new DomainError("Invalid value for Scope.");
  }
}