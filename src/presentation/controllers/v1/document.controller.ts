import { IngestDocumentUseCase } from "@application/usecases/ingest-document/ingest-document.usecase";
import { Department } from "@domain/entities/document/document.value-objects";
import { PdfExtractor } from "@infrastructure/external/pdf/pdf-extractor";
import { UploadThrottle } from "@infrastructure/http/decorators/throttle.decorator";
import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import { DocumentResponseDto } from "@presentation/dtos/document/document-response.dto";
import type { FastifyRequest } from "fastify";

@ApiTags("documents")
@ApiBadRequestResponse({ description: "Invalid request payload" })
@ApiTooManyRequestsResponse({ description: "Rate limit exceeded" })
@ApiInternalServerErrorResponse({ description: "Unexpected server error" })
@Controller("documents")
export class DocumentController {
  constructor(
    private readonly ingestDocumentUseCase: IngestDocumentUseCase,
    private readonly pdfExtractor: PdfExtractor,
  ) {}

  @Post()
  @UploadThrottle()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiQuery({ name: "uploadedBy", type: String, required: true })
  @ApiQuery({ name: "department", enum: Department, required: true })
  async ingest(
    @Req() req: FastifyRequest,
    @Query("uploadedBy") uploadedBy: string,
    @Query("department") department: Department,
  ): Promise<DocumentResponseDto> {
    if (!uploadedBy) {
      throw new BadRequestException("uploadedBy query param is required");
    }

    if (!department || !Object.values(Department).includes(department)) {
      throw new BadRequestException(
        `department must be one of: ${Object.values(Department).join(", ")}`,
      );
    }

    const data = await req.file();

    if (!data) {
      throw new BadRequestException("PDF file is required");
    }

    if (data.mimetype !== "application/pdf") {
      throw new BadRequestException("Only PDF files are accepted");
    }

    const buffer = await data.toBuffer();
    const content = await this.pdfExtractor.extract(buffer);

    if (!content || content.trim().length === 0) {
      throw new BadRequestException("Could not extract text from PDF");
    }

    return await this.ingestDocumentUseCase.execute({
      name: data.filename,
      uploadedBy,
      department,
      content,
    });
  }
}
