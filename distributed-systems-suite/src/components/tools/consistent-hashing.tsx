"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// -- Utilities --
// Simple hash function (CRC32-ish or simply string sum for visualization stability)
const simpleHash = (str: string) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 360; // Map to 360 degrees
};

interface Node {
    id: string;
    name: string;
    angle: number;
    color: string;
}

interface Item {
    id: string;
    name: string;
    angle: number;
}

const COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#84cc16", // lime
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#f43f5e", // rose
];

export default function ConsistentHashing() {
    const [nodes, setNodes] = useState<Node[]>([
        { id: "n1", name: "Node A", angle: 0, color: COLORS[0] },
        { id: "n2", name: "Node B", angle: 120, color: COLORS[6] },
        { id: "n3", name: "Node C", angle: 240, color: COLORS[4] },
    ]);
    const [items, setItems] = useState<Item[]>([]);
    const [newNodeName, setNewNodeName] = useState("");
    const [newItemName, setNewItemName] = useState("");

    // Sort nodes by angle for correct range calculation
    const sortedNodes = useMemo(() => {
        return [...nodes].sort((a, b) => a.angle - b.angle);
    }, [nodes]);

    // Determine which node owns which item
    const getItemOwner = (itemAngle: number) => {
        if (sortedNodes.length === 0) return null;
        // Find first node with angle >= itemAngle
        const owner = sortedNodes.find((node) => node.angle >= itemAngle);
        // If not found (wrap around), it's the first node
        return owner || sortedNodes[0];
    };

    const addItem = () => {
        if (!newItemName) return;
        const angle = simpleHash(newItemName);
        setItems((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), name: newItemName, angle }]);
        setNewItemName("");
    };

    const addNode = () => {
        const name = newNodeName || `Node ${String.fromCharCode(65 + nodes.length)}`;
        const angle = Math.floor(Math.random() * 360);
        const color = COLORS[nodes.length % COLORS.length];
        setNodes((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), name, angle, color }]);
        setNewNodeName("");
    };

    const removeNode = (id: string) => {
        setNodes((prev) => prev.filter((n) => n.id !== id));
    };

    const clearItems = () => setItems([]);

    // Generate some random initial items
    useEffect(() => {
        if (items.length === 0) {
            const initials = ["User-1", "User-2", "Order-123", "Payment-99", "Auth-Token"];
            setItems(
                initials.map((name) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    angle: simpleHash(name),
                }))
            );
        }
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* LEFT: Controls */}
            <Card className="lg:col-span-1 border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle>Topology Controls</CardTitle>
                    <CardDescription>Add Nodes (Servers) and Items (Keys) to the ring.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Add Node</h3>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Node Name (Random)"
                                value={newNodeName}
                                onChange={(e) => setNewNodeName(e.target.value)}
                            />
                            <Button onClick={addNode} variant="secondary">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {nodes.map((node) => (
                                <Badge
                                    key={node.id}
                                    style={{ backgroundColor: node.color, color: "#fff" }}
                                    className="cursor-pointer hover:opacity-80 flex items-center gap-1"
                                    onClick={() => removeNode(node.id)}
                                >
                                    {node.name}
                                    <Trash className="h-3 w-3 ml-1" />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Add Key/Item</h3>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Key (e.g., UserID)"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addItem()}
                            />
                            <Button onClick={addItem}>Add</Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={clearItems}>Clear Keys</Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                const initials = Array.from({ length: 5 }, (_, i) => `Key-${Math.floor(Math.random() * 1000)}`);
                                setItems(prev => [...prev, ...initials.map(name => ({
                                    id: Math.random().toString(36).substr(2, 9),
                                    name,
                                    angle: simpleHash(name),
                                }))]);
                            }}>
                                <RefreshCw className="mr-2 h-3 w-3" />
                                Random Scramble
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                        <strong>How it works:</strong>
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                            <li>Both <strong>Nodes</strong> and <strong>Keys</strong> are mapped to an angle (0-360°) on the ring.</li>
                            <li>A Key belongs to the <strong>first Node</strong> encountered moving clockwise.</li>
                            <li>When a Node is added/removed, only Keys in its immediate vicinity are remapped (unlike Modulo Hashing where everything moves).</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* RIGHT: Visualization */}
            <Card className="lg:col-span-2 h-full flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-[500px] aspect-square">
                        {/* The Ring */}
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Background Circle */}
                            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20" />

                            {/* Node Sectors (Arcs) */}
                            {sortedNodes.map((node, i) => {
                                const nextNode = sortedNodes[(i + 1) % sortedNodes.length];
                                let startAngle = node.angle;
                                let endAngle = nextNode ? nextNode.angle : 360 + sortedNodes[0].angle;

                                // If this is the last node wrapping around
                                if (endAngle < startAngle) endAngle += 360;

                                // We actually want the arc *leading up* to the node to represent its territory? 
                                // Wait, standard Consistent Hashing: Key goes clockwise to NEXT node.
                                // So the "Territory" of Node A (at 100) is actually (PrevNode..100].
                                // Let's visualize the "ownership zone" of this node.
                                // The ownership zone ends at node.angle. It starts at prevNode.angle.

                                const prevNode = sortedNodes[(i - 1 + sortedNodes.length) % sortedNodes.length];
                                let zoneStart = prevNode.angle;
                                let zoneEnd = node.angle;

                                if (zoneStart > zoneEnd) {
                                    // wrap around case: e.g. prev=300, curr=50. Zone is 300..360 + 0..50
                                    // SVG arcs are tricky with wrap around, better to draw lines or just colored segments?
                                    // Let's keep it simple: Just draw the Node dots and connect them.
                                }

                                return null; // Skip complex arc drawing for now to avoid SVG math errors, rely on dots
                            })}

                            {/* Connection Lines (Chord Ring) */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/10" />

                        </svg>

                        {/* Render Nodes and Items as absolute positioned divs for easy animation/tooltips */}
                        <div className="absolute inset-0">
                            <AnimatePresence>
                                {sortedNodes.map((node) => {
                                    const rad = (node.angle - 90) * (Math.PI / 180);
                                    const x = 50 + 40 * Math.cos(rad); // 40% radius
                                    const y = 50 + 40 * Math.sin(rad);

                                    return (
                                        <motion.div
                                            key={node.id}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center z-10"
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                backgroundColor: node.color
                                            }}
                                        >
                                            <div className="absolute -top-6 whitespace-nowrap text-xs font-bold bg-background/80 px-1 rounded shadow-sm">{node.name}</div>
                                        </motion.div>
                                    );
                                })}

                                {items.map((item) => {
                                    const owner = getItemOwner(item.angle);
                                    const rad = (item.angle - 90) * (Math.PI / 180);
                                    const x = 50 + 40 * Math.cos(rad);
                                    const y = 50 + 40 * Math.sin(rad);

                                    // Calculate distance to owner for a connecting line? 
                                    // Visual clutter. Just color code the item same as owner.

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full border border-white/50 shadow-sm z-20 transition-colors duration-500"
                                            style={{
                                                left: `${x}%`, // using % for responsive positioning
                                                top: `${y}%`,
                                                backgroundColor: owner ? owner.color : "#888"
                                            }}
                                        >
                                            <div className="opacity-0 hover:opacity-100 absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-black text-white px-1 rounded pointer-events-none">
                                                {item.name} ({item.angle}°)
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Center Info */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center opacity-20">
                                <Layers className="h-16 w-16 mx-auto mb-2" />
                                <div className="text-sm font-mono">HASH RING</div>
                            </div>
                        </div>

                    </div>
                </div>
            </Card>

            {/* Distribution Stats */}
            <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Distribution Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedNodes.map(node => {
                            const count = items.filter(i => getItemOwner(i.angle)?.id === node.id).length;
                            const percentage = items.length ? Math.round((count / items.length) * 100) : 0;
                            return (
                                <div key={node.id} className="flex items-center gap-4">
                                    <div className="w-24 text-sm font-medium truncate" style={{ color: node.color }}>{node.name}</div>
                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full"
                                            style={{ backgroundColor: node.color }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <div className="w-12 text-right text-xs text-muted-foreground">{count} ({percentage}%)</div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
