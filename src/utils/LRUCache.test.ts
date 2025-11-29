import { describe, test, expect } from "vitest";
import { LRUCache } from "./LRUCache.js";

describe(LRUCache, () => {
  describe("When below capacity", () => {
    test("data remain in memory", () => {
      const cache = new LRUCache<string>(3);
      cache.put("key1", "val1");
      cache.put("key2", "val2");
      cache.put("key3", "val3");

      expect(cache.get("key1")).toBe("val1");
      expect(cache.get("key2")).toBe("val2");
      expect(cache.get("key3")).toBe("val3");
    });
  });

  describe("When above capacity", () => {
    test("least used data is evicted from memory", () => {
      const cache = new LRUCache<string>(3);
      cache.put("key1", "val1");
      cache.put("key2", "val2");
      cache.put("key3", "val3");
      cache.get("key1");
      cache.put("key4", "val4");

      expect(cache.get("key1")).toBe("val1");
      expect(cache.get("key2")).toBeUndefined();
      expect(cache.get("key3")).toBe("val3");
      expect(cache.get("key4")).toBe("val4");
    });
  });
});