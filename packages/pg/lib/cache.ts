import { CacheStore, CacheStoreSetOptions, CacheManagerOptions } from '@nger/core';
import { Db } from './repository/db';
import { PGCacheEntity } from './entities/cache';
export interface PGCacheOptions extends CacheManagerOptions {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
}
export class PGCache implements CacheStore {
    constructor(private readonly db: Db) { }

    set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const repository = this.db.getConnection().getRepository(PGCacheEntity);
                const item = await repository.findOne(key);
                if (item) {
                    await repository.update(key, { value, createTime: new Date().toString() });
                } else {
                    const entity = repository.create({ key, value });
                    await repository.insert(entity);
                }
                resolve()
            } catch (e) {
                reject(e);
            }
        })
    }
    get<T>(key: string): Promise<T | undefined> {
        return new Promise<T | undefined>(async (resolve, reject) => {
            try {
                const repository = this.db.getConnection().getRepository(PGCacheEntity);
                const item = await repository.findOne(key);
                resolve(item ? item.value as T : undefined);
            } catch (e) {
                reject(e);
            }
        })
    }
    del(key: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const repository = this.db.getConnection().getRepository(PGCacheEntity);
                await repository.delete(key);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }
}
