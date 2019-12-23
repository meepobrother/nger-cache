import { CacheStore, CacheStoreSetOptions, CacheManagerOptions } from '@nger/core';
import LRUCache from "lru-cache";
export interface MemoryCacheOptions extends CacheManagerOptions {
    name?: string;
}
export class MemoryCache implements CacheStore {
    constructor(public memoryOptions: MemoryCacheOptions) {
        this.cache = new LRUCache({
            max: memoryOptions.max || 100,
            maxAge: memoryOptions.ttl || 60 * 5
        })
    }
    cache: LRUCache<any, any>

    set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> {
        return new Promise((resolve, reject) => {
            options = options || {};
            let ttl: number = 0;
            if (options.ttl) {
                if (typeof options.ttl === 'number') {
                    ttl = options.ttl;
                } else {
                    ttl = options.ttl(value)
                }
            }
            ttl *= 1000;
            try {
                if (ttl) {
                    this.cache.set(key, value, ttl)
                } else {
                    this.cache.set(key, value)
                }
                resolve()
            } catch (e) {
                reject(e);
            }

        })
    }

    get<T>(key: string): Promise<T | undefined> {
        return new Promise<T | undefined>((resolve, reject) => {
            try {
                const res = this.cache.get(key);
                resolve(res ? res as T : undefined);
            } catch (e) {
                reject(e);
            }
        })

    }
    del(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.cache.del(key);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }
}
