import { Injectable } from '@nestjs/common';
import { LoginRepository } from './login.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private readonly repo: LoginRepository,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Valida credenciais e retorna o usuário + JWT em caso de sucesso.
   */
  async login(codigo: string, senha: string) {
    const usuario = await this.repo.findUsuarioByCodigo(codigo);

    if (!usuario) {
      return {
        success: false,
        message: 'Usuario não existe.',
      };
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return {
        success: false,
        message: 'Senha incorreta.',
      };
    }

    // Payload que irá dentro do token (coloque só o necessário)
    const payload = {
      sub: usuario.id,
      nome: usuario.nome,
      codigo: usuario.codigo,
      setor: usuario.setor,
    };

    // Gere o token (pode customizar issuer/audience se quiser)
    const access_token = await this.jwt.signAsync(payload, {
      // opcional: sobrescrever configs do módulo por chamada
      // issuer: 'ac-auth',
      // audience: 'api-gateway',
    });

    // (Opcional) informe o tempo de expiração em segundos
    const decodedExp = this.jwt.decode(access_token) as { exp?: number } | null;
    const expires_in = decodedExp?.exp
      ? Math.max(decodedExp.exp * 1000 - Date.now(), 0) / 1000
      : 0;

    return {
      success: true,
      message: 'Login realizado com sucesso',
      usuario: usuario.nome,
      usuario_id: usuario.id,
      codigo: usuario.codigo,
      setor: usuario.setor,
      token_type: 'Bearer',
      expires_in,            // seg até expirar (opcional)
      access_token,          // <<< JWT no body
    };
  }
}
