import { CacheStore, CacheStoreSetOptions, CacheManagerOptions } from '@nger/core';
import { ensureDir, writeJSON, readJSON, remove } from "fs-extra";
import { join } from "path";
export interface FileCacheOptions extends CacheManagerOptions {
    path: string;
    name?: string;
}
export class FileCache implements CacheStore {
    constructor(public cache: FileCacheOptions) { }
    set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await ensureDir(this.cache.path);
                const path = join(this.cache.path , `${key}.json`);
                await writeJSON(path, value);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    get<T>(key: string): Promise<T | undefined> {
        return new Promise<T | undefined>(async (resolve, reject) => {
            try {
                await ensureDir(this.cache.path);
                const path = join(this.cache.path , `${key}.json`);
                const value = await readJSON(path).catch(() => resolve(undefined));
                resolve(value as T)
            } catch (e) {
                reject(e);
            }
        })

    }
    del(key: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await ensureDir(this.cache.path);
                const path = join(this.cache.path , `${key}.json`);
                await remove(path);
                resolve()
            } catch (e) {
                console.log(e)
                reject(e);
            }
        })
    }
}
