import { corePlatform, CacheStore, Module } from '@nger/core';
import { PGModule } from '../lib/pg.module';

@Module({
    imports: [
        PGModule.forRoot({
            host:`193.112.55.191`,
            port:`5432`,
            database:`zzh`,
            username:`magnus`,
            password:`magnus`,
            max:100,
            
        }),
        // ChildModule
    ]
})
export class AppModule { }

interface StoreResult {
    titl1e: string
}
corePlatform().bootstrapModule(AppModule).then(async res => {
    const store =  res.injector.get(CacheStore);
    console.log(store)
    await store.set(`zzh2`, {a:1,b:2});
    const result = await store.get<StoreResult>(`zzh2`);
    await store.del(`zzh22`)
    console.log(1)
    debugger

})