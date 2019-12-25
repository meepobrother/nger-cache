import { Module, corePlatform, Injectable } from '@nger/core'
import { Cache, CacheModule } from '@nger/cache'
export class DemoCache {
    async get<T>(key: string): Promise<T | undefined> {
        return {
            key
        } as any;
    }
}
@Injectable()
export class DemoService {
    @Cache(`demo`)
    demo: Promise<{ key: string }>;
}

@Module({
    imports: [
        CacheModule.forRoot(DemoCache as any)
    ],
    providers: [
        DemoService
    ]
})
export class AppModule { }

corePlatform().bootstrapModule(AppModule).then(async res => {
    const demo = res.get(DemoService)
    const demo2 = await demo.demo;
    debugger;
})