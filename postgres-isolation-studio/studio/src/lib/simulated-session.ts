import { PGlite } from "@electric-sql/pglite";
import { globalLockManager } from "./lock-manager";

export class SimulatedSession {
    name: string;
    dbUrl: string;
    db: PGlite | null = null;
    txId: string | null = null;
    inTx: boolean = false;

    constructor(name: string, dbUrl: string) {
        this.name = name;
        this.dbUrl = dbUrl;
    }

    // No-op now, but kept for compatibility
    async init() {
        // We do lazy loading now
    }

    private async ensureDb() {
        if (!this.db) {
            // console.log(`${this.name}: Connecting to DB...`);
            this.db = new PGlite(this.dbUrl);
            await this.db.waitReady;
        }
    }

    async query(sql: string): Promise<any> {
        // simple parser for POC
        const isBegin = sql.match(/\bBEGIN\b/i);
        const isCommit = sql.match(/\bCOMMIT\b/i);
        const isRollback = sql.match(/\bROLLBACK\b/i);
        const isSelectForUpdate = sql.match(/SELECT.*FROM\s+(\w+).*WHERE\s+id=(\d+).*FOR UPDATE/i);
        const isUpdate = sql.match(/UPDATE\s+(\w+).*WHERE\s+id=(\d+)/i);

        if (isBegin) {
            this.inTx = true;
            this.txId = this.name + '_' + Date.now();
            console.log(`${this.name}: BEGIN (TxId: ${this.txId})`);
        }

        // PRE-CHECK: If we are about to need a lock, acquire it BEFORE opening DB connection if possible?
        // Actually, for UPDATE/SELECT FOR UPDATE, we need to parse the ID.
        // We can do this with regex as we are doing.

        let lockResource: string | null = null;

        if (isSelectForUpdate) {
            const [_, table, id] = isSelectForUpdate;
            lockResource = `${table}:${id}`;
        } else if (isUpdate) {
            const [_, table, id] = isUpdate;
            lockResource = `${table}:${id}`;
        }

        // CRITICAL FIX: If we need a lock, get it BEFORE ensureDb if we aren't already connected.
        // If we are already connected (inTx), we might be fine, or we might block ourselves?
        // No, if we are inTx, we are the one holding the file lock potentially.
        // Wait, PGlite/IDB locking is per-file.
        // If Session A is InTx, it has `this.db` open. It holds the IDB lock.
        // Session B (inTx=false) comes in. `ensureDb` tries to open `new PGlite()`. 
        // This `new PGlite()` will BLOCK on IDB lock held by A.
        // This is why B hangs and never visualized.

        // We need B to wait on a LOGICAL lock before it even tries directly if we want to simulate row locking 
        // instead of falling back to file locking.

        // BUT, if B is just doing `UPDATE...`, and A holds a row lock...
        // If we use `globalLockManager`, B awaits there. 
        // `ensureDb` hasn't run yet?
        // `await this.ensureDb()` is at line 30.
        // We need to move `ensureDb` DOWN, after lock acquisition.

        // Logic to handle "Implicit Transactions"
        // If we are NOT in a transaction, but we are running a LOCKING command,
        // we must pretend we are in a transaction for the duration of this lock check.

        let tempTxId: string | null = null;

        if (lockResource) {
            if (!this.txId) {
                // Implicit Transaction!
                tempTxId = this.name + '_implicit_' + Date.now();
                // We do NOT set this.inTx = true, because we want to auto-close later.
            }

            const activeTxId = this.txId || tempTxId;

            if (activeTxId) {
                console.log(`${this.name}: Requesting Lock on ${lockResource} (Tx: ${activeTxId})...`);
                await globalLockManager.acquire(lockResource, activeTxId);
                console.log(`${this.name}: Lock Granted.`);
            }
        }

        // NOW we connect.
        await this.ensureDb();
        if (!this.db) throw new Error("DB initialization failed");

        // Execute real SQL
        let res;
        try {
            const start = Date.now();
            res = await this.db.query(sql);
            const duration = Date.now() - start;
            if (duration > 50) console.log(`${this.name}: SQL Executed in ${duration}ms`);
        } catch (e) {
            // Need to release locks if implicit?
            // If explicit transaction, we usually keep locks until rollback.
            // If implicit, we should release?
            throw e;
        } finally {
            // If it was an implicit transaction, release locks logic
            if (tempTxId) {
                console.log(`${this.name}: Implicit Tx Done. Releasing locks...`);
                globalLockManager.releaseAll(tempTxId);
            }
        }

        if ((isCommit || isRollback) && this.txId) {
            // eslint-disable-next-line
            console.log(`${this.name}: ${isCommit ? 'COMMIT' : 'ROLLBACK'}. Releasing locks...`);
            globalLockManager.releaseAll(this.txId);
            this.txId = null;
            this.inTx = false;
        }

        // Auto-Close if not in transaction
        if (!this.inTx) {
            await this.close();
        }

        return res;
    }

    async close() {
        if (this.db) {
            await this.db.close();
            this.db = null;
            // Short delay to allow IDBFS to unlock
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async restart() {
        await this.close();
    }
}
