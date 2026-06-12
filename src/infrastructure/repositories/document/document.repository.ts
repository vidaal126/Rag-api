import { IDocumentRepository } from "@domain/repositories/document/document.repository";
import { Document } from "@domain/entities/document/document.entity";
import { DocumentMapper } from "@infrastructure/mappers/document.mapper";
import { PrismaService } from "@infrastructure/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaDocumentRepository extends IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(document: Document): Promise<void> {
    const data = DocumentMapper.toPrisma(document);

    await this.prisma.document.upsert({
      where: { id: data.id },
      create: data,
      update: {
        status: data.status,
        name: data.name,
        uploadedBy: data.uploadedBy,
      },
    });
  }

  async findById(id: string): Promise<Document | null> {
    const raw = await this.prisma.document.findUnique({
      where: { id },
      include: { chunks: true },
    });

    if (!raw) return null;

    return DocumentMapper.toDomain(raw);
  }

  async findAll(): Promise<Document[]> {
    const raws = await this.prisma.document.findMany({
      include: { chunks: true },
    });

    return raws.map(DocumentMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({ where: { id } });
  }
}
