
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SisPermissoesService } from './sis-permissoes.service';
import { SisPermissoesDto } from './sis-permissoes.dto';
import { ApiTags, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Permissões')
@Controller('permissoes')
export class SisPermissoesController {
  constructor(private readonly service: SisPermissoesService) {}

  @Get(':usuario_id')
  @ApiParam({ name: 'usuario_id', type: String, description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permissões do usuário',
    isArray: true,
    type: SisPermissoesDto,
  })
  async getPermissoes(@Param('usuario_id') usuario_id: string) {
    return this.service.getPermissoesByUsuarioId(usuario_id);
  }

  @Post(':usuario_id')
  @ApiParam({ name: 'usuario_id', type: String, description: 'ID do usuário' })
  @ApiQuery({ name: 'modulo', type: String, required: true, description: 'Nome do módulo', example: 'financeiro' })
  @ApiQuery({ name: 'tela', type: String, required: true, description: 'Nome da tela', example: 'contas_pagar' })
  @ApiBody({
    description: 'Permissão a ser criada',
    type: SisPermissoesDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de envio',
        value: {
          visualizar: true,
          editar: false,
          criar: false,
          deletar: false
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Permissão criada',
    schema: {
      example: {
        id: 'uuid',
        usuario_id: 'usuario_id',
        modulo: 'financeiro',
        tela: 'contas_pagar',
        visualizar: true,
        editar: false,
        criar: false,
        deletar: false
      }
    }
  })
  async createPermissao(
    @Param('usuario_id') usuario_id: string,
    @Query('modulo') modulo: string,
    @Query('tela') tela: string,
    @Body() dto: Partial<SisPermissoesDto>,
  ) {
    return this.service.createPermissao({
      ...dto,
      usuario_id,
      modulo,
      tela,
    });
  }

  @Put(':usuario_id')
  @ApiParam({ name: 'usuario_id', type: String, description: 'ID do usuário' })
  @ApiQuery({ name: 'modulo', type: String, required: true, description: 'Nome do módulo', example: 'financeiro' })
  @ApiQuery({ name: 'tela', type: String, required: true, description: 'Nome da tela', example: 'contas_pagar' })
  @ApiBody({
    description: 'Permissão a ser atualizada',
    type: SisPermissoesDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de envio',
        value: {
          visualizar: true,
          editar: true,
          criar: false,
          deletar: false
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Permissão atualizada',
    schema: {
      example: {
        id: 'uuid',
        usuario_id: 'usuario_id',
        modulo: 'financeiro',
        tela: 'contas_pagar',
        visualizar: true,
        editar: true,
        criar: false,
        deletar: false
      }
    }
  })
  async updatePermissao(
    @Param('usuario_id') usuario_id: string,
    @Query('modulo') modulo: string,
    @Query('tela') tela: string,
    @Body() dto: Partial<SisPermissoesDto>,
  ) {
    return this.service.updatePermissao({
      ...dto,
      usuario_id,
      modulo,
      tela,
    });
  }
}
