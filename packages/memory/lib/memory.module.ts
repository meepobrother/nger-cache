import { Module, ModuleWithProviders, InjectionToken, CacheStore, Self, Optional, SkipSelf } from "@nger/core";
import { MemoryCacheOptions, MemoryCache } from './cache';
export const MEMORY_OPTIONS = new InjectionToken<MemoryCacheOptions[]>(`MEMORY_OPTIONS`)
export const CACHE_CURRENT_NAME = new InjectionToken<string>(`CACHE_CURRENT_NAME`)
@Module()
export class MemoryModule {
    static hasInstall: boolean = false;
    static forRoot(options: MemoryCacheOptions): ModuleWithProviders {
        //当右一个forRoot执行了这个时候再调用时抛错
        if (this.hasInstall) {
            throw new Error(``)
        }
        this.hasInstall = true;
        options.name = options.name || 'default';
        return {
            ngModule: MemoryModule,
            providers: [{
                provide: CacheStore,
                useExisting: MemoryCache
            },{
                provide: CACHE_CURRENT_NAME,
                useValue: options.name
            }, {
                provide: MEMORY_OPTIONS,
                useValue: options,
                multi: true
            }, {
                provide: CacheStore,
                useFactory: (name: string, options: MemoryCacheOptions[]) => {
                    const option = options.find(option => option.name === name)
                    if (!option) throw new Error(`can not fount cache options ${name}`)
                    return new MemoryCache(option)
                },
                deps: [[new Self(), new Optional(), CACHE_CURRENT_NAME], MEMORY_OPTIONS]
            }]
        }
    }

    static forFeature(options: MemoryCacheOptions & { name: string }): ModuleWithProviders {
        return {
            ngModule: MemoryModule,
            providers: [{
                provide: CACHE_CURRENT_NAME,
                useValue: options.name
            }, {
                provide: MEMORY_OPTIONS,
                useValue: options,
                multi: true
            }]
        }
    }
}

