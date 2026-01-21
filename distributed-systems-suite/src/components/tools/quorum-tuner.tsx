"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function QuorumTuner() {
    const [n, setN] = useState(3); // Nodes
    const [w, setW] = useState(2); // Write Quorum
    const [r, setR] = useState(2); // Read Quorum

    const isStrong = r + w > n;

    // Scenarios
    const scenarios = [
        { name: "Strong Consistency", n: 3, w: 2, r: 2, desc: "Standard Quorum. Survive 1 failure." },
        { name: "Write Availability", n: 3, w: 1, r: 3, desc: "Fast writes, slow reads. Risk of dirty reads if R<3." },
        { name: "Read Availability", n: 3, w: 3, r: 1, desc: "Fast reads. Writes must hit everyone." },
        { name: "Cassandra Default", n: 3, w: 2, r: 1, desc: "Normally W=Quorum, R=1? wait, usually R+W>N. local_quorum vs one." },
    ];

    const applyScenario = (s: any) => {
        setN(s.n);
        setW(s.w);
        setR(s.r);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration (Dynamo Style)</CardTitle>
                        <CardDescription>Configure Replication Factor (N) and Consistency Levels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* N */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                <span>N (Replication Factor)</span>
                                <span>{n} Nodes</span>
                            </label>
                            <Slider min={1} max={9} step={1} value={[n]} onValueChange={v => setN(v[0])} />
                            <p className="text-xs text-muted-foreground">Total copies of data.</p>
                        </div>

                        {/* W */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                <span>W (Write Quorum)</span>
                                <span>{w} Nodes</span>
                            </label>
                            <Slider min={1} max={n} step={1} value={[w]} onValueChange={v => setW(v[0])} />
                            <p className="text-xs text-muted-foreground">Nodes that must confirm a write.</p>
                        </div>

                        {/* R */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                <span>R (Read Quorum)</span>
                                <span>{r} Nodes</span>
                            </label>
                            <Slider min={1} max={n} step={1} value={[r]} onValueChange={v => setR(v[0])} />
                            <p className="text-xs text-muted-foreground">Nodes contacted for a read.</p>
                        </div>

                        {/* Presets */}
                        <div className="pt-4 border-t">
                            <h4 className="text-xs font-semibold uppercase mb-2">Presets</h4>
                            <div className="flex flex-wrap gap-2">
                                {scenarios.map(s => (
                                    <Badge
                                        key={s.name} variant="secondary"
                                        className="cursor-pointer hover:bg-primary/20"
                                        onClick={() => applyScenario(s)}
                                    >
                                        {s.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                {/* Result Card */}
                <Card className={isStrong ? "border-green-500 bg-green-500/5" : "border-amber-500 bg-amber-500/5"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {isStrong ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-amber-600" />}
                            {isStrong ? "Strong Consistency" : "Eventual Consistency (Weak)"}
                        </CardTitle>
                        <CardDescription>
                            Formula: R + W &gt; N
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-6 text-4xl font-mono font-bold">
                            {r} + {w} {isStrong ? ">" : "<="} {n}
                        </div>

                        <div className="text-sm">
                            {isStrong ? (
                                <p className="text-green-700 dark:text-green-400">
                                    You are guaranteed to read the latest write. The Read Set (R) and Write Set (W) must overlap by at least one node.
                                </p>
                            ) : (
                                <p className="text-amber-700 dark:text-amber-400">
                                    There is a risk of reading stale data. It is possible to read from {r} nodes that were NOT part of the latest write quorum of {w}.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Visualization */}
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="text-sm font-medium mb-4 text-center">Quorum Overlap Visualizer</h3>

                        {/* Nodes Row */}
                        <div className="flex justify-center gap-2 mb-2">
                            {Array.from({ length: n }).map((_, i) => (
                                <div key={i} className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500">
                                    N{i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Write Coverage */}
                        <div className="flex justify-center gap-2 mb-1">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(w * 3.5)}rem`, maxWidth: '100%' }}></div>
                        </div>
                        <div className="text-center text-xs text-blue-500 font-bold mb-4">Write Set ({w})</div>

                        {/* Read Coverage (Right aligned to show overlap/gap) */}
                        <div className="flex justify-center gap-2 mb-1">
                            {/* Spacer to push R to right side */}
                            <div style={{ width: `${((n - r) * 3.5)}rem` }}></div>
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(r * 3.5)}rem` }}></div>
                        </div>
                        <div className="text-center text-xs text-green-500 font-bold">Read Set ({r}) (Worst Case)</div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
