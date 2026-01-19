import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleHelp, Terminal, Database, Lock } from "lucide-react";


export function GuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <CircleHelp className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Postgres Isolation Studio Guide</DialogTitle>
                    <DialogDescription>
                        Learn how to use this tool to simulate and visualize database isolation levels.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4">
                    <div className="space-y-6 text-sm">

                        <section className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-blue-500" />
                                Interactive Sessions
                            </h3>
                            <p className="text-muted-foreground">
                                You have two interactive SQL terminals: <strong>Session A</strong> and <strong>Session B</strong>.
                                They represent two concurrent client connections to the same database.
                                Running a command in one may affect the visibility or locking state of the other.
                            </p>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Database className="w-4 h-4 text-green-500" />
                                Shared Database
                            </h3>
                            <p className="text-muted-foreground">
                                Both sessions connect to a generic PGlite (WASM Postgres) instance.
                                Changes are persisted to standard IndexedDB in your browser.
                                Use the <strong>Table Watcher</strong> sidebar to monitor table data in real-time.
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                <li><strong>Clear Button</strong>: Truncates the table (removes all data).</li>
                                <li><strong>Delete Button</strong>: Drops the table entirely.</li>
                            </ul>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4 text-orange-500" />
                                Simulating Locks
                            </h3>
                            <p className="text-muted-foreground">
                                While <code>pg-lite</code> runs in-browser, this studio simulates strict locking blocking.
                                If you start a transaction in Session A (<code>BEGIN</code>) and perform a write,
                                Session B may be blocked from writing to the same row until A commits.
                            </p>
                            <div className="bg-muted p-3 rounded-md font-mono text-xs mt-2 border">
                                <span className="text-blue-500">-- Session A</span><br />
                                BEGIN;<br />
                                UPDATE users SET age = 30 WHERE id = 1;<br />
                                <br />
                                <span className="text-purple-500">-- Session B (will block)</span><br />
                                UPDATE users SET name = 'Bob' WHERE id = 1;
                            </div>
                        </section>

                        <section className="space-y-2">
                            <h3 className="font-semibold">Tips & Tricks</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>Use <code>BEGIN;</code> to start a transaction explicitly.</li>
                                <li>Use <code>COMMIT;</code> or <code>ROLLBACK;</code> to end it and release locks.</li>
                                <li>If a session seems stuck ("Blocked"), it is waiting for a lock held by the other session.</li>
                                <li>Use the trash icon in the sidebar to clean up mess if things get out of sync.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
