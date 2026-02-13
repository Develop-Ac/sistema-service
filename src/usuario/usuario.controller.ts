// src/usuario/usuario.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsuarioService, CreateUsuarioInput } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioView } from './usuario.dto';

@ApiTags('Usuários')
@ApiExtraModels(CreateUsuarioDto, UpdateUsuarioDto, UsuarioView)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get()
  @ApiOperation({ summary: 'Lista usuários' })
  @ApiOkResponse({
    description: 'Lista de usuários',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(UsuarioView) },
      example: [
        { id: 'cuid1', nome: 'Giovana Custodio', codigo: '12345', setor: 'TI' },
        { id: 'cuid2', nome: 'Carlos Siqueira', codigo: '67890', setor: 'RH' },
      ],
    },
  })
  async index() {
    return this.usuarioService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Cria usuário' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  // ... (Swagger docs omitidos para brevidade se não for alterar)
  async store(@Body() dto: CreateUsuarioDto) {
    const payload: CreateUsuarioInput = {
      nome: dto.nome,
      codigo: dto.codigo,
      setor: dto.setor,
      perfil_acesso: dto.perfil_acesso,
      senha: dto.senha
    };
    return this.usuarioService.create(payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza usuário' })
  @ApiParam({ name: 'id', example: '123' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove usuário por ID' })
  @ApiParam({ name: 'id', example: '123', description: 'PK usuario_id' })
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Removido com sucesso (no content)' })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: { example: { statusCode: 404, message: 'Usuário não encontrado' } },
  })
  async destroy(@Param('id') id: string) {
    await this.usuarioService.remove(id);
  }
}
