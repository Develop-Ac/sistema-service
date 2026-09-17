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
}
