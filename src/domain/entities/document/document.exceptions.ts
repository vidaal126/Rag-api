import { DocumentStatus } from "./document.value-objects";

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidDocumentIdException extends DomainException {
  constructor() {
    super("Document ID cannot be empty", "INVALID_DOCUMENT_ID");
  }
}

export class InvalidDocumentTransitionException extends DomainException {
  constructor(from: DocumentStatus, to: DocumentStatus) {
    super(
      `Cannot transition from ${from} to ${to}`,
      "INVALID_DOCUMENT_TRANSITION",
    );
  }
}

export class EmptyChunksException extends DomainException {
  constructor() {
    super("Cannot mark document as ready with no chunks", "EMPTY_CHUNKS");
  }
}
