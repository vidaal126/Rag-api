import { randomUUID } from "crypto";
import { InvalidDocumentIdException } from "./document.exceptions";

export enum DocumentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  READY = "READY",
  FAILED = "FAILED",
}

export enum Department {
  HR = "HR",
  FINANCE = "FINANCE",
}

export class DocumentId {
  readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === "") {
      throw new InvalidDocumentIdException();
    }
    this.value = value;
  }

  static generate(): DocumentId {
    return new DocumentId(randomUUID());
  }

  equals(other: DocumentId): boolean {
    return this.value === other.value;
  }
}
