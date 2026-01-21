"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Activity, XCircle, CheckCircle, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

type State = "CLOSED" | "OPEN" | "HALF-OPEN";

export default function CircuitBreaker() {
    const [state, setState] = useState<State>("CLOSED");
    const [failures, setFailures] = useState(0);
    const [successes, setSuccesses] = useState(0); // In Half-Open
    const [failureThreshold, setFailureThreshold] = useState(5);
    const [resetTimeout, setResetTimeout] = useState(3000); // ms
    const [successThreshold, setSuccessThreshold] = useState(3);
    const [timerRemaining, setTimerRemaining] = useState(0);
    const [requests, setRequests] = useState<{ id: string, result: 'success' | 'fail' | 'blocked' }[]>([]);

    // Timer Loop for OPEN state
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (state === "OPEN" && timerRemaining > 0) {
            interval = setInterval(() => {
                setTimerRemaining(prev => Math.max(0, prev - 100));
            }, 100);
        } else if (state === "OPEN" && timerRemaining <= 0) {
            // Transition OPEN -> HALF-OPEN
            transitionTo("HALF-OPEN");
            setTimerRemaining(0);
        }
        return () => clearInterval(interval);
    }, [state, timerRemaining]);

    const transitionTo = (newState: State) => {
        setState(newState);
        if (newState === "OPEN") {
            setTimerRemaining(resetTimeout);
            setSuccesses(0); // Reset for later
        } else if (newState === "HALF-OPEN") {
            setSuccesses(0);
        } else if (newState === "CLOSED") {
            setFailures(0);
            setSuccesses(0);
            setTimerRemaining(0);
        }
    };

    const attemptRequest = (shouldSucceed: boolean) => {
        const id = Math.random().toString(36).substr(2, 5);

        // 1. Check Circuit State
        if (state === "OPEN") {
            addReq(id, "blocked");
            return;
        }

        // 2. Execute Logic
        if (shouldSucceed) {
            addReq(id, "success");

            if (state === "HALF-OPEN") {
                const newSuccess = successes + 1;
                setSuccesses(newSuccess);
                if (newSuccess >= successThreshold) {
                    transitionTo("CLOSED");
                }
            } else {
                // In CLOSED, a success basically resets failure count in some implementations, 
                // or just does nothing. Let's decay failure count on success? 
                // Classic implementation: Rolling window. Simple implementation: Count.
                // We'll keep failures independent for sliding window simplicity, or just simple count.
                // Simple: failures stay until threshold.
            }
        } else {
            addReq(id, "fail");

            if (state === "HALF-OPEN") {
                // Single failure in Half-Open trips back to Open immediately
                transitionTo("OPEN");
            } else if (state === "CLOSED") {
                const newFailures = failures + 1;
                setFailures(newFailures);
                if (newFailures >= failureThreshold) {
                    transitionTo("OPEN");
                }
            }
        }
    };

    const addReq = (id: string, result: 'success' | 'fail' | 'blocked') => {
        setRequests(prev => [...prev.slice(-9), { id, result }]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            <div className="space-y-6">
                {/* Configuration */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-semibold text-lg">Configuration</h3>
                        <div className="space-y-2">
                            <label className="text-sm flex justify-between">
                                <span>Failure Threshold (to Open)</span>
                                <span>{failureThreshold} fails</span>
                            </label>
                            <Slider min={1} max={10} value={[failureThreshold]} onValueChange={v => setFailureThreshold(v[0])} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm flex justify-between">
                                <span>Reset Timeout (Open Duration)</span>
                                <span>{resetTimeout} ms</span>
                            </label>
                            <Slider min={1000} max={10000} step={500} value={[resetTimeout]} onValueChange={v => setResetTimeout(v[0])} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm flex justify-between">
                                <span>Success Threshold (to Close)</span>
                                <span>{successThreshold} reqs</span>
                            </label>
                            <Slider min={1} max={5} value={[successThreshold]} onValueChange={v => setSuccessThreshold(v[0])} />
                        </div>
                    </CardContent>
                </Card>

                {/* Simulator Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-4">Simulate Backend Traffic</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                className="bg-green-600 hover:bg-green-700 h-16 text-lg"
                                onClick={() => attemptRequest(true)}
                            >
                                <CheckCircle className="mr-2" /> Success
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 h-16 text-lg"
                                onClick={() => attemptRequest(false)}
                            >
                                <XCircle className="mr-2" /> Error
                            </Button>
                        </div>
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 min-h-[40px]">
                            {requests.map((r, i) => (
                                <div key={i} className={`
                                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs
                                        ${r.result === 'success' ? 'bg-green-500' : ''}
                                        ${r.result === 'fail' ? 'bg-red-500' : ''}
                                        ${r.result === 'blocked' ? 'bg-slate-500' : ''}
                                    `}>
                                    {r.result === 'success' ? '✓' : r.result === 'fail' ? '✕' : '∅'}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex gap-4">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> Success</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> Error</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-500 rounded-full" /> Short Circuited</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visual State Machine */}
            <div className="relative bg-slate-50 dark:bg-slate-900/50 rounded-xl border flex items-center justify-center p-8">

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current text-muted-foreground/30" strokeWidth="2">
                    {/* Triangle layout */}
                    <line x1="50%" y1="20%" x2="20%" y2="80%" /> {/* Closed -> Open (Left) */}
                    <line x1="50%" y1="20%" x2="80%" y2="80%" /> {/* Closed -> Half (Right) - actually Half -> Closed */}
                    <line x1="20%" y1="80%" x2="80%" y2="80%" /> {/* Open -> Half (Bottom) */}
                </svg>

                {/* States */}

                {/* CLOSED (Top) */}
                <motion.div
                    animate={{ scale: state === "CLOSED" ? 1.2 : 1, opacity: state === "CLOSED" ? 1 : 0.5 }}
                    className={`absolute top-[15%] w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center bg-card shadow-xl z-10
                        ${state === "CLOSED" ? "border-green-500 shadow-green-500/20" : "border-slate-300"}
                    `}
                >
                    <CheckCircle className={`w-8 h-8 mb-2 ${state === "CLOSED" ? "text-green-500" : "text-muted-foreground"}`} />
                    <div className="font-bold text-lg">CLOSED</div>
                    <div className="text-xs text-muted-foreground">Operating Normal</div>
                    {state === "CLOSED" && (
                        <div className="mt-2 text-xs font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            Fails: {failures}/{failureThreshold}
                        </div>
                    )}
                </motion.div>

                {/* OPEN (Bottom Left) */}
                <motion.div
                    animate={{ scale: state === "OPEN" ? 1.2 : 1, opacity: state === "OPEN" ? 1 : 0.5 }}
                    className={`absolute bottom-[15%] left-[10%] w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center bg-card shadow-xl z-10
                        ${state === "OPEN" ? "border-red-500 shadow-red-500/20" : "border-slate-300"}
                    `}
                >
                    <XCircle className={`w-8 h-8 mb-2 ${state === "OPEN" ? "text-red-500" : "text-muted-foreground"}`} />
                    <div className="font-bold text-lg">OPEN</div>
                    <div className="text-xs text-muted-foreground">Failing Fast</div>
                    {state === "OPEN" && (
                        <div className="mt-2 text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                            Reset in: {(timerRemaining / 1000).toFixed(1)}s
                        </div>
                    )}
                </motion.div>

                {/* HALF-OPEN (Bottom Right) */}
                <motion.div
                    animate={{ scale: state === "HALF-OPEN" ? 1.2 : 1, opacity: state === "HALF-OPEN" ? 1 : 0.5 }}
                    className={`absolute bottom-[15%] right-[10%] w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center bg-card shadow-xl z-10
                        ${state === "HALF-OPEN" ? "border-amber-500 shadow-amber-500/20" : "border-slate-300"}
                    `}
                >
                    <RotateCw className={`w-8 h-8 mb-2 ${state === "HALF-OPEN" ? "text-amber-500" : "text-muted-foreground"}`} />
                    <div className="font-bold text-lg">HALF-OPEN</div>
                    <div className="text-xs text-muted-foreground">Testing Waters</div>
                    {state === "HALF-OPEN" && (
                        <div className="mt-2 text-xs font-mono bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Success: {successes}/{successThreshold}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    )
}
