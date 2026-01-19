import { useState, useEffect } from 'react';
import { SimulatedSession } from "@/lib/simulated-session";

export interface WatcherState {
    rows: any[];
    columns: string[];
    lastUpdated: Date | null;
    error: string | null;
}

export function useTableWatcher(tableName: string, session: SimulatedSession | null, intervalMs = 1000) {
    const [state, setState] = useState<WatcherState>({
        rows: [],
        columns: [],
        lastUpdated: null,
        error: null
    });

    useEffect(() => {
        let isMounted = true;
        let timer: ReturnType<typeof setTimeout>;

        const poll = async () => {
            if (!isMounted) return;

            if (!session) {
                // Session not ready yet
                timer = setTimeout(poll, intervalMs);
                return;
            }

            try {
                // Query using the provided session (reuse connection)
                // Removed ORDER BY id ASC to support generic tables
                const res = await session.query(`SELECT * FROM ${tableName}`);

                if (isMounted && res && res.rows) {
                    const rows = res.rows;
                    // If rows exist, use their keys. If not, keep existing columns if we have them, else empty.
                    const columns = rows.length > 0 ? Object.keys(rows[0]) : state.columns;
                    setState({
                        rows,
                        columns,
                        lastUpdated: new Date(),
                        error: null
                    });
                }
            } catch (e: any) {
                if (isMounted) {
                    setState(prev => ({ ...prev, error: e.message }));
                }
            }

            timer = setTimeout(poll, intervalMs);
        };

        poll();

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [tableName, session, intervalMs]);

    return state;
}
