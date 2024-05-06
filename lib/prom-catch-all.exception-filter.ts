import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CounterMetric, PromModuleOptions } from './interfaces';
import { normalizeRoute } from './utils';
import { PromService } from './prom.service';
import { DEFAULT_PROM_OPTIONS } from './prom.constants';

@Catch()
export class PromCatchAllExceptionsFilter extends BaseExceptionFilter {
  private readonly _counter: CounterMetric;

  constructor(
    promService: PromService,
    @Inject(DEFAULT_PROM_OPTIONS) private readonly _options: PromModuleOptions,
  ) {
    super();

    this._counter = promService.getCounter({
      name: 'http_exceptions',
      labelNames: ['method', 'status', 'path'],
    });
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const path = normalizeRoute(request, this._options.includeQueryParams);

    this._counter.inc({
      method: request.method,
      path,
      status,
    });
    super.catch(exception, host);
  }
}
