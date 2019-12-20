import { Module, ModuleWithProviders, InjectionToken, Injector, CacheStore, CACHE_MANAGER_OPTION } from '@nger/core';
import { createClient, RedisClient, ClientOpts } from 'redis';
import { RedisCache } from './cache';
@Module({})
export class CacheRedisModule {
    static forFeature(options: ClientOpts | InjectionToken<ClientOpts>): ModuleWithProviders {
        return {
            ngModule: CacheRedisModule,
            providers: [{
                provide: CacheStore,
                useFactory: (client: RedisClient) => {
                    return new RedisCache(client)
                },
                deps: [RedisClient]
            }, {
                provide: RedisClient,
                useFactory: (options: ClientOpts) => createClient(options),
                deps: [CACHE_MANAGER_OPTION]
            }, {
                provide: CACHE_MANAGER_OPTION,
                useFactory: (injector: Injector) => options instanceof InjectionToken ? injector.get(options) : options,
                deps: [Injector]
            }]
        }
    }
}
