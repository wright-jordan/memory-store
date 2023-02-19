export class MemoryStore {
    #m = new Map();
    constructor() { }
    async get(id, ttl) {
        const data = this.#m.get(id);
        if (!data) {
            return { data: null, err: null };
        }
        const now = Math.floor(Date.now() / 1000);
        if (now > data.absoluteDeadline) {
            this.#m.delete(id);
            return { data: null, err: null };
        }
        data.idleDeadline = now + ttl;
        this.#m.set(id, data);
        setTimeout(async () => {
            this.#m.delete(id);
        }, ttl * 1000);
        return { data, err: null };
    }
    async set(id, data, ttl) {
        data.idleDeadline = Math.floor(Date.now() / 1000) + ttl;
        this.#m.set(id, data);
        return null;
    }
    async delete(id) {
        this.#m.delete(id);
        return null;
    }
    async all() {
        const cache = {};
        for (const [id, data] of this.#m) {
            cache[id] = structuredClone(data);
        }
        return cache;
    }
}
