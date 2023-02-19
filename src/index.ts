import type {
  SessionStore,
  SessionData,
  StoreDeleteError,
  StoreGetError,
  StoreSetError,
} from "session-middleware";

declare module "session-middleware" {
  interface SessionData {
    idleDeadline: number;
  }
}

export class MemoryStore implements SessionStore {
  #m = new Map<string, SessionData>();
  constructor() {}
  async get(
    id: string,
    ttl: number
  ): Promise<{ data: SessionData | null; err: StoreGetError | null }> {
    const data = this.#m.get(id);
    if (!data) {
      return { data: null, err: null };
    }
    const now = Math.floor(Date.now() / 1000);
    if (now > data.idleDeadline || now > data.absoluteDeadline) {
      this.#m.delete(id);
      return { data: null, err: null };
    }
    data.idleDeadline = now + ttl;
    this.#m.set(id, data);
    return { data, err: null };
  }
  async set(
    id: string,
    data: SessionData,
    ttl: number
  ): Promise<StoreSetError | null> {
    data.idleDeadline = Math.floor(Date.now() / 1000) + ttl;
    this.#m.set(id, data);
    return null;
  }
  async delete(id: string): Promise<StoreDeleteError | null> {
    this.#m.delete(id);
    return null;
  }
  async all() {
    const cache: { [id: string]: SessionData } = {};
    for (const [id, data] of this.#m) {
      cache[id] = structuredClone(data);
    }
    return cache;
  }
}
