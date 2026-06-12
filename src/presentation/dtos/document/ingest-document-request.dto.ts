import { Department } from "@domain/entities/document/document.value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class IngestDocumentRequestDto {
  @ApiProperty({
    enum: Department,
    example: Department.HR,
    description: "HR = Recursos Humanos, FINANCE = Financeiro",
  })
  @IsEnum(Department)
  department!: Department;

  @ApiProperty({ example: "joao.silva" })
  @IsString()
  @IsNotEmpty()
  uploadedBy!: string;
}
