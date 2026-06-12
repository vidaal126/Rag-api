import { Department } from "@domain/entities/document/document.value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ProcessQueryRequestDto {
  @ApiProperty({ example: "Como solicitar férias?" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  queryText!: string;

  @ApiProperty({ example: "joao.silva" })
  @IsString()
  @IsNotEmpty()
  askedBy!: string;

  @ApiProperty({
    enum: Department,
    example: Department.HR,
    description: "HR = Recursos Humanos, FINANCE = Financeiro",
  })
  @IsEnum(Department)
  department!: Department;
}
