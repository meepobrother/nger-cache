import { CacheStore, CacheStoreSetOptions, CacheManagerOptions } from '@nger/core';
import LRUCache from "lru-cache";
const options = {
    maxAge: 1000 * 60 * 60
}
const cache = new LRUCache(options)
export class MemoryCache implements CacheStore {
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
                    cache.set(key, value, ttl)
                } else {
                    cache.set(key, value)
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
                const res = cache.get(key);
                resolve(res ? res as T : undefined);
            } catch (e) {
                reject(e);
            }
        })

    }
    del(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                cache.del(key);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }
}
