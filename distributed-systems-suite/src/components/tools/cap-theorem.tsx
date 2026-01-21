"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CapTheorem() {
    const [selection, setSelection] = useState<"CP" | "AP" | "CA">("CP");

    // Data
    const info = {
        "CP": {
            title: "Consistency + Partition Tolerance (CP)",
            desc: "When a partition occurs, the system stops accepting writes to preserve consistency.",
            examples: "HBase, MongoDB, Redis (Default), CockroachDB",
            tradeoff: "Sacrifice: Availability. (System goes down or returns errors during network failures)"
        },
        "AP": {
            title: "Availability + Partition Tolerance (AP)",
            desc: "When a partition occurs, the system keeps accepting writes, but they may be inconsistent (stale).",
            examples: "Cassandra, DynamoDB, CouchDB, Riak",
            tradeoff: "Sacrifice: Consistency. (You might read old data)"
        },
        "CA": {
            title: "Consistency + Availability (CA)",
            desc: "The system is always up and always consistent. Theoretically possible only if network partitions NEVER happen.",
            examples: "Traditional RDBMS (Postgres, MySQL) in a single node.",
            tradeoff: "Sacrifice: Partition Tolerance. (If the network cuts, the system fails completely or splits brain)"
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto h-[calc(100vh-140px)] items-center">
            {/* Interactive Triangle */}
            <div className="relative aspect-square max-h-[500px] flex items-center justify-center">

                {/* Vertices */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-xl z-20">C</div>
                    <div className="font-bold mt-2">Consistency</div>
                </div>
                <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-center">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-xl z-20">A</div>
                    <div className="font-bold mt-2">Availability</div>
                </div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-center">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-xl z-20">P</div>
                    <div className="font-bold mt-2">Partition Tol.</div>
                </div>

                {/* Edges (Clickable Areas) */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                    {/* CA Edge (Left) */}
                    <motion.line
                        x1="50" y1="5" x2="5" y2="95"
                        strokeWidth="8"
                        stroke={selection === "CA" ? "#ef4444" : "#cbd5e1"}
                        className="cursor-pointer hover:stroke-slate-400 transition-colors"
                        onClick={() => setSelection("CA")}
                    />
                    {/* CP Edge (Right) */}
                    <motion.line
                        x1="50" y1="5" x2="95" y2="95"
                        strokeWidth="8"
                        stroke={selection === "CP" ? "#3b82f6" : "#cbd5e1"}
                        className="cursor-pointer hover:stroke-slate-400 transition-colors"
                        onClick={() => setSelection("CP")}
                    />
                    {/* AP Edge (Bottom) */}
                    <motion.line
                        x1="5" y1="95" x2="95" y2="95"
                        strokeWidth="8"
                        stroke={selection === "AP" ? "#10b981" : "#cbd5e1"}
                        className="cursor-pointer hover:stroke-slate-400 transition-colors"
                        onClick={() => setSelection("AP")}
                    />
                </svg>

                {/* Center Selector Dot */}
                <motion.div
                    layout
                    className="absolute w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-xl pointer-events-none z-30"
                    initial={{ top: "50%", left: "50%" }}
                    animate={{
                        top: selection === "CA" ? "50%" : selection === "CP" ? "50%" : "95%",
                        left: selection === "CA" ? "25%" : selection === "CP" ? "75%" : "50%",
                    }}
                />

            </div>

            {/* Info Card */}
            <div className="space-y-6">
                <Card className={`border-l-4 shadow-lg transition-all duration-300 ${selection === "AP" ? "border-l-emerald-500" :
                        selection === "CP" ? "border-l-blue-500" : "border-l-red-500"
                    }`}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="text-sm font-bold opacity-50 uppercase tracking-widest">Selected Strategy</div>
                        <h2 className="text-4xl font-extrabold">{selection}</h2>
                        <h3 className="text-xl font-medium">{info[selection].title}</h3>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {info[selection].desc}
                        </p>

                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                            <span className="font-bold">Trade-off: </span>
                            {info[selection].tradeoff}
                        </div>

                        <div>
                            <span className="font-bold text-sm uppercase text-muted-foreground">Common Examples</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {info[selection].examples.split(", ").map(ex => (
                                    <div key={ex} className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                                        {ex}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-xs text-muted-foreground text-center">
                    * The CAP Theorem states that a distributed system can only provide two of these three guarantees simultaneously.
                </div>
            </div>
        </div>
    );
}
