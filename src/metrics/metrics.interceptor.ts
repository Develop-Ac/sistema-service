// metrics.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const end = this.histogram.startTimer();

    // No Fastify o padrão de rota vem de routeOptions.url (o req.route do
    // Express não existe). Sem isso o label cairia na URL concreta.
    const route = req.routeOptions?.url ?? req.url;

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<FastifyReply>();
          end({
            method: req.method,
            route,
            status_code: res.statusCode,
          });
        },
        error: () => {
          end({ method: req.method, route, status_code: 500 });
        },
      }),
    );
  }
}
