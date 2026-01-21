"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCw, Check, X, Server } from "lucide-react";
import { motion } from "framer-motion";

type Phase = "IDLE" | "PREPARE" | "COMMIT" | "ABORT";
type Vote = "YES" | "NO" | null;

interface Participant {
    id: string;
    vote: Vote;
    state: "IDLE" | "PREPARED" | "COMMITTED" | "ABORTED";
    healthy: boolean;
}

export default function TwoPhaseCommit() {
    const [phase, setPhase] = useState<Phase>("IDLE");
    const [participants, setParticipants] = useState<Participant[]>([
        { id: "DB-1", vote: null, state: "IDLE", healthy: true },
        { id: "DB-2", vote: null, state: "IDLE", healthy: true },
    ]);
    const [logs, setLogs] = useState<string[]>([]);

    const log = (msg: string) => setLogs(p => [msg, ...p].slice(0, 5));

    const startTx = () => {
        setPhase("PREPARE");
        setParticipants(p => p.map(x => ({ ...x, vote: null, state: "IDLE" }))); // Reset
        log("Coordinator: Starting Transaction. Sending PREPARE...");

        // Simulate Network Delay for Prepare Phase
        setTimeout(() => {
            // Each participant decides based on health
            setParticipants(prev => prev.map(p => {
                if (!p.healthy) {
                    log(`Participant ${p.id} is unhealthy/unreachable.`);
                    return { ...p, vote: null }; // No response (Timeout)
                }
                const vote = Math.random() > 0.2 ? "YES" : "NO"; // 80% chance to commit
                log(`Participant ${p.id} voted ${vote}.`);
                return { ...p, vote: vote as Vote, state: vote === "YES" ? "PREPARED" : "ABORTED" };
            }));

            // Move to Commit Phase decision logic
            setTimeout(decide, 1000);
        }, 1500);
    };

    const decide = () => {
        // We need to read the 'current' state, but inside setTimeout closure we need refs or functional update inspection.
        // We'll trust the React cycle for this simple visualizer, or pass state relative to 'participants' in a useEffect.
        // Let's use a useEffect hook listening to changes? No, explicit flow is better.
        // We'll execute this logic in the timeout but grabbing value from a specialized state update or assume immediate calculation.

        setParticipants(currentRetry => {
            const allYes = currentRetry.every(p => p.vote === "YES");
            const finalPhase = allYes ? "COMMIT" : "ABORT";

            setPhase(finalPhase);
            log(`Coordinator: Decision is ${finalPhase}!`);

            return currentRetry.map(p => {
                if (!p.healthy) return p; // Still unreachable
                return {
                    ...p,
                    state: finalPhase === "COMMIT" ? "COMMITTED" : "ABORTED"
                };
            });
        });
    };

    const toggleHealth = (id: string) => {
        setParticipants(prev => prev.map(p => p.id === id ? { ...p, healthy: !p.healthy } : p));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
            <Card>
                <CardContent className="pt-6 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Button onClick={startTx} disabled={phase !== "IDLE" && phase !== "COMMIT" && phase !== "ABORT"}>
                            <Play className="mr-2 w-4 h-4" /> Start Transaction
                        </Button>
                        <Button variant="outline" onClick={() => { setPhase("IDLE"); setParticipants(p => p.map(x => ({ ...x, vote: null, state: "IDLE" }))); setLogs([]); }}>
                            <RotateCw className="mr-2 w-4 h-4" /> Reset
                        </Button>
                    </div>
                    <div className="flex gap-2 text-sm font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                        STATUS:
                        <span className={
                            phase === "COMMIT" ? "text-green-600 font-bold" :
                                phase === "ABORT" ? "text-red-600 font-bold" : "text-blue-600"
                        }>{phase}</span>
                    </div>
                </CardContent>
            </Card>

            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border relative p-8 flex flex-col items-center">

                {/* Coordinator */}
                <div className="mb-20 relative z-10">
                    <motion.div
                        className="w-48 h-24 bg-card border-2 border-indigo-500 rounded-xl shadow-lg flex flex-col items-center justify-center p-4"
                        animate={{ scale: phase === "PREPARE" ? 1.1 : 1 }}
                    >
                        <div className="font-bold text-lg">Coordinator</div>
                        <div className="text-xs text-muted-foreground">Transaction Manager</div>
                    </motion.div>
                </div>

                {/* Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="50%" y1="18%" x2="30%" y2="60%" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
                    <line x1="50%" y1="18%" x2="70%" y2="60%" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />

                    {/* Moving Packets */}
                    {phase === "PREPARE" && (
                        <>
                            <motion.circle r="6" fill="#3b82f6" initial={{ cx: "50%", cy: "18%" }} animate={{ cx: "30%", cy: "60%" }} transition={{ duration: 1 }} />
                            <motion.circle r="6" fill="#3b82f6" initial={{ cx: "50%", cy: "18%" }} animate={{ cx: "70%", cy: "60%" }} transition={{ duration: 1 }} />
                        </>
                    )}
                </svg>

                {/* Participants */}
                <div className="flex justify-around w-full max-w-4xl px-20">
                    {participants.map((p, i) => (
                        <div key={p.id} className="flex flex-col items-center gap-4 relative z-10">
                            <motion.div
                                className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center bg-card shadow-xl transition-colors
                                    ${!p.healthy ? "border-slate-700 bg-slate-800 opacity-50" :
                                        p.state === "COMMITTED" ? "border-green-500" :
                                            p.state === "ABORTED" ? "border-red-500" :
                                                p.state === "PREPARED" ? "border-amber-500" : "border-slate-300"}
                                `}
                            >
                                <Server className="w-8 h-8 mb-2" />
                                <div className="font-bold">{p.id}</div>
                                <div className="text-xs uppercase font-mono mt-1">{p.state}</div>
                                {p.vote && (
                                    <Badge variant={p.vote === "YES" ? "outline" : "destructive"} className="mt-2">
                                        VOTE: {p.vote}
                                    </Badge>
                                )}
                            </motion.div>

                            <Button
                                size="sm"
                                variant={p.healthy ? "destructive" : "secondary"}
                                onClick={() => toggleHealth(p.id)}
                            >
                                {p.healthy ? "Simulate Crash" : "Recover Node"}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Logs */}
                <div className="mt-auto w-full max-w-2xl bg-black/80 text-green-400 font-mono text-sm p-4 rounded-lg shadow-inner h-32 overflow-hidden">
                    {logs.map((l, i) => <div key={i}>&gt; {l}</div>)}
                </div>

            </div>
        </div>
    );
}
