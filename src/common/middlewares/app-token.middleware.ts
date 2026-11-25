// src/common/middlewares/app-token.middleware.ts
import type { FastifyReply, FastifyRequest } from 'fastify';

const APP_TOKEN = process.env.APP_TOKEN || '';

/**
 * Equivalente Fastify do antigo AppTokenMiddleware (NestMiddleware/Express).
 *
 * Precisa ser um hook `preHandler`: middlewares Nest sob o adapter Fastify
 * rodam via @fastify/middie no estágio `onRequest`, onde o body ainda não foi
 * parseado — e este guarda lê o token de `req.body`.
 *
 * Registro:
 *   const instance = app.getHttpAdapter().getInstance();
 *   instance.addHook('preHandler', appTokenHook);
 */
export async function appTokenHook(req: FastifyRequest, reply: FastifyReply) {
  if (req.method === 'OPTIONS') return reply.status(204).send();

  // whitelist do Swagger
  const path = req.url.split('?')[0] || '';
  if (
    path.startsWith('/docs') ||     // UI e assets
    path.startsWith('/docs-json') ||// JSON
    path.startsWith('/health')      // healthcheck, se tiver
  ) {
    return;
  }

  const body = req.body as Record<string, unknown> | undefined;
  const query = req.query as Record<string, unknown> | undefined;

  const tokenFromBody = (body && (body.token as string)) || '';
  const tokenFromQuery = (query?.token as string) || '';
  const token = tokenFromBody || tokenFromQuery;

  if (!token) {
    return reply.status(401).send({ error: 'TOKEN_MISSING', message: 'Token é obrigatório.' });
  }
  if (token !== APP_TOKEN) {
    return reply.status(403).send({ error: 'TOKEN_INVALID', message: 'Token inválido.' });
  }

  if (body && 'token' in body) delete body.token;
}
