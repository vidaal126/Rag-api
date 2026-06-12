import { randomUUID } from "node:crypto";
import {
  EmptyChunksException,
  InvalidDocumentIdException,
  InvalidDocumentTransitionException,
} from "./document.exceptions";
import {
  Department,
  DocumentId,
  DocumentStatus,
} from "./document.value-objects";
import { DocumentChunk } from "./document-chunk.entity";

// ── Document (Aggregate Root) ─────────────────────────────────────────────────

interface DocumentProps {
  id: DocumentId;
  name: string;
  uploadedBy: string;
  status: DocumentStatus;
  chunks: DocumentChunk[];
  createdAt: Date;
  updatedAt: Date;
}

interface DocumentProps {
  id: DocumentId;
  name: string;
  uploadedBy: string;
  department: Department;
  status: DocumentStatus;
  chunks: DocumentChunk[];
  createdAt: Date;
  updatedAt: Date;
}

export class Document {
  private readonly props: DocumentProps;

  private constructor(props: DocumentProps) {
    this.props = props;
  }

  static create(
    name: string,
    uploadedBy: string,
    department: Department,
  ): Document {
    return new Document({
      id: DocumentId.generate(),
      name,
      uploadedBy,
      department,
      status: DocumentStatus.PENDING,
      chunks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: DocumentProps): Document {
    return new Document(props);
  }

  get department(): Department {
    return this.props.department;
  }

  get id(): DocumentId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get uploadedBy(): string {
    return this.props.uploadedBy;
  }

  get status(): DocumentStatus {
    return this.props.status;
  }

  get chunks(): DocumentChunk[] {
    return this.props.chunks;
  }

  get chunkCount(): number {
    return this.props.chunks.length;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  startProcessing(): void {
    if (this.props.status !== DocumentStatus.PENDING) {
      throw new InvalidDocumentTransitionException(
        this.props.status,
        DocumentStatus.PROCESSING,
      );
    }
    this.props.status = DocumentStatus.PROCESSING;
    this.props.updatedAt = new Date();
  }

  markReady(chunks: DocumentChunk[]): void {
    if (this.props.status !== DocumentStatus.PROCESSING) {
      throw new InvalidDocumentTransitionException(
        this.props.status,
        DocumentStatus.READY,
      );
    }
    if (chunks.length === 0) {
      throw new EmptyChunksException();
    }
    this.props.chunks = chunks;
    this.props.status = DocumentStatus.READY;
    this.props.updatedAt = new Date();
  }

  markFailed(): void {
    this.props.status = DocumentStatus.FAILED;
    this.props.updatedAt = new Date();
  }
}
export { DocumentChunk };
