import { ContentSanitizerService } from "@application/services/content-sanitizer.service";
import { PiiSanitizerService } from "@application/services/pii-sanitizer.service";
import { IngestDocumentUseCase } from "@application/usecases/ingest-document/ingest-document.usecase";
import { IDocumentRepository } from "@domain/repositories/document/document.repository";
import { IEmbeddingProvider } from "@domain/services/embedding.provider";
import { IVectorStore } from "@domain/services/vector-store";
import { OllamaEmbeddingAdapter } from "@infrastructure/external/ollama/ollama-embedding.adapter";
import { PdfExtractor } from "@infrastructure/external/pdf/pdf-extractor";
import { PrismaDocumentRepository } from "@infrastructure/repositories/document/document.repository";
import { PgVectorStore } from "@infrastructure/services/pg-vector-store";
import { Module } from "@nestjs/common";
import { DocumentController } from "@presentation/controllers/v1/document.controller";

@Module({
  controllers: [DocumentController],
  providers: [
    IngestDocumentUseCase,
    PdfExtractor,
    ContentSanitizerService,
    PiiSanitizerService,
    { provide: IDocumentRepository, useClass: PrismaDocumentRepository },
    { provide: IEmbeddingProvider, useClass: OllamaEmbeddingAdapter },
    { provide: IVectorStore, useClass: PgVectorStore },
  ],
})
export class DocumentModule {}
