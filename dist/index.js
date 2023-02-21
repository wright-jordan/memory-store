async function _get(id, ttl) {
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
async function _set(id, data, ttl) {
    data.idleDeadline = Math.floor(Date.now() / 1000) + ttl;
    this._m.set(id, data);
    return null;
}
async function _delete(id) {
    this._m.delete(id);
    return null;
}
async function _all() {
    const cache = {};
    for (const [id, data] of this._m) {
        cache[id] = structuredClone(data);
    }
    return cache;
}
export function Store() {
    const _m = new Map();
    return {
        _m,
        get: _get,
        set: _set,
        delete: _delete,
        all: _all,
    };
}
