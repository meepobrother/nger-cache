import { getConnection } from '@notadd/magnus-typeorm';
import { Inject } from "@nger/core";
import { ADDON_NAME } from './def';

export class Db {
    constructor(@Inject(ADDON_NAME) public name: string) { }
    getConnection() {
        return getConnection(this.name);
    }
}