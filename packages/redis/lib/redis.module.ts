import { Module, ModuleWithProviders, InjectionToken, Injector } from '@nger/core';
import { CacheStore, CACHE_MANAGER_OPTION } from '@nger/cache';
import { createClient, RedisClient, ClientOpts } from 'redis';
import { RedisCache } from './cache';
@Module({})
export class RedisModule {
    static forFeature(options: ClientOpts | InjectionToken<ClientOpts>): ModuleWithProviders {
        return {
            ngModule: RedisModule,
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
