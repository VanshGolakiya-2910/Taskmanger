import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  console.error("[redis] error", err);
});

client.on("connect", () => {
  console.log("[redis] connected");
});

export async function initRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

export const cache = {
  async get(key) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },
  async set(key, value, ttlSeconds = 300) {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  },
  async del(key) {
    await client.del(key);
  },
  async delByPrefix(prefix) {
    for await (const key of client.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
      await client.del(key);
    }
  },
};

export async function pingRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client.ping();
}
