"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Skull, Database, Send, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// -- Types --
type NodeState = "Follower" | "Candidate" | "Leader" | "Dead";

interface LogEntry {
    term: number;
    idx: number;
    val: string;
    committed: boolean;
}

interface Node {
    id: number;
    state: NodeState;
    term: number;
    voteFor: number | null;
    log: LogEntry[];
    // Volatile state
    electionTimer: number; // 0..100%
    heartbeatTimer: number;
    votesReceived: number;
}

interface Message {
    id: string;
    from: number;
    to: number;
    type: "RequestVote" | "VoteGranted" | "AppendEntries" | "Heartbeat";
    term: number;
    payload?: any;
    progress: number; // 0..100% (Position on wire)
}

const TOTAL_NODES = 5;
const MAJORITY = 3;

export default function RaftSimulator() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [logs, setLogs] = useState<string[]>([]); // Central "Client" intent logs

    // -- Initialization --
    useEffect(() => {
        const initialNodes: Node[] = Array.from({ length: TOTAL_NODES }).map((_, i) => ({
            id: i,
            state: "Follower",
            term: 0,
            voteFor: null,
            log: [],
            electionTimer: Math.random() * 50, // Staggered start
            heartbeatTimer: 0,
            votesReceived: 0,
        }));
        setNodes(initialNodes);
    }, []);

    // -- Simulation Loop --
    useEffect(() => {
        if (paused) return;

        const tickRate = 50; // ms
        const timer = setInterval(() => {
            setNodes((currentNodes) => {
                let newNodes = [...currentNodes];
                let newMessages: Message[] = []; // Collect messages to send

                // 1. Process Node State Machines
                newNodes = newNodes.map((node) => {
                    if (node.state === "Dead") return node;

                    let updatedNode = { ...node };

                    // -- FOLLOWER --
                    if (updatedNode.state === "Follower") {
                        // Count up election timer
                        updatedNode.electionTimer += (1 + Math.random()) * speed; // Random jitter
                        if (updatedNode.electionTimer >= 100) {
                            // Timeout! Become Candidate
                            updatedNode.state = "Candidate";
                            updatedNode.term += 1;
                            updatedNode.voteFor = updatedNode.id;
                            updatedNode.votesReceived = 1; // Vote for self
                            updatedNode.electionTimer = 0;

                            // Broadcast RequestVote
                            currentNodes.forEach(peer => {
                                if (peer.id !== updatedNode.id && peer.state !== "Dead") {
                                    newMessages.push({
                                        id: Math.random().toString(36),
                                        from: updatedNode.id,
                                        to: peer.id,
                                        type: "RequestVote",
                                        term: updatedNode.term,
                                        progress: 0
                                    });
                                }
                            });
                        }
                    }

                    // -- CANDIDATE --
                    else if (updatedNode.state === "Candidate") {
                        updatedNode.electionTimer += (1 + Math.random()) * speed;
                        if (updatedNode.electionTimer >= 100) {
                            // Timeout again! Restart election
                            updatedNode.term += 1;
                            updatedNode.electionTimer = 0;
                            updatedNode.votesReceived = 1;
                            // Resend votes
                            currentNodes.forEach(peer => {
                                if (peer.id !== updatedNode.id && peer.state !== "Dead") {
                                    newMessages.push({
                                        id: Math.random().toString(36),
                                        from: updatedNode.id,
                                        to: peer.id,
                                        type: "RequestVote",
                                        term: updatedNode.term,
                                        progress: 0
                                    });
                                }
                            });
                        }
                    }

                    // -- LEADER --
                    else if (updatedNode.state === "Leader") {
                        updatedNode.heartbeatTimer += speed * 2;
                        if (updatedNode.heartbeatTimer >= 30) { // Send heartbeat every 30 ticks
                            updatedNode.heartbeatTimer = 0;
                            currentNodes.forEach(peer => {
                                if (peer.id !== updatedNode.id && peer.state !== "Dead") {
                                    newMessages.push({
                                        id: Math.random().toString(36),
                                        from: updatedNode.id,
                                        to: peer.id,
                                        type: "Heartbeat", // Should be AppendEntries empty
                                        term: updatedNode.term,
                                        progress: 0
                                    });
                                }
                            });
                        }
                    }

                    return updatedNode;
                });

                // 2. Queue messages
                if (newMessages.length > 0) {
                    setMessages(prev => [...prev, ...newMessages]);
                }

                return newNodes;
            });

            // 3. Process Messages (Movement & Delivery)
            setMessages(prev => {
                let activeMessages = [...prev];
                let deliveredMessages: Message[] = [];

                // Move messages
                activeMessages = activeMessages.map(m => ({ ...m, progress: m.progress + (2 * speed) })).filter(m => {
                    if (m.progress >= 100) {
                        deliveredMessages.push(m);
                        return false; // Remove from active
                    }
                    return true;
                });

                // Handle Delivery
                if (deliveredMessages.length > 0) {
                    setNodes(curNodes => {
                        let nextNodes = [...curNodes];
                        deliveredMessages.forEach(msg => {
                            const targetIdx = nextNodes.findIndex(n => n.id === msg.to);
                            if (targetIdx === -1) return;
                            let target = { ...nextNodes[targetIdx] };

                            if (target.state === "Dead") return;

                            // Standard Term Check logic
                            if (msg.term > target.term) {
                                target.term = msg.term;
                                target.state = "Follower";
                                target.voteFor = null;
                                target.electionTimer = 0; // Reset timer on seeing higher term
                            }

                            // Handle Message Types
                            if (msg.type === "RequestVote") {
                                if (target.voteFor === null || target.voteFor === msg.from) {
                                    target.voteFor = msg.from;
                                    target.electionTimer = 0; // Reset election timer
                                    // Grant Vote
                                    setMessages(p => [...p, {
                                        id: Math.random().toString(),
                                        from: target.id,
                                        to: msg.from,
                                        type: "VoteGranted",
                                        term: target.term,
                                        progress: 0
                                    }]);
                                }
                            } else if (msg.type === "VoteGranted") {
                                if (target.state === "Candidate" && msg.term === target.term) {
                                    target.votesReceived += 1;
                                    if (target.votesReceived >= MAJORITY) {
                                        target.state = "Leader";
                                        target.heartbeatTimer = 100; // Trigger Imeddiate heartbeat
                                        // Initialize nextIndex/matchIndex tracking here in real impl
                                    }
                                }
                            } else if (msg.type === "Heartbeat" || msg.type === "AppendEntries") {
                                if (msg.term >= target.term) {
                                    target.state = "Follower";
                                    target.electionTimer = 0; // Reset timer
                                    target.voteFor = null; // Leader is valid
                                }
                            }

                            nextNodes[targetIdx] = target;
                        });
                        return nextNodes;
                    });
                }

                return activeMessages;
            });

        }, tickRate);

        return () => clearInterval(timer);
    }, [paused, speed]);

    // -- Interaction Handlers --
    const killNode = (id: number) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, state: n.state === "Dead" ? "Follower" : "Dead", electionTimer: 0 } : n));
    };

    const requestLog = () => {
        // Find leader
        const leader = nodes.find(n => n.state === "Leader");
        if (!leader) {
            alert("No leader elected yet!");
            return;
        }
        // In a full sim, we'd add entry to Leader's log and visualize replication
        // For MVP, just flash the Leader
        alert(`Client Request sent to Leader Node ${leader.id} (Full replication visual WIP)`);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
            {/* Controls */}
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant={paused ? "default" : "secondary"}
                        onClick={() => setPaused(!paused)}
                    >
                        {paused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                        {paused ? "Resume" : "Pause"}
                    </Button>
                    <div className="flex items-center gap-2 w-48">
                        <span className="text-sm font-medium">Speed</span>
                        <Slider value={[speed]} min={0.1} max={5} step={0.1} onValueChange={v => setSpeed(v[0])} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={requestLog} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Send Client Request
                    </Button>
                </div>
            </div>

            {/* Visualization Canvas */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border relative overflow-hidden">

                {/* Messages on the wire (Absolute Overlay) */}
                {messages.map(msg => {
                    // Calculate positions
                    // Assuming pentagon layout
                    const getPos = (id: number) => {
                        const angle = (id * 2 * Math.PI / TOTAL_NODES) - Math.PI / 2;
                        // Center is 50%, 50%. Radius 35%
                        return {
                            x: 50 + 35 * Math.cos(angle),
                            y: 50 + 35 * Math.sin(angle)
                        };
                    };
                    const start = getPos(msg.from);
                    const end = getPos(msg.to);

                    const currentX = start.x + (end.x - start.x) * (msg.progress / 100);
                    const currentY = start.y + (end.y - start.y) * (msg.progress / 100);

                    return (
                        <div
                            key={msg.id}
                            className={`absolute w-3 h-3 rounded-full shadow-sm z-20 border border-white
                            ${msg.type === "RequestVote" ? "bg-amber-500" : ""}
                            ${msg.type === "VoteGranted" ? "bg-green-500" : ""}
                            ${msg.type === "Heartbeat" ? "bg-blue-400" : ""}
                        `}
                            style={{ left: `${currentX}%`, top: `${currentY}%`, transform: "translate(-50%, -50%)" }}
                            title={msg.type}
                        />
                    )
                })}

                {/* Nodes (Pentagon Layout) */}
                <div className="absolute inset-0">
                    {nodes.map((node, i) => {
                        const angle = (i * 2 * Math.PI / TOTAL_NODES) - Math.PI / 2;
                        const x = 50 + 35 * Math.cos(angle);
                        const y = 50 + 35 * Math.sin(angle);

                        return (
                            <div
                                key={node.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                <div className={`relative w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center bg-card shadow-xl transition-all duration-300
                                 ${node.state === "Leader" ? "border-yellow-500 ring-4 ring-yellow-500/20" : "border-slate-200 dark:border-slate-700"}
                                 ${node.state === "Candidate" ? "border-amber-500" : ""}
                                 ${node.state === "Dead" ? "opacity-50 grayscale border-slate-800 bg-slate-900" : ""}
                             `}>
                                    {/* State Badge */}
                                    <div className="absolute -top-3">
                                        {node.state === "Leader" && <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black"><Crown className="w-3 h-3 mr-1" /> LEADER</Badge>}
                                        {node.state === "Candidate" && <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">CANDIDATE</Badge>}
                                        {node.state === "Follower" && <Badge variant="outline" className="bg-background text-xs">FOLLOWER</Badge>}
                                        {node.state === "Dead" && <Badge variant="destructive">OFFLINE</Badge>}
                                    </div>

                                    {/* Node ID */}
                                    <h3 className="text-2xl font-bold font-mono">N{node.id}</h3>
                                    <div className="text-xs text-muted-foreground mt-1">Term: {node.term}</div>

                                    {/* Timer Bar */}
                                    {node.state !== "Dead" && node.state !== "Leader" && (
                                        <div className="absolute bottom-6 w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-400"
                                                style={{ width: `${node.electionTimer}%` }}
                                            />
                                        </div>
                                    )}

                                    {/* Controls (Hover) */}
                                    <div className="absolute -bottom-10 opacity-0 hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant={node.state === "Dead" ? "secondary" : "destructive"}
                                            className="h-6 text-[10px]"
                                            onClick={() => killNode(node.id)}
                                        >
                                            {node.state === "Dead" ? "Revive" : "Kill"}
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-card/80 p-4 rounded-lg border backdrop-blur-sm text-xs space-y-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /> RequestVote</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> VoteGranted</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400" /> Heartbeat</div>
                    <div className="mt-2 text-muted-foreground">Term increments on election timeout. Node votes for first RequestVote seen in term. Majority ({MAJORITY}) wins.</div>
                </div>

            </div>
        </div>
    );
}
