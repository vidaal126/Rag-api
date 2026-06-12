import { Document } from "@domain/entities/document/document.entity";
import { Department } from "@domain/entities/document/document.value-objects";

export abstract class IDocumentRepository {
  abstract save(document: Document): Promise<void>;
  abstract findById(id: string): Promise<Document | null>;
  abstract findAll(department: Department): Promise<Document[]>;
  abstract delete(id: string): Promise<void>;
}
