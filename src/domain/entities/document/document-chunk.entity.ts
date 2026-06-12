import { randomUUID } from "crypto";
import { DocumentId } from "./document.value-objects";

interface DocumentChunkProps {
  id: string;
  documentId: DocumentId;
  content: string;
  chunkIndex: number;
  embedding: number[];
}

export class DocumentChunk {
  private readonly props: DocumentChunkProps;

  private constructor(props: DocumentChunkProps) {
    this.props = props;
  }

  static create(
    documentId: DocumentId,
    content: string,
    chunkIndex: number,
    embedding: number[],
  ): DocumentChunk {
    return new DocumentChunk({
      id: randomUUID(),
      documentId,
      content,
      chunkIndex,
      embedding,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get documentId(): DocumentId {
    return this.props.documentId;
  }

  get content(): string {
    return this.props.content;
  }

  get chunkIndex(): number {
    return this.props.chunkIndex;
  }

  get embedding(): number[] {
    return this.props.embedding;
  }
}
