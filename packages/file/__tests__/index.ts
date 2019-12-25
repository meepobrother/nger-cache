import { Module, corePlatform, Injectable } from '@nger/core'
import { Cache, CacheStore } from '@nger/cache'
import { CacheFileModule } from '../lib'
import { join } from 'path'
@Injectable()
export class DemoService {
    @Cache(`username`)
    username: Promise<string>;
}

@Module({
    imports: [
        CacheFileModule.forRoot(join(__dirname, '1.txt'))
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