import { Injectable, NotFoundException } from '@nestjs/common';
import { OrcamentoBloqueadoRepository } from './orcamento-bloqueado.repository';
import { OrcamentoBloqueadoResponseDto } from './orcamento-bloqueado.dto';

@Injectable()
export class OrcamentoBloqueadoService {
  constructor(private readonly repository: OrcamentoBloqueadoRepository) {}

  async desbloquear(vendas_rep_codigo: number): Promise<OrcamentoBloqueadoResponseDto> {
    const { count } = await this.repository.desbloquearByVendasRepCodigo(vendas_rep_codigo);

    if (count === 0) {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o vendas_rep_codigo ${vendas_rep_codigo}`,
      );
    }

    // Os orçamentos divergentes desse rep ficam liberados pela gerência: o cron do
    // comparativo não volta a bloquear por eles, e a tela de orçamento novo não trava.
    const { count: orcamentos_liberados } = await this.repository.liberarOrcamentosDoRep(vendas_rep_codigo);

    return {
      vendas_rep_codigo,
      orcamentoBloqueado: false,
      atualizados: count,
      orcamentos_liberados,
    };
  }
}
