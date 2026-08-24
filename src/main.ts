// src/main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Equivalente ao antigo bodyParser.json/urlencoded({ limit: '25mb' }).
// No Fastify o limite é do adapter e vale para os dois content-types.
const BODY_LIMIT = 25 * 1024 * 1024;

function parseOrigins(env?: string): (string | RegExp)[] {
  if (!env) return [];
  return env
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      // Permite regex usando prefixo "regex:"
      if (s.startsWith('regex:')) {
        const pattern = s.slice(6);
        return new RegExp(pattern);
      }
      return s;
    });
}

function isAllowedOrigin(origin: string | undefined, allowed: (string | RegExp)[]) {
  if (!origin) return true; // requests server-to-server, curl, etc.
  if (allowed.length === 0) return true; // se não configurou nada, libera
  for (const rule of allowed) {
    if (rule instanceof RegExp && rule.test(origin)) return true;
    if (typeof rule === 'string' && rule === origin) return true;
  }
  return false;
}

// Reproduz o casamento de prefixo do antigo app.use(['/docs', '/docs-json'], ...)
const DOCS_PREFIXES = ['/docs', '/docs-json'];
function isDocsPath(url: string): boolean {
  const path = url.split('?')[0];
  return DOCS_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`));
}

async function bootstrap() {
  // Se estiver atrás de proxy reverso (Nginx/Traefik) e usar cookies Secure, habilite:
  // new FastifyAdapter({ bodyLimit: BODY_LIMIT, trustProxy: 1 })
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: BODY_LIMIT }),
    { bufferLogs: true },
  );

  const instance = app.getHttpAdapter().getInstance() as FastifyInstance;

  await app.register(fastifyCookie);

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,     // necessário para swagger-ui
    crossOriginEmbedderPolicy: false, // evita bloqueio de assets
  });

  instance.addHook('onRequest', async (req, reply) => {
    if (!isDocsPath(req.url)) return;

    const authHeader = req.headers.authorization;

    const user = 'admin';
    const password = 'Ac@2025acesso';

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      reply.header('WWW-Authenticate', 'Basic realm="Swagger"');
      return reply.status(401).send('Autenticação necessária');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');

    const [inputUser, inputPassword] = credentials.split(':');

    if (inputUser !== user || inputPassword !== password) {
      reply.header('WWW-Authenticate', 'Basic realm="Swagger"');
      return reply.status(401).send('Usuário ou senha inválidos');
    }
  });

  const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
  // Ex.: CORS_ORIGIN="http://intranet.acacessorios.local,http://localhost:3000"
  // ou   CORS_ORIGIN="regex:^https?://(localhost:\d+|.*\.acacessorios\.local)$"

  app.enableCors({
    origin: (origin, callback) => {
      const ok = isAllowedOrigin(origin, allowedOrigins);
      callback(null, ok);
    },
    credentials: true, // necessário se usar cookies/autenticação
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: ['Content-Disposition'],
    maxAge: 86400, // cache do preflight por 1 dia
  });

  // Garante que o hook de Vary rode depois do @fastify/cors, preservando a
  // ordem que o Express tinha (cors -> Vary).
  await instance.after();

  // Garante Vary: Origin (útil se usar origin dinâmico/função)
  instance.addHook('onRequest', async (_req, reply) => {
    reply.header('Vary', 'Origin');
  });

  // (opcional) prefixo global
  // app.setGlobalPrefix('api');

  // === Swagger only if enabled ===
  if (process.env.SWAGGER_ENABLED === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Intranet AC Acessórios - Service API')
      .setDescription(`
      API de serviços do sistema de intranet da AC Acessórios

      ## Módulos disponíveis:
      - **Login**: Autenticação de usuários
      - **Usuário**: Gerenciamento de usuários

      ## Autenticação:
      A API utiliza tokens de acesso que podem ser enviados via query parameter \`token\` ou header \`Authorization: Bearer <token>\`.
      `)
      .setVersion('2.0.0')
      .setContact('AC Acessórios - TI', 'https://acacessorios.com.br', 'ti@acacessorios.com.br')
      .setLicense('Proprietário', '')
      .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT para autenticação',
      },
      'jwt',
      )
      .addApiKey(
      {
        type: 'apiKey',
        name: 'token',
        in: 'query',
        description: 'TOKEN de acesso da aplicação enviado via query parameter',
      },
      'appToken',
      )
      .addServer(process.env.PUBLIC_URL ?? 'http://localhost:8000', 'Servidor de Desenvolvimento')
      .addServer('http://sistema-service.acacessorios.local', 'Servidor de Produção')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
      deepScanRoutes: true,
    });

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
      },
      customSiteTitle: 'Intranet AC Acessórios — API Documentation',
      customfavIcon: '/favicon.ico',
      customJs: [
        'https://unpkg.com/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css',
      ],
      customCssUrl: [
        'https://unpkg.com/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css',
      ],
    });
    // UI: /docs • JSON: /docs-json
  }

  const port = parseInt(process.env.PORT || '8000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}`);
  if (process.env.SWAGGER_ENABLED === 'true') {
    console.log(`Swagger em http://localhost:${port}/docs`);
  }
}
bootstrap();
