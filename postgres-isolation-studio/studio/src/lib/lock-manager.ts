type ResolveFunction = () => void;
type TxId = string;
type ResourceKey = string;

export class LockManager {
    private locks: Map<ResourceKey, TxId>;
    private queues: Map<ResourceKey, ResolveFunction[]>;

    constructor() {
        this.locks = new Map();
        this.queues = new Map();
    }

    async acquire(resource: ResourceKey, txId: TxId): Promise<void> {
        if (this.locks.has(resource)) {
            const owner = this.locks.get(resource);
            if (owner === txId) return; // Re-entrant

            console.log(`[LockManager] Resource ${resource} locked by ${owner}. Tx ${txId} WAITING...`);
            return new Promise((resolve) => {
                if (!this.queues.has(resource)) this.queues.set(resource, []);
                this.queues.get(resource)!.push(resolve);
            });
        }
        this.locks.set(resource, txId);
        console.log(`[LockManager] Tx ${txId} ACQUIRED ${resource}`);
    }

    releaseAll(txId: TxId): void {
        for (const [resource, owner] of this.locks.entries()) {
            if (owner === txId) {
                this.locks.delete(resource);
                console.log(`[LockManager] Tx ${txId} RELEASED ${resource}`);

                // Wake up next
                if (this.queues.has(resource)) {
                    const queue = this.queues.get(resource)!;
                    if (queue.length > 0) {
                        const nextResolve = queue.shift()!;
                        nextResolve();
                    }
                }
            }
        }
    }
}

export const globalLockManager = new LockManager();
