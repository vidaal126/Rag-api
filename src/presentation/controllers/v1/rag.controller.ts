import { ProcessQueryUseCase } from "@application/usecases/process-query/process-query.usecase";
import { QueryThrottle } from "@infrastructure/http/decorators/throttle.decorator";
import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { ProcessQueryRequestDto } from "@presentation/dtos/rag/process-query-request.dto";
import { RagResponseDto } from "@presentation/dtos/rag/rag-response.dto";

@ApiTags("rag")
@ApiBadRequestResponse({ description: "Invalid request payload" })
@ApiTooManyRequestsResponse({ description: "Rate limit exceeded" })
@ApiInternalServerErrorResponse({ description: "Unexpected server error" })
@Controller("rag")
export class RagController {
  constructor(private readonly processQueryUseCase: ProcessQueryUseCase) {}

  @Post("query")
  @QueryThrottle()
  @ApiCreatedResponse({ type: RagResponseDto })
  async query(@Body() dto: ProcessQueryRequestDto): Promise<RagResponseDto> {
    return await this.processQueryUseCase.execute({
      queryText: dto.queryText,
      askedBy: dto.askedBy,
      department: dto.department,
    });
  }
}
