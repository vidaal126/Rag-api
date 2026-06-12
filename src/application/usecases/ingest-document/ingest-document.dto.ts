import { Department } from "@domain/entities/document/document.value-objects";

export interface IngestDocumentInput {
  name: string;
  uploadedBy: string;
  department: Department;
  content: string;
}

export interface IngestDocumentOutput {
  documentId: string;
  name: string;
  chunkCount: number;
}
