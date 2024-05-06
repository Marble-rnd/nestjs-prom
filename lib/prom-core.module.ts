import {
  Global,
  DynamicModule,
  Module,
  NestModule,
  MiddlewareConsumer,
  Inject,
} from '@nestjs/common';
import { PromModuleOptions } from './interfaces';
import { DEFAULT_PROM_REGISTRY, PROM_REGISTRY_NAME, DEFAULT_PROM_OPTIONS } from './prom.constants';

import * as client from 'prom-client';
import {
  Registry,
  collectDefaultMetrics,
  DefaultMetricsCollectorConfiguration,
  PrometheusContentType,
} from 'prom-client';
import { getRegistryName } from './common';
import { InboundMiddleware } from './middleware';
import { PromService } from './prom.service';

@Global()
@Module({})
export class PromCoreModule implements NestModule {

  static forRoot(
    options: PromModuleOptions = {},
  ): DynamicModule {

    const {
      withDefaultsMetrics,
      registryName,
      prefix,
    } = options;

    const promRegistryName = registryName ?
      getRegistryName(registryName)
      : DEFAULT_PROM_REGISTRY;

    const promRegistryNameProvider = {
      provide: PROM_REGISTRY_NAME,
      useValue: promRegistryName,
    }

    const promRegistryOptionsProvider = {
      provide: DEFAULT_PROM_OPTIONS,
      useValue: options,
    }

    const registryProvider = {
      provide: promRegistryName,
      useFactory: (): Registry => {

        let registry = client.register;
        if (promRegistryName !== DEFAULT_PROM_REGISTRY) {
          registry = new Registry();
        }

        // clear here for HMR support
        registry.clear();

        if (options.defaultLabels) {
          registry.setDefaultLabels(options.defaultLabels)
        }

        if (withDefaultsMetrics !== false) {
          const defaultMetricsOptions: DefaultMetricsCollectorConfiguration<PrometheusContentType> = {
            register: registry,
          };
          if (prefix) {
            defaultMetricsOptions.prefix = prefix;
          }
          collectDefaultMetrics(defaultMetricsOptions);
        }

        return registry;
      },

    }

    return {
      module: PromCoreModule,
      providers: [
        promRegistryNameProvider,
        promRegistryOptionsProvider,
        registryProvider,
        PromService,
      ],
      exports: [
        registryProvider,
        PromService,
      ],
    };
  }

  constructor(
    @Inject(DEFAULT_PROM_OPTIONS) private readonly options: PromModuleOptions
  ) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.options.withHttpMiddleware?.enable === true) {
      consumer.apply(InboundMiddleware).forRoutes('*');
    }
  }
}
