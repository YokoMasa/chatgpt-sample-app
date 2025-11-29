import { Store, type SessionData } from "express-session";
import { LRUCache } from "../utils/LRUCache.js";

/**
 * 上限数が決まってるメモリ内セッションストア
 */
export class LRUCacheSessionStore extends Store {

  private cache: LRUCache<SessionData>;

  constructor(capacity: number) {
    super();
    this.cache = new LRUCache(capacity);
  }

  public override get(
    sid: string,
    callback: (err: any, session?: SessionData | null) => void
  ): void {
    const value = this.cache.get(sid);
    callback(null, value);
  }

  public override set(
    sid: string,
    session: SessionData,
    callback?: (err?: any) => void
  ): void {
    this.cache.put(sid, session);
    callback != null && callback();
  }

  public override destroy(
    sid: string,
    callback?: (err?: any) => void
  ): void {
    this.cache.delete(sid);
    callback != null && callback();
  }

  public override length(
    callback: (err: any, length?: number) => void
  ): void {
    callback(null, this.cache.size());  
  }

  public override touch(
    sid: string,
    session: SessionData,
    callback?: () => void
  ): void {
    this.cache.put(sid, session);
    callback != null && callback();  
  }

}