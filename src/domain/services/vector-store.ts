import { DocumentId } from "@domain/entities/document/document.value-objects";
import { Department } from "@domain/entities/document/document.value-objects";

export interface SimilarChunk {
  chunkId: string;
  documentId: DocumentId;
  content: string;
  similarity: number;
}

export abstract class IVectorStore {
  abstract upsertChunks(
    chunks: Array<{
      chunkId: string;
      documentId: DocumentId;
      department: Department;
      content: string;
      embedding: number[];
    }>,
  ): Promise<void>;

  abstract findSimilar(
    embedding: number[],
    topK: number,
    department: Department,
  ): Promise<SimilarChunk[]>;

  abstract deleteByDocumentId(documentId: DocumentId): Promise<void>;
}
