import { Module, ModuleWithProviders, InjectionToken, Injector } from "@nger/core";
import { CacheStore, CacheModule } from '@nger/cache'
import { FileCache, CACHE_PATH } from './cache';
@Module({
    imports: [
        CacheModule
    ]
})
export class CacheFileModule {
    static forRoot(options: string | InjectionToken<string>): ModuleWithProviders {
        return {
            ngModule: CacheFileModule,
            providers: [{
                provide: CACHE_PATH,
                useFactory: (injector: Injector) => {
                    if (options instanceof InjectionToken) {
                        return injector.get(options)
                    } else {
                        return options;
                    }
                },
                deps: [Injector]
            }, {
                provide: CacheStore,
                useFactory: (injector: Injector) => new FileCache(injector),
                deps: [Injector]
            }]
        }
    }

    static forFeature(options: string | InjectionToken<string>): ModuleWithProviders {
        return {
            ngModule: CacheFileModule,
            providers: [{
                provide: CACHE_PATH,
                useFactory: (injector: Injector) => {
                    if (options instanceof InjectionToken) {
                        return injector.get(options)
                    } else {
                        return options;
                    }
                },
                deps: [Injector]
            }, {
                provide: CacheStore,
                useFactory: (injector: Injector) => new FileCache(injector),
                deps: [Injector]
            }]
        }
    }
}

