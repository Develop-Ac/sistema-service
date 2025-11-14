import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginRepository } from './login.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret', // use .env em produção
      signOptions: { expiresIn: '24h', algorithm: 'HS256' },
    }),
    PrismaModule],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository],
  exports: [LoginService, LoginRepository],
})
export class LoginModule {}
