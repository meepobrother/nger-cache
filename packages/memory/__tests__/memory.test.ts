import { Module, corePlatform, Injectable } from '@nger/core'
import { Cache, CacheStore } from '@nger/cache'
import { CacheMemoryModule } from '../lib'
@Injectable()
export class DemoService {
    @Cache(`username`)
    username: Promise<string>;
}

@Module({
    imports: [
        CacheMemoryModule.forRoot({})
    ],
    providers: [
        DemoService
    ]
})
export class AppModule { }

corePlatform().bootstrapModule(AppModule).then(async res => {
    const cache = res.get(CacheStore)
    await cache.set(`username`,'杨明明')
    const demo = res.get(DemoService)
    const username = await demo.username;
    debugger;
})