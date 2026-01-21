"use client";

import { useState, useEffect } from "react";
import cronstrue from "cronstrue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CronGenerator() {
    const [cron, setCron] = useState("*/5 * * * *");
    const [desc, setDesc] = useState("");
    const [error, setError] = useState("");

    // Quick Presets
    const presets = [
        { label: "Every Minute", val: "* * * * *" },
        { label: "Every 5 Minutes", val: "*/5 * * * *" },
        { label: "Every Hour", val: "0 * * * *" },
        { label: "Daily at Midnight", val: "0 0 * * *" },
        { label: "Weekly (Sunday)", val: "0 0 * * 0" },
        { label: "Monthly (1st)", val: "0 0 1 * *" },
    ];

    useEffect(() => {
        try {
            const str = cronstrue.toString(cron);
            setDesc(str);
            setError("");
        } catch (e) {
            setDesc("");
            setError((e as Error).toString());
        }
    }, [cron]);

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <Card className="bg-slate-900 border-none text-white shadow-xl">
                <CardContent className="p-8 text-center space-y-4">
                    <Input
                        value={cron}
                        onChange={(e) => setCron(e.target.value)}
                        className="text-4xl font-mono text-center h-auto py-4 bg-transparent border-white/20 text-white focus-visible:ring-offset-0 focus-visible:ring-white/30 placeholder:text-white/20"
                        placeholder="* * * * *"
                    />

                    <div className="h-8">
                        {desc ? (
                            <div className="text-xl font-medium text-blue-300 animate-in fade-in slide-in-from-bottom-2">
                                "{desc}"
                            </div>
                        ) : error ? (
                            <div className="text-red-400 font-medium">
                                Invalid Cron Expression
                            </div>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Presets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            {presets.map(p => (
                                <button
                                    key={p.val}
                                    onClick={() => setCron(p.val)}
                                    className={
                                        `text-left px-4 py-2 rounded-md text-sm font-medium transition-colors border
                                    ${cron === p.val
                                            ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                                            : "hover:bg-slate-50 border-transparent text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400"}`
                                    }
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-2 text-center font-mono text-sm">
                            {cron.split(" ").map((part, i) => (
                                <div key={i} className="flex flex-col gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded border">
                                    <span className="font-bold text-lg">{part}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                                        {["Min", "Hour", "Day", "Month", "Week"][i] || "?"}
                                    </span>
                                </div>
                            ))}
                            {cron.split(" ").length < 5 && (
                                <div className="col-span-full text-xs text-red-500 py-2">
                                    Too few fields (Requires 5)
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                            <p>
                                * = Any value<br />
                                , = Value list separator<br />
                                - = Range of values<br />
                                / = Step values
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
