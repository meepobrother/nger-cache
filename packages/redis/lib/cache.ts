import { CacheStore, CacheStoreSetOptions, CacheManagerOptions } from '@nger/core';
import { RedisClient } from 'redis';
export interface RedisCacheOptions extends CacheManagerOptions {
    host: string;
    port: number;
}
export class RedisCache implements CacheStore {
    constructor(public client: RedisClient) { }
    set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> {
        return new Promise((resolve, reject) => {
            const cb = (err: Error | null, payload?: string | string[]) => {
                if (err) return reject(err);
                resolve()
            }
            options = options || {};
            let ttl: number = 0;
            if (options.ttl) {
                if (typeof options.ttl === 'number') {
                    ttl = options.ttl;
                } else {
                    ttl = options.ttl(value)
                }
            }
            const val = JSON.stringify(value) || '"undefined"';
            if (ttl) {
                this.client.setex(key, ttl, val, handleResponse(cb));
            } else {
                this.client.set(key, val, handleResponse(cb));
            }
        })
    }
    get<T>(key: string): Promise<T | undefined> {
        return new Promise<T | undefined>((resolve, reject) => {
            const cb = (err: Error | null, payload?: T) => {
                if (err) return reject(err);
                resolve(payload)
            }
            this.client.get(key, handleResponse(cb, { parse: true }));
        })
    }
    del(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err: Error | null, reply?: number) => {
                if (err) return reject(err);
                resolve()
            })
        })
    }
}

function handleResponse<T = any>(cb: (err: Error | null, result?: T) => void, opts: any = {}) {
    return (err: Error | null, reply: any) => {
        if (err) {
            return cb && cb(err);
        }
        if (opts.parse) {
            let results: any[] = [];
            if (!Array.isArray(reply)) {
                results = [reply];
            }
            results = results.map((_result: any) => {
                try {
                    _result = JSON.parse(_result);
                } catch (e) {
                    return cb && cb(e);
                }
                return _result;
            });
            reply = Array.isArray(reply) ? results : results[0];
        }
        return cb && cb(null, reply);
    };
}
