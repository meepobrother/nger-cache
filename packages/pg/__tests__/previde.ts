import { Config, InjectionToken } from "@nger/core"
import { PGCacheOptions } from "../lib/cache"
export const PgToken = new InjectionToken<PGCacheOptions>(`PgToken`)
export default {
    provide: PgToken,
    useFactory: (config: Config) => {
        return {
            host: config.get('host', '193.112.55.191'),
            port: config.get(`port`, `5432`),
            database: config.get(`database`, `zzh`),
            username: config.get(`username`, `magnus`),
            password: config.get(`password`, `magnus`),
            max: config.get(`max`, 100),
        }
    },
    deps: [
        Config
    ]
}