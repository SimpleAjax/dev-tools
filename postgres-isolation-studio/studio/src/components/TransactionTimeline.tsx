import type { TimelineEvent } from "@/types/timeline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";


interface TransactionTimelineProps {
    events: TimelineEvent[];
}

export function TransactionTimeline({ events }: TransactionTimelineProps) {
    // Sort by timestamp just in case
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-zinc-950/50 border-t">
            <div className="flex items-center justify-between p-2 px-4 border-b bg-card">
                <h3 className="font-semibold text-sm">Transaction Timeline</h3>
                <Badge variant="outline" className="text-xs">
                    {events.length} Events
                </Badge>
            </div>

            <div className="grid grid-cols-2 text-xs font-mono border-b bg-muted/40 text-muted-foreground">
                <div className="p-2 text-center border-r">Session A</div>
                <div className="p-2 text-center">Session B</div>
            </div>

            <ScrollArea className="flex-1 h-[200px]">
                <div className="p-4 space-y-2 relative">

                    {/* Central Line */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-border -translate-x-[0.5px] z-0" />

                    {sortedEvents.map((ev) => {
                        const isA = ev.sessionName.includes('Session A') || ev.sessionName.includes('Terminal A');

                        return (
                            <div key={ev.id} className="grid grid-cols-2 gap-8 relative z-10 group">
                                {/* Left Side (A) */}
                                <div className={`flex justify-end ${isA ? 'opacity-100' : 'opacity-0'}`}>
                                    {isA && (
                                        <Card className="p-2 w-full max-w-[300px] border-l-4 border-l-blue-500 shadow-sm text-xs relative">
                                            <div className="font-mono truncate font-semibold text-blue-700 dark:text-blue-400">
                                                {ev.content}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground text-right mt-1">
                                                {new Date(ev.timestamp).toLocaleTimeString()}
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                {/* Right Side (B) */}
                                <div className={`flex justify-start ${!isA ? 'opacity-100' : 'opacity-0'}`}>
                                    {!isA && (
                                        <Card className="p-2 w-full max-w-[300px] border-l-4 border-l-purple-500 shadow-sm text-xs relative">
                                            <div className="font-mono truncate font-semibold text-purple-700 dark:text-purple-400">
                                                {ev.content}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground text-right mt-1">
                                                {new Date(ev.timestamp).toLocaleTimeString()}
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                {/* Connector Dot */}
                                <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-500 transition-colors" />
                            </div>
                        );
                    })}

                    {events.length === 0 && (
                        <div className="text-center text-muted-foreground p-8 text-sm italic">
                            Waiting for events...
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
