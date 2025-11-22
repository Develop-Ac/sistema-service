import { Injectable } from '@nestjs/common';
import { SisPermissoesRepository } from './sis-permissoes.repository';
import { SisPermissoesDto } from './sis-permissoes.dto';

@Injectable()
export class SisPermissoesService {
  constructor(private readonly repository: SisPermissoesRepository) {}

  async getPermissoesByUsuarioId(usuario_id: string) {
    return this.repository.findByUsuarioId(usuario_id);
  }

  async createPermissao(dto: SisPermissoesDto) {
    return this.repository.createOne(dto);
  }

  async updatePermissao(dto: SisPermissoesDto) {
    return this.repository.updateOne(dto);
  }
}
