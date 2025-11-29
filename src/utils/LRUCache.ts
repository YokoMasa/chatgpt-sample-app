export class LRUCache<T> {

  private cache: Map<string, T>;
  private capacity: number;

  constructor(capacity: number) {
    this.cache = new Map<string, T>();

    if (capacity < 1) {
      throw new Error("capacity has to be larger than 1");
    }
    this.capacity = capacity;
  }

  public put(key: string, value: T) {
    if (this.capacity <= this.cache.size) {
      const lruKey = this.cache.keys().next().value;
      if (lruKey != null) {
        this.cache.delete(lruKey);
      }
    }

    this.cache.delete(key);
    this.cache.set(key, value);
  }

  public get(key: string) {
    const value = this.cache.get(key);
    if (value != null) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }

    return value;
  }

  public has(key: string) {
    return this.cache.has(key);
  }

  public delete(key: string) {
    this.cache.delete(key);
  }


}