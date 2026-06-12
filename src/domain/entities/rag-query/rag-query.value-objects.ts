import { randomUUID } from "node:crypto";
import {
  InvalidQueryTextException,
  InvalidRagQueryIdException,
} from "./rag-query.exceptions";

export class RagQueryId {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === "") {
      throw new InvalidRagQueryIdException();
    }
    this.value = value;
  }

  static generate(): RagQueryId {
    return new RagQueryId(randomUUID());
  }

  equals(other: RagQueryId): boolean {
    return this.value === other.value;
  }
}

export class QueryText {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === "") {
      throw new InvalidQueryTextException("empty");
    }
    if (value.length > 1000) {
      throw new InvalidQueryTextException("too_long");
    }
    this.value = value;
  }
}

export enum RagQueryStatus {
  PENDING = "PENDING",
  ANSWERED = "ANSWERED",
  FAILED = "FAILED",
}
