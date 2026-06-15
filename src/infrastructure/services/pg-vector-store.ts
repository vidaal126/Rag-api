import { Department, DocumentId } from '@domain/entities/document/document.value-objects';
import { IVectorStore, SimilarChunk, VectorStoreChunk } from '@domain/services/vector-store';
import { Prisma } from '@infrastructure/database/prisma/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PgVectorStore extends IVectorStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findSimilar(
    embedding: number[],
    topK: number,
    department: Department,
  ): Promise<SimilarChunk[]> {
    const vectorLiteral = Prisma.raw(`'[${embedding.join(',')}]'::vector`);

    const rows = await this.prisma.$queryRaw<
      Array<{
        id: string;
        document_id: string;
        content: string;
        similarity: number;
      }>
    >`
      SELECT
        id,
        document_id,
        content,
        1 - (embedding <=> ${vectorLiteral}) AS similarity
      FROM document_chunks
      WHERE department = ${department}
      ORDER BY embedding <=> ${vectorLiteral}
      LIMIT ${topK}
    `;

    return rows.map((row) => ({
      chunkId: row.id,
      documentId: new DocumentId(row.document_id),
      content: row.content,
      similarity: Number(row.similarity),
    }));
  }

  async upsertChunks(chunks: VectorStoreChunk[]): Promise<void> {
    for (const chunk of chunks) {
      const vectorLiteral = Prisma.raw(`'[${chunk.embedding.join(',')}]'::vector`);

      await this.prisma.$executeRaw`
        INSERT INTO document_chunks (id, document_id, department, content, chunk_index, embedding)
        VALUES (
          ${chunk.chunkId},
          ${chunk.documentId.value},
          ${chunk.department},
          ${chunk.content},
          0,
          ${vectorLiteral}
        )
        ON CONFLICT (id) DO UPDATE SET
          embedding  = EXCLUDED.embedding,
          content    = EXCLUDED.content,
          department = EXCLUDED.department
      `;
    }
  }

  async deleteByDocumentId(documentId: DocumentId): Promise<void> {
    await this.prisma.$executeRaw`
      DELETE FROM document_chunks WHERE document_id = ${documentId.value}
    `;
  }
}
