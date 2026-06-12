import { DomainException } from "@domain/entities/document/document.exceptions";
import { RagQueryStatus } from "./rag-query.value-objects";

export class InvalidRagQueryIdException extends DomainException {
  constructor() {
    super("RagQuery ID cannot be empty", "INVALID_RAG_QUERY_ID");
  }
}

export class InvalidQueryTextException extends DomainException {
  constructor(reason: "empty" | "too_long") {
    super(
      reason === "empty"
        ? "Query text cannot be empty"
        : "Query text cannot exceed 1000 characters",
      "INVALID_QUERY_TEXT",
    );
  }
}

export class InvalidRagQueryTransitionException extends DomainException {
  constructor(from: RagQueryStatus, to: RagQueryStatus) {
    super(
      `Cannot transition from ${from} to ${to}`,
      "INVALID_RAG_QUERY_TRANSITION",
    );
  }
}
