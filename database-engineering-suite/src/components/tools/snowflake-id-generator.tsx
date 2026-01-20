'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Fingerprint, Copy, RefreshCw } from 'lucide-react';

export function SnowflakeIdGenerator() {
    const [workerId, setWorkerId] = useState(1);
    const [datacenterId, setDatacenterId] = useState(1);
    const [epoch, setEpoch] = useState(1288834974657); // Twitter Snowflake Epoch
    const [ids, setIds] = useState<string[]>([]);

    const generate = () => {
        // Simple Snowflake implementation
        // 1 bit sign | 41 bits timestamp | 5 bits datacenter | 5 bits worker | 12 bits sequence
        // Note: JS parsing big integers needs BigInt

        const timestamp = BigInt(Date.now() - epoch);
        const datacenter = BigInt(datacenterId);
        const worker = BigInt(workerId);

        // Mock sequence for UI tool (random 0-4095)
        const sequence = BigInt(Math.floor(Math.random() * 4096));

        const id = (timestamp << 22n) | (datacenter << 17n) | (worker << 12n) | sequence;

        setIds(prev => [id.toString(), ...prev].slice(0, 10)); // Keep last 10
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-blue-500" /> Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Worker ID (0-31)</Label>
                            <span className="text-sm text-slate-500 font-mono">{workerId}</span>
                        </div>
                        <Slider
                            value={[workerId]}
                            onValueChange={(v) => setWorkerId(v[0])}
                            max={31}
                            step={1}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Datacenter ID (0-31)</Label>
                            <span className="text-sm text-slate-500 font-mono">{datacenterId}</span>
                        </div>
                        <Slider
                            value={[datacenterId]}
                            onValueChange={(v) => setDatacenterId(v[0])}
                            max={31}
                            step={1}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Custom Epoch (Optional)</Label>
                        <Input
                            type="number"
                            value={epoch}
                            onChange={(e) => setEpoch(Number(e.target.value))}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-slate-500">Default: Twitter Epoch (1288834974657)</p>
                    </div>

                    <Button onClick={generate} size="lg" className="w-full gap-2">
                        <RefreshCw className="h-4 w-4" /> Generate ID
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Generated IDs</CardTitle>
                    <CardDescription>Most recent generated IDs appear top.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {ids.length === 0 ? (
                            <div className="text-center text-slate-400 py-8 italic">
                                Click Generate to create Snowflake IDs
                            </div>
                        ) : (
                            ids.map((id, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="font-mono text-lg text-slate-700 dark:text-slate-200 font-semibold">{id}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(id)}
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
