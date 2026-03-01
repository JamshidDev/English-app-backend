import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { ClientApiResponseDto, ClientPaginatedApiResponseDto } from './dto/client-response.dto';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/auth/guards/roles.guard';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiCreatedResponse({ type: ClientApiResponseDto })
  async create(@Body() dto: CreateClientDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiOkResponse({ type: ClientPaginatedApiResponseDto })
  async findAll(@Query() query: QueryClientDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ClientApiResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ClientApiResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a client' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ClientApiResponseDto })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.softDelete(id);
  }

  @Patch(':id/toggle-block')
  @ApiOperation({ summary: 'Toggle client block status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ClientApiResponseDto })
  async toggleBlock(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.toggleBlock(id);
  }
}
