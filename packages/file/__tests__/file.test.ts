import { corePlatform, CacheStore, Module, SkipSelf, Self } from '@nger/core';
import { FileModule } from '../lib/file.module';
import { join } from 'path'


// @Module({
//     imports: [
//         FileModule.forFeature({
//             name: 'child',
//             path: join(__dirname, 'child')
//         })
//     ]
// })
// export class ChildModule {}
@Module({
    imports: [
        FileModule.forRoot({
            path: __dirname
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
    await store.set(`zzh222`, 123);
    const result = await store.get<StoreResult>(`zzh222`);
    await store.del(`zz3h`)
    console.log(1)
    debugger

})