import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PromptLine, LockState } from "@/types/terminal";

interface SqlTerminalProps {
    name: string;
    lines: PromptLine[];
    onExecute: (sql: string) => Promise<void>;
    status: LockState;
    color?: "blue" | "green" | "purple" | "orange";
}

export function SqlTerminal({ name, lines, onExecute, status, color = "blue" }: SqlTerminalProps) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            // Find the scroll viewport inside ScrollArea
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }, [lines]);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!input.trim()) return;

            const cmd = input.trim();
            setHistory(prev => [...prev, cmd]);
            setHistoryIndex(-1);
            setInput("");

            await onExecute(cmd);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newIndex = historyIndex + 1;
            if (newIndex < history.length) {
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = historyIndex - 1;
            if (newIndex >= 0) {
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    // Color mappings
    const colorStyles = {
        blue: "border-blue-500/20 bg-blue-950/5",
        green: "border-green-500/20 bg-green-950/5",
        purple: "border-purple-500/20 bg-purple-950/5",
        orange: "border-orange-500/20 bg-orange-950/5",
    };

    const statusColors = {
        idle: "bg-slate-500",
        waiting: "bg-amber-500 animate-pulse",
        acquired: "bg-emerald-500",
    };

    return (
        <Card className={cn("flex flex-col h-full rounded-none border-x-0 border-t-0 font-mono text-sm shadow-none", colorStyles[color])}>
            {/* Header */}
            <div className="flex items-center justify-between pl-6 pr-10 py-2 border-b bg-card/50 backdrop-blur-sm select-none">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                    <span className="font-semibold opacity-90">{name}</span>
                </div>
                <Badge variant="outline" className="text-xs font-normal opacity-50 capitalize">
                    {status === 'waiting' ? 'Waiting for Lock...' : 'Ready'}
                </Badge>
            </div>

            {/* Terminal Output */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-1">
                    {lines.map((line, i) => (
                        <div key={i} className={cn(
                            "whitespace-pre-wrap break-all",
                            line.type === 'input' && "text-foreground font-bold mt-2",
                            line.type === 'output' && "text-muted-foreground ml-4 border-l-2 pl-2 border-border/50",
                            line.type === 'error' && "text-red-500 ml-4",
                            line.type === 'info' && "text-blue-500 italic ml-4"
                        )}>
                            {line.type === 'input' && <span className="mr-2 opacity-50">$</span>}
                            {line.content}
                        </div>
                    ))}

                    {/* Active Input Line */}
                    <div className="flex items-center mt-2 group">
                        <span className="mr-2 text-foreground font-bold">$</span>
                        <input
                            ref={inputRef}
                            autoFocus
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={status === 'waiting'}
                            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground/30 font-bold disabled:opacity-50"
                            placeholder={status === 'waiting' ? "Blocked..." : "Type SQL command..."}
                            spellCheck={false}
                            autoComplete="off"
                        />
                        {status === 'waiting' && (
                            <div className="w-2 h-4 bg-amber-500 animate-pulse ml-1" />
                        )}
                    </div>
                </div>
            </ScrollArea>
        </Card>
    );
}
