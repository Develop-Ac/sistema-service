import { Module } from '@nestjs/common';
import { OrcamentoBloqueadoController } from './orcamento-bloqueado.controller';
import { OrcamentoBloqueadoService } from './orcamento-bloqueado.service';
import { OrcamentoBloqueadoRepository } from './orcamento-bloqueado.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrcamentoBloqueadoController],
  providers: [OrcamentoBloqueadoService, OrcamentoBloqueadoRepository],
})
export class OrcamentoBloqueadoModule {}
