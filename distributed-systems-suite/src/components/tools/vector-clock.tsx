"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NodeState {
    id: string;
    clock: { [nodeId: string]: number };
    events: { id: string, label: string, clock: string }[];
}

interface Message {
    id: string;
    from: string;
    to: string;
    payloadClock: { [nodeId: string]: number };
    inFlight: boolean;
}

export default function VectorClockSim() {
    const nodesRef = ["A", "B", "C"];
    const [nodes, setNodes] = useState<NodeState[]>(nodesRef.map(id => ({
        id,
        clock: { "A": 0, "B": 0, "C": 0 },
        events: []
    })));
    const [messages, setMessages] = useState<Message[]>([]);

    const increment = (clock: { [k: string]: number }, nodeId: string) => {
        const next = { ...clock };
        next[nodeId] = (next[nodeId] || 0) + 1;
        return next;
    };

    const merge = (local: { [k: string]: number }, remote: { [k: string]: number }) => {
        const next = { ...local };
        Object.keys(remote).forEach(k => {
            next[k] = Math.max(next[k] || 0, remote[k]);
        });
        return next;
    };

    const formatClock = (c: { [k: string]: number }) => `[${c["A"]}, ${c["B"]}, ${c["C"]}]`;

    // 1. Local Event
    const handleLocalEvent = (nodeId: string) => {
        setNodes(prev => prev.map(n => {
            if (n.id !== nodeId) return n;
            const nextClock = increment(n.clock, nodeId);
            return {
                ...n,
                clock: nextClock,
                events: [...n.events, { id: Math.random().toString(), label: "Local", clock: formatClock(nextClock) }]
            };
        }));
    };

    // 2. Send Message (Prep)
    const handleSend = (fromId: string, toId: string) => {
        // Increment sender clock first
        let payloadClock: any = {};

        setNodes(prev => prev.map(n => {
            if (n.id !== fromId) return n;
            const nextClock = increment(n.clock, n.id);
            payloadClock = nextClock;
            return {
                ...n,
                clock: nextClock,
                events: [...n.events, { id: Math.random().toString(), label: `Send -> ${toId}`, clock: formatClock(nextClock) }]
            };
        }));

        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            from: fromId,
            to: toId,
            payloadClock,
            inFlight: true
        }]);
    };

    // 3. Receive Message
    const handleReceive = (msg: Message) => {
        setMessages(prev => prev.filter(m => m.id !== msg.id)); // Remove message

        setNodes(prev => prev.map(n => {
            if (n.id !== msg.to) return n;
            // 1. Increment local
            let nextClock = increment(n.clock, n.id);
            // 2. Merge with remote
            nextClock = merge(nextClock, msg.payloadClock);

            return {
                ...n,
                clock: nextClock,
                events: [...n.events, { id: Math.random().toString(), label: `Recv <- ${msg.from}`, clock: formatClock(nextClock) }]
            };
        }));
    };

    const reset = () => {
        setNodes(nodesRef.map(id => ({ id, clock: { "A": 0, "B": 0, "C": 0 }, events: [] })));
        setMessages([]);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
            <Card>
                <CardContent className="pt-6 flex justify-between items-center">
                    <div className="text-sm">
                        Each node maintains a vector <code>[A, B, C]</code>. <br />
                        <strong>Rule 1:</strong> On local event, increment own index. <br />
                        <strong>Rule 2:</strong> On receive, increment own index AND take <code>max()</code> of every element.
                    </div>
                    <Button variant="outline" onClick={reset}>
                        <RefreshCw className="mr-2 w-4 h-4" /> Reset
                    </Button>
                </CardContent>
            </Card>

            <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900/50 p-6 relative">
                <div className="flex justify-around min-w-[800px]">
                    {nodes.map(node => (
                        <div key={node.id} className="w-64 flex flex-col gap-4 relative">
                            {/* Node Header */}
                            <div className="bg-card border p-4 rounded-xl shadow-sm text-center sticky top-0 z-20">
                                <h3 className="font-bold text-2xl">Node {node.id}</h3>
                                <div className="font-mono text-lg my-2 bg-slate-100 dark:bg-slate-800 p-1 rounded">
                                    {formatClock(node.clock)}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Button size="sm" onClick={() => handleLocalEvent(node.id)}>Event</Button>
                                    {/* Send Buttons */}
                                    {nodesRef.filter(x => x !== node.id).map(target => (
                                        <Button key={target} size="sm" variant="secondary" onClick={() => handleSend(node.id, target)}>
                                            Msg {target}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex-1 space-y-4 px-4 min-h-[500px] border-l-2 border-dashed ml-1/2 relative">
                                <AnimatePresence>
                                    {node.events.map((e, i) => (
                                        <motion.div
                                            key={e.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white dark:bg-slate-950 border p-3 rounded shadow-sm text-center relative z-10"
                                        >
                                            <div className="text-xs font-bold uppercase text-muted-foreground">{e.label}</div>
                                            <div className="font-mono text-sm">{e.clock}</div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Arrow line from header down is implied by border-l */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Messages In Flight (Visual Overlay) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {messages.map(msg => (
                        <motion.div
                            key={msg.id}
                            initial={{ top: "10%", left: msg.from === "A" ? "20%" : msg.from === "B" ? "50%" : "80%", opacity: 0 }}
                            animate={{ opacity: 1, top: "40%" }} // Just float it in center for interaction? 
                            // Complex 2D positioning between columns is hard without explicit refs.
                            // Let's make messages interactive Buttons floating in the center.
                            className="pointer-events-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                            <Button
                                size="lg"
                                className="shadow-xl bg-indigo-600 hover:bg-indigo-700 animate-bounce"
                                onClick={() => handleReceive(msg)}
                            >
                                <span className="mr-2">Envelope from {msg.from}</span>
                                <span className="font-mono text-xs opacity-70">{formatClock(msg.payloadClock)}</span>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
