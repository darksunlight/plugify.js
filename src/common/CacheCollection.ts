/**
 * Taken from https://github.com/zaida04/guilded.js/blob/e7f7c0000049233305c56d30bc5e9c82f6854c1c/packages/common/lib/CacheCollection.ts
 * Licensed under the MIT License <https://github.com/zaida04/guilded.js/blob/e7f7c0000049233305c56d30bc5e9c82f6854c1c/LICENSE>
 */

import Collection from '@discordjs/collection';

/**
 * A collection with a max cap size, which will remove a random element
 */
export class CacheCollection<K, V> extends Collection<K, V> {
    public maxSize: number;

    public constructor(options?: CacheCollectionOptions, entries?: readonly (readonly [K, V])[] | null | undefined) {
        super(entries);
        if (options?.maxSize !== undefined && options.maxSize < 1) {
            throw new TypeError('Cannot pass 0 or negative value as maxSize.');
        }
        this.maxSize = options?.maxSize ?? Infinity;
    }

    public set(...args: Parameters<typeof Collection.prototype['set']>): this {
        if (this.size >= this.maxSize) this.delete(this.firstKey()!);
        return super.set(...args);
    }
}

export interface CacheCollectionOptions {
    maxSize?: number;
}