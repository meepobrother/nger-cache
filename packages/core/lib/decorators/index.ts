import { createPropertyDecorator, IPropertyDecorator } from '@nger/decorator';
import { InjectionToken } from '@nger/core';
export const CacheMetadataKey = `@nger/cache CacheMetadataKey`
export interface CacheOptions {
    property: string | InjectionToken<string>;
}
export const Cache = createPropertyDecorator<CacheOptions | string | InjectionToken<string>>(CacheMetadataKey, (it: IPropertyDecorator<any, CacheOptions | string | InjectionToken<string>>) => {
    const options = it.options
    if (typeof options === 'string' || options instanceof InjectionToken) {
        it.options = {
            property: options
        }
    } else if (options) {
        it.options = {
            ...options
        }
    } else { 
        it.options = {
            property: it.property as string
        }
    }
})
