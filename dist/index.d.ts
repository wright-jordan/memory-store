import type { SessionStore, SessionData } from "session-middleware";
declare module "session-middleware" {
    interface SessionData {
        idleDeadline: number;
    }
}
interface MemoryStore extends SessionStore {
    all(): Promise<{
        [id: string]: SessionData;
    }>;
    _m: Map<string, SessionData>;
}
export declare function Store(): MemoryStore;
export {};
