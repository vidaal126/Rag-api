import { ApiProperty } from "@nestjs/swagger";

export class RagSourceDto {
  @ApiProperty()
  chunkId!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  similarity!: number;
}

export class RagResponseDto {
  @ApiProperty()
  queryId!: string;

  @ApiProperty()
  answer!: string;

  @ApiProperty({ type: [RagSourceDto] })
  sources!: RagSourceDto[];
}
