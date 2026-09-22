import { Controller, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrcamentoBloqueadoService } from './orcamento-bloqueado.service';
import { OrcamentoBloqueadoResponseDto } from './orcamento-bloqueado.dto';

@ApiTags('Orçamento Bloqueado')
@Controller(' ')
export class OrcamentoBloqueadoController {
  constructor(private readonly service: OrcamentoBloqueadoService) {}

  @Post(':vendas_rep_codigo')
  @HttpCode(200)
  @ApiParam({
    name: 'vendas_rep_codigo',
    type: Number,
    description: 'Código do representante de vendas',
    example: 12,
  })
  @ApiResponse({
    status: 200,
    description:
      'Vendedor liberado (orcamentoBloqueado = false) e orçamentos divergentes do rep marcados com liberadogerencia = true',
    type: OrcamentoBloqueadoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum usuário encontrado para o vendas_rep_codigo informado',
  })
  async desbloquear(
    @Param('vendas_rep_codigo', ParseIntPipe) vendas_rep_codigo: number,
  ) {
    return this.service.desbloquear(vendas_rep_codigo);
  }
}
