'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Microscope, Clock, Hash, Server, Copy } from 'lucide-react';
import { ulid } from 'ulid';

export function MongoObjectIdAnalyzer() {
    const [input, setInput] = useState('');
    const [analysis, setAnalysis] = useState<{
        timestamp: string;
        machineId: string;
        processId: string;
        counter: string;
        valid: boolean;
    } | null>(null);

    // Initial Example
    useEffect(() => {
        setInput('507f1f77bcf86cd799439011');
    }, []);

    useEffect(() => {
        analyze(input);
    }, [input]);

    const analyze = (oid: string) => {
        const clean = oid.trim().toLowerCase();

        if (!/^[0-9a-f]{24}$/.test(clean)) {
            setAnalysis(null);
            return;
        }

        try {
            // Extract parts
            const timestampHex = clean.substring(0, 8);
            const timestamp = parseInt(timestampHex, 16) * 1000;

            const machineHex = clean.substring(8, 14); // 3 bytes
            const processHex = clean.substring(14, 18); // 2 bytes
            const counterHex = clean.substring(18, 24); // 3 bytes

            setAnalysis({
                timestamp: new Date(timestamp).toISOString(),
                machineId: machineHex,
                processId: processHex,
                counter: parseInt(counterHex, 16).toString(),
                valid: true
            });
        } catch (e) {
            setAnalysis(null);
        }
    };

    const generateNew = () => {
        // Simple generation of Mongo-like ObjectID for client-side
        // const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
        // ... browsers don't have perfect machine ID context, but we can mock valid structure
        // Actually, just generating a random valid hex 24 chars is often expected, 
        // but let's try to be structurally accurate.

        const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
        const machine = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const process = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
        const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        setInput(timestamp + machine + process + counter);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Microscope className="h-5 w-5 text-green-600" /> ObjectID Input
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter 24-character Hex String</Label>
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="font-mono"
                                placeholder="507f1f77bcf86cd799439011"
                                maxLength={24}
                            />
                            <Button variant="secondary" onClick={generateNew} size="sm">
                                Generate
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!analysis ? (
                        <div className="text-center text-slate-400 py-4">
                            Invalid ObjectID Format
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Timestamp</h4>
                                    <p className="text-lg font-medium">{new Date(analysis.timestamp).toLocaleString()}</p>
                                    <p className="text-xs text-slate-400 font-mono">{analysis.timestamp}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase">
                                        <Server className="h-3 w-3" /> Machine ID
                                    </div>
                                    <p className="font-mono text-base bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                                        {analysis.machineId}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase">
                                        <Hash className="h-3 w-3" /> Process ID
                                    </div>
                                    <p className="font-mono text-base bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                                        {analysis.processId}
                                    </p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase">
                                        <Hash className="h-3 w-3" /> Increment Counter
                                    </div>
                                    <p className="font-mono text-base bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                                        {analysis.counter}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
