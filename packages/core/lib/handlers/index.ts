import { StaticProvider, Injector, InjectionToken } from "@nger/core";
import { CacheMetadataKey, CacheOptions } from "../decorators";
import { IPropertyDecorator } from '@nger/decorator'
import { CacheStore } from "../cache";
const handler = (old: any, instance: any, injector: Injector, decorator: IPropertyDecorator<any, CacheOptions>) => {
    const options = decorator.options
    if (options) {
        const store = injector.get(CacheStore)
        if (options.property instanceof InjectionToken) {
            const key = injector.get(options.property)
            Reflect.set(instance, decorator.property, store.get(key))
        } else {
            const key = options.property;
            Reflect.set(instance, decorator.property, store.get(key))
        }
    }
}
export const cacheProvider: StaticProvider = {
    provide: CacheMetadataKey,
    useValue: handler
}
