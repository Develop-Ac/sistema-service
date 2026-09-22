import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrcamentoBloqueadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async desbloquearByVendasRepCodigo(vendas_rep_codigo: number) {
    // Libera o orçamento (true -> false) para o representante informado
    return this.prisma.sis_usuarios.updateMany({
      where: { vendas_rep_codigo },
      data: { orcamentoBloqueado: false },
    });
  }

  /**
   * Marca `liberadogerencia = true` nos orçamentos do rep que estão travando
   * (importados no Celta e ainda não comparados). O vendas-service e a intranet
   * leem essa coluna: orçamento divergente mas liberado pela gerência não trava
   * a criação de orçamento novo, mesmo que o comparativo continue divergindo.
   */
  async liberarOrcamentosDoRep(rep_codigo: number) {
    return this.prisma.ven_orcamento.updateMany({
      where: { rep_codigo, comparado: false, orcamentoCelta: { not: null }, NOT: { liberadogerencia: true } },
      data: { liberadogerencia: true },
    });
  }
}
