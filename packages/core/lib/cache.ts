/**
 * Interface defining a cache store. Implement this interface to create a custom
 * cache store.
 *
 * @publicApi
 */
export abstract class CacheStore {
    /**
     * Create a key/value pair in the cache.
     *
     * @param key cache key
     * @param value cache value
     */
    abstract set<T>(
        key: string,
        value: T,
        options?: CacheStoreSetOptions<T>,
    ): Promise<void>;
    /**
     * Retrieve a key/value pair from the cache.
     *
     * @param key cache key
     */
    abstract get<T>(key: string): Promise<T | undefined>;
    /**
     * Destroy a key/value pair from the cache.
     *
     * @param key cache key
     */
    abstract del(key: string): Promise<void>;
}

export interface CacheStoreSetOptions<T> {
    /**
     * Time to live - amount of time in seconds that a response is cached before it
     * is deleted. Defaults based on your cache manager settings.
     */
    ttl?: ((value: T) => number) | number;
}


/**
 * Interface defining Cache Manager configuration options.
 *
 * @publicApi
 */
export interface CacheManagerOptions {
    /**
     * Time to live - amount of time in seconds that a response is cached before it
     * is deleted. Subsequent request will call through the route handler and refresh
     * the cache.  Defaults to 5 seconds.
     */
    ttl?: number;
    /**
     * Maximum number of responses to store in the cache.  Defaults to 100.
     */
    max?: number;
    isCacheableValue?: (value: any) => boolean;
}
import { InjectionToken } from '@nger/di';
export const CACHE_MANAGER_OPTION = new InjectionToken(`CACHE_MANAGER_OPTION`)
