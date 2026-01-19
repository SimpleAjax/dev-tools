import { SimulatedSession } from "@/lib/simulated-session";
import { useTableWatcher } from "@/hooks/use-table-watcher";
import { useSchema } from "@/hooks/use-schema";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { Trash2, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SingleTableWatcherProps {
    tableName: string;
    session: SimulatedSession | null;
    onExecute?: (sql: string) => Promise<void>;
}

function SingleTableWatcher({ tableName, session, onExecute }: SingleTableWatcherProps) {
    const { rows, columns, lastUpdated, error } = useTableWatcher(tableName, session);

    const handleClear = async () => {
        if (onExecute) {
            await onExecute(`TRUNCATE TABLE ${tableName};`);
            return;
        }
        if (!session) return;
        try {
            await session.query(`TRUNCATE TABLE ${tableName};`);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async () => {
        if (onExecute) {
            await onExecute(`DROP TABLE ${tableName};`);
            return;
        }
        if (!session) return;
        try {
            await session.query(`DROP TABLE ${tableName};`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col h-[300px] border rounded-md bg-slate-50 dark:bg-zinc-950/50 overflow-hidden shrink-0">
            <div className="flex items-center justify-between p-2 border-b bg-card">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{tableName}</h3>
                    {lastUpdated && (
                        <span className="text-[10px] text-muted-foreground animate-pulse">
                            • Live
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[10px] font-mono mr-2">
                        {rows.length} rows
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClear} title="Clear Data">
                        <Eraser className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={handleDelete} title="Drop Table">
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {/* ScrollArea component can sometimes conflict with flex-1 if not managed carefully, just native scroll for now inside */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col} className="h-8 text-xs">{col}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length || 1} className="text-center text-xs text-muted-foreground py-8">
                                    {error ? `Error: ${error}` : 'No data'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow key={i} className="hover:bg-muted/50">
                                    {columns.map((col) => (
                                        <TableCell key={col} className="py-1 text-xs font-mono">
                                            {JSON.stringify(row[col])}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

interface TableWatcherProps {
    session: SimulatedSession | null;
    onExecute?: (sql: string) => Promise<void>;
}

export function TableWatcher({ session, onExecute }: TableWatcherProps) {
    const tables = useSchema(session);

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-semibold text-sm mb-4">Table Watcher</h3>
            <ScrollArea className="h-full pr-4">
                <div className="flex flex-col gap-4 pb-4">
                    {tables.length === 0 && (
                        <div className="text-sm text-muted-foreground p-2">
                            No user tables found.
                        </div>
                    )}
                    {tables.map(table => (
                        <SingleTableWatcher key={table} tableName={table} session={session} onExecute={onExecute} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
