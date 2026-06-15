import { Department, DocumentId } from '@domain/entities/document/document.value-objects';

export interface SimilarChunk {
  chunkId: string;
  documentId: DocumentId;
  content: string;
  similarity: number;
}

export interface VectorStoreChunk {
  chunkId: string;
  documentId: DocumentId;
  department: Department;
  content: string;
  embedding: number[];
}

export abstract class IVectorStore {
  abstract upsertChunks(chunks: VectorStoreChunk[]): Promise<void>;

  abstract findSimilar(
    embedding: number[],
    topK: number,
    department: Department,
  ): Promise<SimilarChunk[]>;

  abstract deleteByDocumentId(documentId: DocumentId): Promise<void>;
}
