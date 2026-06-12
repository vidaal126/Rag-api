import { ApiProperty } from "@nestjs/swagger";

export class DocumentResponseDto {
  @ApiProperty()
  documentId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  chunkCount!: number;
}
