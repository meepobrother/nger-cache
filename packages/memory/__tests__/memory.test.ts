import { corePlatform, CacheStore, Module, SkipSelf, Self } from '@nger/core';
import { MemoryModule } from '../lib/memory.module';

// @Module({
//     imports: [
//         MemoryModule.forFeature({
//             name: 'child',
//         })
//     ]
// })
// export class ChildModule {}
@Module({
    imports: [
        MemoryModule.forRoot({
        }),
        // ChildModule
    ]
})
export class AppModule { }
interface StoreResult {
    titl1e: string
}
corePlatform().bootstrapModule(AppModule).then(async res => {
    const store = res.injector.get(CacheStore)
    await store.set(`zzh21`, 123);
    const result = await store.get<StoreResult>(`zzh21`);
    const result2 = await store.get(`zzh2`);
    await store.del(`zzh21`);
    await store.del(`zzh`);

    const result3 = await store.get<StoreResult>(`zzh21`);


    // await store.del(`zz3h`)
    // console.log(1)
    debugger

})