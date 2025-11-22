import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SisPermissoesDto } from './sis-permissoes.dto';

@Injectable()
export class SisPermissoesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsuarioId(usuario_id: string) {
    return this.prisma.sis_permissoes.findMany({
      where: { usuario_id },
    });
  }

  async createOne(dto: SisPermissoesDto) {
    if (!dto.modulo || !dto.tela) {
      throw new Error('Os campos modulo e tela são obrigatórios');
    }
    return this.prisma.sis_permissoes.create({ data: dto });
  }

  async updateOne(dto: SisPermissoesDto) {
    // Atualiza a permissão do usuário para o módulo/tela informados
    return this.prisma.sis_permissoes.updateMany({
      where: {
        usuario_id: dto.usuario_id,
        modulo: dto.modulo,
        tela: dto.tela,
      },
      data: {
        visualizar: dto.visualizar,
        editar: dto.editar,
        criar: dto.criar,
        deletar: dto.deletar,
      },
    });
  }
}
