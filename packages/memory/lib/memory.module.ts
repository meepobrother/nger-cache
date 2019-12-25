import { Module, ModuleWithProviders, InjectionToken, Self, Optional, SkipSelf, Injector } from "@nger/core";
import { MemoryCache } from './cache';
import { CacheManagerOptions, CacheStore, CacheModule } from '@nger/cache';
export const MEMORY_OPTIONS = new InjectionToken<CacheManagerOptions>(`MEMORY_OPTIONS`)
@Module({
    imports: [CacheModule]
})
export class CacheMemoryModule {
    static hasInstall: boolean = false;
    static forRoot(options: CacheManagerOptions | InjectionToken<CacheManagerOptions>): ModuleWithProviders {
        return {
            ngModule: CacheMemoryModule,
            providers: [{
                provide: MEMORY_OPTIONS,
                useFactory: (injector: Injector) => {
                    return options instanceof InjectionToken ? injector.get(options) : options
                },
                deps: [
                    Injector
                ]
            }, {
                provide: CacheStore,
                useFactory: (options: CacheManagerOptions) => {
                    return new MemoryCache(options)
                },
                deps: [MEMORY_OPTIONS]
            }]
        }
    }

    static forFeature(options: CacheManagerOptions | InjectionToken<CacheManagerOptions>): ModuleWithProviders {
        return {
            ngModule: CacheMemoryModule,
            providers: [{
                provide: MEMORY_OPTIONS,
                useFactory: (injector: Injector) => {
                    return options instanceof InjectionToken ? injector.get(options) : options
                },
                deps: [
                    Injector
                ]
            }, {
                provide: CacheStore,
                useFactory: (options: CacheManagerOptions) => {
                    return new MemoryCache(options)
                },
                deps: [MEMORY_OPTIONS]
            }]
        }
    }
}

