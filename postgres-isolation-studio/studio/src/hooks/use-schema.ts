import { useState, useEffect } from 'react';
import { SimulatedSession } from "@/lib/simulated-session";

export function useSchema(session: SimulatedSession | null, intervalMs = 2000) {
    const [tables, setTables] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        let timer: ReturnType<typeof setTimeout>;

        const poll = async () => {
            if (!isMounted || !session) {
                if (!session) timer = setTimeout(poll, intervalMs);
                return;
            }

            try {
                const res = await session.query(`
                    SELECT tablename 
                    FROM pg_tables 
                    WHERE schemaname = 'public' 
                    ORDER BY tablename;
                `);

                if (isMounted && res && res.rows) {
                    const newTables = res.rows.map((r: any) => r.tablename);
                    // Simple deep compare to avoid render loops if possible, 
                    // though React state setter usually handles identity checks.
                    // Array content check is manual.
                    setTables(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(newTables)) {
                            return newTables;
                        }
                        return prev;
                    });
                }
            } catch (e) {
                // ignore
            }

            timer = setTimeout(poll, intervalMs);
        };

        poll();

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [session, intervalMs]);

    return tables;
}
