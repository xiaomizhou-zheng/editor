import { LRUMap } from 'lru_map';
import { EventEmitter2 } from 'eventemitter2';

import { CardPreview } from '../types';

export const PREVIEW_CACHE_LRU_SIZE = 50;

class ExtendedLRUCache<K, V> extends LRUMap<K, V> {
  private readonly eventEmitter: EventEmitter2;

  constructor(limit: number) {
    super(limit);
    this.eventEmitter = new EventEmitter2();
  }

  shift(): [K, V] | undefined {
    const entry = super.shift();
    this.eventEmitter.emit('shift', entry);
    return entry;
  }

  on(event: string, callback: (entry: [K, V]) => void) {
    this.eventEmitter.on(event, callback);
  }
}

export class ObjectURLCache {
  private readonly cache: ExtendedLRUCache<string, CardPreview>;

  constructor(size: number) {
    this.cache = new ExtendedLRUCache(size);
    this.cache.on('shift', (entry: [string, CardPreview]) => {
      if (entry && entry[1].dataURI) {
        URL.revokeObjectURL(entry[1].dataURI);
      }
    });
  }

  has(key: string) {
    return !!this.cache.find(key);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: CardPreview) {
    this.cache.set(key, value);
  }
  remove(key: string) {
    const removed = this.cache.delete(key);
    removed && URL.revokeObjectURL(removed.dataURI);
  }
}

export const createObjectURLCache = () =>
  new ObjectURLCache(PREVIEW_CACHE_LRU_SIZE);
