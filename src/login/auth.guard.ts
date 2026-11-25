import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não fornecido');
        }

        try {
            // O secret deve bater com o usado no LoginModule.
            // Aqui assumimos que o JwtService está configurado com o mesmo secret no módulo.
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'dev-secret'
            });

            // 💡 Anexamos o payload ao objeto de request
            // para que possamos acessá-lo nos route handlers
            request['user'] = payload;
        } catch (err) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
        return true;
    }

    private extractTokenFromHeader(request: FastifyRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
