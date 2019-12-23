import { Module, ModuleWithProviders, InjectionToken, CacheStore, Self, Optional, SkipSelf } from "@nger/core";
import { FileCacheOptions, FileCache } from './cache';
export const FILE_OPTIONS = new InjectionToken<FileCacheOptions[]>(`FILE_OPTIONS`)
export const CACHE_CURRENT_NAME = new InjectionToken<string>(`CACHE_CURRENT_NAME`)
@Module()
export class FileModule {
    static hasInstall: boolean = false;
    static forRoot(options: FileCacheOptions): ModuleWithProviders {
        //当右一个forRoot执行了这个时候再调用时抛错
        if (this.hasInstall) {
            throw new Error(``)
        }
        this.hasInstall = true;
        options.name = options.name || 'default';
        return {
            ngModule: FileModule,
            providers: [{
                provide: CacheStore,
                useExisting: FileCache
            }, {
                provide: CACHE_CURRENT_NAME,
                useValue: options.name
            }, {
                provide: FILE_OPTIONS,
                useValue: options,
                multi: true
            }, {
                provide: CacheStore,
                useFactory: (name: string, options: FileCacheOptions[]) => {
                    const option = options.find(option => option.name === name)
                    if (!option) throw new Error(`can not fount cache options ${name}`)
                    return new FileCache(option)
                },
                deps: [[new Self(), new Optional(), CACHE_CURRENT_NAME], FILE_OPTIONS]
            }]
        }
    }

    static forFeature(options: FileCacheOptions & { name: string }): ModuleWithProviders {
        return {
            ngModule: FileModule,
            providers: [{
                provide: CACHE_CURRENT_NAME,
                useValue: options.name
            }, {
                provide: FILE_OPTIONS,
                useValue: options,
                multi: true
            }]
        }
    }
}

