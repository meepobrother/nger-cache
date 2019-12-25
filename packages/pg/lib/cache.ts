import { CacheStore, CacheStoreSetOptions, CacheManagerOptions, Config, Injectable } from '@nger/core';
import { Db } from './repository/db';
import { PGCacheEntity } from './entities/cache';
@Injectable()
export class EnvConfig extends Config {
    get<T>(key: string, def: T): T {
        return Reflect.get(process.env, key) || def;
    }
}
export interface PGCacheOptions extends CacheManagerOptions {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
}
export class PGCache implements CacheStore {
    constructor(
        private readonly db: Db,
        private readonly option: PGCacheOptions
    ) { }
    /**
     * 删除过期数据
     */
    private async deleteStaleData(): Promise<void> {
        const now = new Date();
        const repository = this.db.getConnection().getRepository(PGCacheEntity);
        await repository.createQueryBuilder().delete()
            .where(`endTime < :endTime`, { endTime: now })
            .execute();
    }
    set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {

                const repository = this.db.getConnection().getRepository(PGCacheEntity);
                const now = new Date();
                const ttl = (this.option.ttl || 60 * 5) * 1000;
                const endTime = new Date(now.getTime() + ttl).toString()
                // 删除过期数据
                this.deleteStaleData();
                const item = await repository.findOne(key);
                if (item) {
                    await repository.update(key, { value, createTime: now.toString(), endTime });
                } else {
                    const entity = repository.create({ key, value, endTime });
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
                // 删除过期数据
                this.deleteStaleData();
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
                // 删除过期数据
                this.deleteStaleData();
                const repository = this.db.getConnection().getRepository(PGCacheEntity);
                await repository.delete(key);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }
}
