import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoginModule } from './login/login.module';
import { S3Module } from './storage/s3.module';
import { SisPermissoesModule } from './permissoes/sis-permissoes.module';

@Module({
imports: [
    UsuarioModule,
    PrismaModule,
    LoginModule,
    S3Module,
    SisPermissoesModule,

    PrometheusModule.register({
      defaultMetrics: { enabled: true }, // CPU, memória, event loop, GC
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
