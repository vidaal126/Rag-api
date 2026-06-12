import {
  Document,
  DocumentChunk,
} from "@domain/entities/document/document.entity";
import {
  Department,
  DocumentId,
  DocumentStatus,
} from "@domain/entities/document/document.value-objects";
import type {
  Document as PrismaDocument,
  DocumentChunk as PrismaDocumentChunk,
} from "@infrastructure/database/prisma/generated/prisma/client";

export class DocumentMapper {
  static toDomain(
    raw: PrismaDocument & { chunks: PrismaDocumentChunk[] },
  ): Document {
    const chunks = raw.chunks.map((chunk) =>
      DocumentChunk.create(
        new DocumentId(chunk.documentId),
        chunk.content,
        chunk.chunkIndex,
        [],
      ),
    );

    return Document.reconstitute({
      id: new DocumentId(raw.id),
      name: raw.name,
      uploadedBy: raw.uploadedBy,
      department: raw.department as Department,
      status: raw.status as DocumentStatus,
      chunks,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(
    document: Document,
  ): Omit<PrismaDocument, "createdAt" | "updatedAt"> {
    return {
      id: document.id.value,
      name: document.name,
      uploadedBy: document.uploadedBy,
      department: document.department,
      status: document.status,
    };
  }
}
