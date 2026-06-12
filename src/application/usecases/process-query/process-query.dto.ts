import { Department } from "@domain/entities/document/document.value-objects";

export interface ProcessQueryInput {
  queryText: string;
  askedBy: string;
  department: Department;
}

export interface ProcessQueryOutput {
  queryId: string;
  answer: string;
  sources: Array<{
    chunkId: string;
    content: string;
    similarity: number;
  }>;
}
