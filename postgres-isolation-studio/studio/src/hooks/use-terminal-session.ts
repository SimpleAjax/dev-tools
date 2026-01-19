import { useState, useCallback } from 'react';
import { SimulatedSession } from "@/lib/simulated-session";
import type { PromptLine, LockState } from "@/types/terminal";

export interface TerminalState {
    lines: PromptLine[];
    status: LockState;
    session: SimulatedSession | null;
}

export function useTerminalSession(name: string, dbUrl: string, onCommit?: () => void) {
    const [lines, setLines] = useState<PromptLine[]>([{ type: 'info', content: 'Initializing PGlite...' }]);
    const [status, setStatus] = useState<LockState>('idle');
    const [session, setSession] = useState<SimulatedSession | null>(null);

    const init = useCallback(async () => {
        try {
            const sess = new SimulatedSession(name, dbUrl);
            await sess.init();
            setSession(sess);
            if (name === 'Terminal A') { // Hacky message dedup
                // setLines(prev => [...prev, { type: 'info', content: 'Ready.' }]);
            } else {
                // setLines(prev => [...prev, { type: 'info', content: 'Ready.' }]);
            }
            setLines(prev => [...prev, { type: 'info', content: 'Ready.' }]);
        } catch (e: any) {
            setLines(prev => [...prev, { type: 'error', content: 'Init Failed: ' + e.message }]);
        }
    }, [name, dbUrl]);

    // Force refresh the connection (for sync)
    const refresh = useCallback(async () => {
        if (session) {
            setLines(prev => [...prev, { type: 'info', content: 'Syncing...' }]);
            await session.close();
            // With lazy loading, "refresh" just means ensuring we don't hold the lock if we don't need it.
            // Next query will auto-connect.
            setLines(prev => [...prev, { type: 'info', content: 'Synced.' }]);
        }
    }, [session]);

    const execute = useCallback(async (sql: string) => {
        if (!session) return;

        // Echo input
        setLines(prev => [...prev, { type: 'input', content: sql }]);

        // Hack for UI feedback: Set a timeout. If not done in 100ms, set status 'waiting'.
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        try {
            timeoutId = setTimeout(() => {
                setStatus('waiting');
            }, 100);

            const res = await session.query(sql);
            setStatus('idle');

            if (res && res.rows) {
                // Determine format
                if (res.rows.length > 0) {
                    // Simple table formatter
                    const keys = Object.keys(res.rows[0]);
                    const header = keys.join(' | ');
                    const rows = res.rows.map((r: any) => keys.map(k => r[k]).join(' | ')).join('\n');
                    setLines(prev => [...prev, { type: 'output', content: `${header}\n${'-'.repeat(header.length)}\n${rows}` }]);
                } else {
                    // No rows returned (DDL/DML)
                    const msg = (res.affectedRows !== undefined)
                        ? `Query OK. Affected rows: ${res.affectedRows}`
                        : 'Query OK.';
                    setLines(prev => [...prev, { type: 'info', content: msg }]);
                }
            } else {
                // Command like BEGIN/COMMIT might not return rows
                setLines(prev => [...prev, { type: 'info', content: 'OK' }]);
            }

            // Check for COMMIT to trigger sync
            if (sql.match(/^COMMIT/i) || sql.match(/\b(DROP|CREATE|INSERT|UPDATE|DELETE|TRUNCATE|ALTER)\b/i)) {

                // With lazy loading, the session 'query' method already closes the DB if not in Tx.
                // So we just need to notify the other session to clear its state if needed.
                if (onCommit) onCommit();
            }

        } catch (e: any) {
            setStatus('idle');
            setLines(prev => [...prev, { type: 'error', content: e.message }]);
        } finally {
            clearTimeout(timeoutId);
        }
    }, [session, onCommit]);

    const clear = useCallback(() => setLines([]), []);

    return {
        lines,
        status,
        session,
        init,
        execute,
        refresh,
        clear
    };
}
