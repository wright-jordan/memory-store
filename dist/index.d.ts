import type { SessionStore, SessionData, StoreDeleteError, StoreGetError, StoreSetError } from "session-middleware";
declare module "session-middleware" {
    interface SessionData {
        idleDeadline: number;
    }
}
export declare class MemoryStore implements SessionStore {
    #private;
    constructor();
    get(id: string, ttl: number): Promise<{
        data: SessionData | null;
        err: StoreGetError | null;
    }>;
    set(id: string, data: SessionData, ttl: number): Promise<StoreSetError | null>;
    delete(id: string): Promise<StoreDeleteError | null>;
    all(): Promise<{
        [id: string]: SessionData;
    }>;
}
