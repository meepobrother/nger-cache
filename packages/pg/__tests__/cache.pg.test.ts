import { corePlatform, CacheStore, Module, InjectionToken, Config } from '@nger/core';
import { PGModule } from '../lib/pg.module';
import provide, { PgToken } from './previde';
@Module({
    imports: [
        PGModule.forRoot(PgToken),
        // ChildModule
    ],
    providers: [
        provide
    ]
})
export class AppModule { }

interface StoreResult {
    titl1e: string
}
corePlatform().bootstrapModule(AppModule).then(async res => {
    const store = res.injector.get(CacheStore);
    console.log(store)
    await store.set(`111`, { a: 1, b: 2 });
    const result = await store.get<StoreResult>(`111`);
    await store.del(`zzh22`)
    console.log(1)
    debugger

})