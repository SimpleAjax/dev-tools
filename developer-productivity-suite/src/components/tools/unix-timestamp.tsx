"use client";

import { useState, useEffect } from "react";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pause, Play, RefreshCw } from "lucide-react";

export function UnixTimestamp() {
    const [now, setNow] = useState(Date.now());
    const [isPaused, setIsPaused] = useState(false);
    const [inputTimestamp, setInputTimestamp] = useState("");
    const [inputDate, setInputDate] = useState("");

    // Update current time every second
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [isPaused]);

    // Handle Timestamp -> Date conversion
    const handleTimestampChange = (val: string) => {
        setInputTimestamp(val);
        if (!val) {
            setInputDate("");
            return;
        }

        // Auto-detect milliseconds (13 digits) vs seconds (10 digits)
        let ts = parseInt(val);
        if (isNaN(ts)) return;

        // If it looks like seconds (e.g. 1700000000), treat as seconds
        if (val.length <= 10) {
            // date-fns fromUnixTime expects seconds
        } else {
            // If milliseconds, convert to seconds for fromUnixTime, 
            // OR just use new Date(ts) generic js
            ts = Math.floor(ts / 1000);
        }

        try {
            const date = fromUnixTime(ts);
            setInputDate(date.toISOString().slice(0, 16)); // Format for datetime-local
        } catch {
            // Invalid
        }
    };

    // Handle Date -> Timestamp conversion
    const handleDateChange = (val: string) => {
        setInputDate(val);
        if (!val) {
            setInputTimestamp("");
            return;
        }
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
            setInputTimestamp(getUnixTime(date).toString());
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Hero: Current Time */}
            <Card className="bg-slate-900 text-white border-none shadow-lg">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
                    <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">
                        Current Unix Epoch
                    </div>
                    <div className="text-6xl md:text-8xl font-mono font-bold tabular-nums tracking-tight text-blue-400">
                        {Math.floor(now / 1000)}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
                            onClick={() => setIsPaused(!isPaused)}
                        >
                            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                            {isPaused ? "Resume" : "Pause"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
                            onClick={() => {
                                setNow(Date.now());
                                setInputTimestamp(Math.floor(Date.now() / 1000).toString());
                                handleTimestampChange(Math.floor(Date.now() / 1000).toString());
                            }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Use Current
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Converter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Converter</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Unix Timestamp (Seconds)</Label>
                            <Input
                                value={inputTimestamp}
                                onChange={(e) => handleTimestampChange(e.target.value)}
                                placeholder="e.g. 1672531200"
                                className="font-mono"
                            />
                            <div className="text-xs text-slate-500">
                                Supports seconds (10 digits).
                            </div>
                        </div>

                        <div className="flex justify-center text-slate-300">
                            ↕
                        </div>

                        <div className="space-y-2">
                            <Label>Human Date (Local)</Label>
                            <Input
                                type="datetime-local"
                                value={inputDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Info/Format Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Common Formats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-slate-500">ISO 8601</div>
                            <div className="font-mono text-right">{new Date(now).toISOString()}</div>

                            <div className="text-slate-500">RFC 2822</div>
                            <div className="font-mono text-right truncate">{new Date(now).toUTCString()}</div>

                            <div className="text-slate-500">Local String</div>
                            <div className="font-mono text-right">{new Date(now).toLocaleString()}</div>

                            <div className="text-slate-500">Day of Year</div>
                            <div className="font-mono text-right">{format(now, 'DDD')}</div>

                            <div className="text-slate-500">Week of Year</div>
                            <div className="font-mono text-right">{format(now, 'w')}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
