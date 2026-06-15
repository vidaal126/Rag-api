import { ContentSanitizerService } from '@application/services/content-sanitizer.service';
import { PiiSanitizerService } from '@application/services/pii-sanitizer.service';
import { Document } from '@domain/entities/document/document.entity';
import { DocumentId } from '@domain/entities/document/document.value-objects';
import { DocumentChunk } from '@domain/entities/document/document-chunk.entity';
import { IDocumentRepository } from '@domain/repositories/document/document.repository';
import { IEmbeddingProvider } from '@domain/services/embedding.provider';
import { IVectorStore, type VectorStoreChunk } from '@domain/services/vector-store';
import { Injectable, Logger } from '@nestjs/common';
import type { IngestDocumentInput, IngestDocumentOutput } from './ingest-document.dto';

@Injectable()
export class IngestDocumentUseCase {
  private readonly logger = new Logger(IngestDocumentUseCase.name);

  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly embeddingProvider: IEmbeddingProvider,
    private readonly vectorStore: IVectorStore,
    private readonly contentSanitizer: ContentSanitizerService,
    private readonly piiSanitizer: PiiSanitizerService,
  ) {}

  async execute(input: IngestDocumentInput): Promise<IngestDocumentOutput> {
    const contentWithoutInjection = this.contentSanitizer.sanitize(input.content);
    const sanitizedContent = this.piiSanitizer.sanitize(contentWithoutInjection);

    if (this.contentSanitizer.hasInjectionAttempt(input.content)) {
      this.logger.warn(
        `Prompt injection attempt detected in document "${input.name}" uploaded by "${input.uploadedBy}"`,
      );
    }

    if (this.piiSanitizer.hasPii(input.content)) {
      this.logger.warn(
        `PII detected in document "${input.name}" uploaded by "${input.uploadedBy}"`,
      );
    }

    const document = Document.create(input.name, input.uploadedBy, input.department);
    await this.documentRepository.save(document);

    try {
      document.startProcessing();
      await this.documentRepository.save(document);

      const chunks = await this.buildChunks(document.id, sanitizedContent);

      document.markReady(chunks);
      await this.documentRepository.save(document);

      await this.vectorStore.upsertChunks(
        chunks.map(
          (chunk): VectorStoreChunk => ({
            chunkId: chunk.id,
            documentId: chunk.documentId,
            department: input.department,
            content: chunk.content,
            embedding: chunk.embedding,
          }),
        ),
      );

      this.logger.log(`Document ${document.id.value} ingested with ${chunks.length} chunks`);

      return {
        documentId: document.id.value,
        name: document.name,
        chunkCount: document.chunkCount,
      };
    } catch (error) {
      document.markFailed();
      await this.documentRepository.save(document);
      this.logger.error(`Failed to ingest document ${document.id.value}`, error);
      throw error;
    }
  }

  private async buildChunks(documentId: DocumentId, content: string): Promise<DocumentChunk[]> {
    const segments = this.splitIntoSegments(content);
    const chunks: DocumentChunk[] = [];

    for (let i = 0; i < segments.length; i++) {
      const embedding = await this.embeddingProvider.embed(segments[i]);
      chunks.push(DocumentChunk.create(documentId, segments[i], i, embedding));
    }

    return chunks;
  }

  private splitIntoSegments(content: string, chunkSize = 500): string[] {
    const segments: string[] = [];
    const paragraphs = content.split(/\n\n+/);
    let current = '';

    for (const paragraph of paragraphs) {
      if ((current + paragraph).length > chunkSize && current.length > 0) {
        segments.push(current.trim());
        current = paragraph;
      } else {
        current = current ? `${current}\n\n${paragraph}` : paragraph;
      }
    }

    if (current.trim().length > 0) {
      segments.push(current.trim());
    }

    return segments;
  }
}
