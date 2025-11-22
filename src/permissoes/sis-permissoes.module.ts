import { Module } from '@nestjs/common';
import { SisPermissoesController } from './sis-permissoes.controller';
import { SisPermissoesService } from './sis-permissoes.service';
import { SisPermissoesRepository } from './sis-permissoes.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SisPermissoesController],
  providers: [SisPermissoesService, SisPermissoesRepository],
})
export class SisPermissoesModule {}
