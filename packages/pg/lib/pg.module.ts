import { Module, ModuleWithProviders, OnModuleInit, InjectionToken, Injector, Inject, CacheStore } from "@nger/core";
import { PGCacheOptions, PGCache } from './cache';
import { ADDON_NAME } from "./repository/def";
import { Db } from "./repository/db";
import { createConnection } from "@notadd/magnus-typeorm";
import { PGCacheEntity } from "./entities/cache";
export const PGCACHE_OPTIONS_TOKEN = new InjectionToken<PGCacheOptions>(`@nger/cache.pg PGCACHE_OPTIONS_TOKEN`)
export const PGCACHE_OPTIONS = new InjectionToken<PGCacheOptions>(`@nger/cache.pg PGCACHE_OPTIONS`)

@Module()
export class PGModule implements OnModuleInit {
    static hasInstall: boolean = false;
    constructor(
        @Inject(PGCACHE_OPTIONS) private options: PGCacheOptions,
        @Inject(ADDON_NAME) private connectName: string

    ) { }
    static forRoot(options: PGCacheOptions | InjectionToken<PGCacheOptions>): ModuleWithProviders {
        //当右一个forRoot执行了这个时候再调用时抛错
        if (this.hasInstall) {
            throw new Error(``)
        }
        this.hasInstall = true;
        return {
            ngModule: PGModule,
            providers: [{
                provide: ADDON_NAME,
                useValue: `PGCache`
            }, {
                provide: Db,
                deps: [ADDON_NAME]
            }, {
                provide: PGCACHE_OPTIONS_TOKEN,
                useValue: options
            }, {
                provide: PGCACHE_OPTIONS,
                useFactory: (injector: Injector, opt: PGCacheOptions | InjectionToken<PGCacheOptions>) => {
                    return opt instanceof InjectionToken ? injector.get(opt) : opt;
                },
                deps: [
                    Injector,
                    PGCACHE_OPTIONS_TOKEN
                ]
            }, {
                provide: CacheStore,
                useFactory: (Db: Db) => {
                    return new PGCache(Db)
                },
                deps: [Db]
            },]
        }
    }

    async ngOnModuleInit() {
        console.log(this.connectName)
        await createConnection({
            type: 'postgres',
            host: this.options.host || 'localhost',
            port: parseInt(this.options.port || '5432', 10),
            database: this.options.database || 'postgres',
            username: this.options.username || 'postgres',
            password: this.options.password || 'password',
            entities: [
                PGCacheEntity,
            ],
            name: this.connectName,
            synchronize: true
        })
    }
}

