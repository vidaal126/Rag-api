import { CreateUserUseCase } from '@application/usecases/user/create-user.usecase';
import { GetUserUseCase } from '@application/usecases/user/get-user.usecase';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateUserRequestDto } from '@presentation/dtos/user/create-user-request.dto';
import { UserResponseDto } from '@presentation/dtos/user/user-response.dto';
import { UserHttpMapper } from '@presentation/mappers/user.mapper';

@ApiTags('users')
@ApiBadRequestResponse({ description: 'Invalid request payload' })
@ApiTooManyRequestsResponse({ description: 'Rate limit exceeded' })
@ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiUnprocessableEntityResponse({ description: 'User with this email already exists' })
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return await this.createUserUseCase.execute(UserHttpMapper.toCreateInput(dto));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return await this.getUserUseCase.execute({ id });
  }
}
