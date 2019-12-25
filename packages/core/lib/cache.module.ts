import { Module, ModuleWithProviders, Type } from '@nger/core';
import { CacheStore } from './cache';
import { cacheProvider } from './handlers/index';

@Module({
    providers: [
        cacheProvider
    ]
})
export class CacheModule {
    static forRoot(cache: Type<CacheStore>): ModuleWithProviders {
        return {
            ngModule: CacheModule,
            providers: [{
                provide: CacheStore,
                useClass: cache
            }]
        }
    }

    static forFeature(cache: Type<CacheStore>): ModuleWithProviders {
        return {
            ngModule: CacheModule,
            providers: [{
                provide: CacheStore,
                useClass: cache
            }]
        }
    }
}
