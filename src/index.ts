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

interface MemoryStore extends SessionStore {
  all(): Promise<{ [id: string]: SessionData }>;
  _m: Map<string, SessionData>;
}

async function _get(
  this: MemoryStore,
  id: string,
  ttl: number
): Promise<{ data: SessionData | null; err: StoreGetError | null }> {
  const data = this._m.get(id);
  if (!data) {
    return { data: null, err: null };
  }
  const now = Math.floor(Date.now() / 1000);
  if (now > data.idleDeadline || now > data.absoluteDeadline) {
    this._m.delete(id);
    return { data: null, err: null };
  }
  data.idleDeadline = now + ttl;
  this._m.set(id, data);
  return { data, err: null };
}

async function _set(
  this: MemoryStore,
  id: string,
  data: SessionData,
  ttl: number
): Promise<StoreSetError | null> {
  data.idleDeadline = Math.floor(Date.now() / 1000) + ttl;
  this._m.set(id, data);
  return null;
}

async function _delete(
  this: MemoryStore,
  id: string
): Promise<StoreDeleteError | null> {
  this._m.delete(id);
  return null;
}

async function _all(this: MemoryStore) {
  const cache: { [id: string]: SessionData } = {};
  for (const [id, data] of this._m) {
    cache[id] = structuredClone(data);
  }
  return cache;
}

export function Store(): MemoryStore {
  const _m = new Map<string, SessionData>();
  return {
    _m,
    get: _get,
    set: _set,
    delete: _delete,
    all: _all,
  };
}
