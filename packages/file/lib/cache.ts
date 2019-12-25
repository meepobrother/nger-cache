import { CacheStore, CacheStoreSetOptions } from '@nger/cache';
import { ensureDirSync, writeJsonSync, readJsonSync } from "fs-extra";
import { Injector, InjectionToken } from '@nger/core';
import { dirname } from "path";
export const CACHE_PATH = new InjectionToken<string>(`@nger/cache-file CACHE_PATH`)

export class FileCache implements CacheStore {
    path: string;
    constructor(public injector: Injector) {
        this.ensureDir()
    }
    private ensureDir() {
        this.path = this.injector.get(CACHE_PATH)
        ensureDirSync(dirname(this.path));
        const target = this.getJson()
        if (!target) {
            writeJsonSync(this.path, { __date__: new Date() }, {
                encoding: 'utf8'
            });
        }
    }
    private getJson(): any {
        try {
            return readJsonSync(this.path, {
                encoding: 'utf8'
            })
        }
        catch (e) {
            throw e;
        }
    }
    async set<T>(key: string, value: T, options?: CacheStoreSetOptions<T>): Promise<void> {
        const target = this.getJson()
        Reflect.set(target, key, value)
        writeJsonSync(this.path, target);
    }
    async get<T>(key: string): Promise<T | undefined> {
        const target = this.getJson();
        return Reflect.get(target, key);
    }
    async del(key: string): Promise<void> {
        const target = this.getJson()
        delete target.key;
        writeJsonSync(this.path, target);
    }
}
