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
        await this.ensureDb();
        if (!this.db) throw new Error("DB initialization failed");

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

        if (isSelectForUpdate && this.txId) {
            const [_, table, id] = isSelectForUpdate;
            const resource = `${table}:${id}`;
            // eslint-disable-next-line
            console.log(`${this.name}: Requesting Lock on ${resource}...`);
            // This will AWAIT if locked
            await globalLockManager.acquire(resource, this.txId);
            // eslint-disable-next-line
            console.log(`${this.name}: Lock Granted. Running SQL...`);
        }

        if (isUpdate && this.txId) {
            const [_, table, id] = isUpdate;
            const resource = `${table}:${id}`;
            // "Implicit" lock check for UPDATE
            // eslint-disable-next-line
            console.log(`${this.name}: Requesting Write Lock on ${resource}...`);
            await globalLockManager.acquire(resource, this.txId);
        }

        // Execute real SQL
        let res;
        try {
            const start = Date.now();
            res = await this.db.query(sql);
            const duration = Date.now() - start;
            if (duration > 50) console.log(`${this.name}: SQL Executed in ${duration}ms`);
        } catch (e) {
            // If error in transaction, we usually abort, but for now just throw
            throw e;
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
