'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Fingerprint, Copy, RefreshCw, SortAsc } from 'lucide-react';
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { ulid } from 'ulid';

type IdType = 'uuid-v4' | 'uuid-v7' | 'ulid';

export function UuidUlidGenerator() {
    const [count, setCount] = useState(1);
    const [idType, setIdType] = useState<IdType>('uuid-v4');
    const [generatedIds, setGeneratedIds] = useState<string[]>([]);
    const [hyphens, setHyphens] = useState(true);
    const [uppercase, setUppercase] = useState(false);

    const generate = () => {
        const newIds: string[] = [];
        for (let i = 0; i < count; i++) {
            let id = '';
            if (idType === 'uuid-v4') {
                id = uuidv4();
            } else if (idType === 'uuid-v7') {
                // uuid v7 is supported in newer libs, if not we fallback or mock
                // checked package.json -> uuid ^13.0.0 supports v7
                id = uuidv7();
            } else {
                id = ulid();
            }

            if (!hyphens && idType.startsWith('uuid')) {
                id = id.replace(/-/g, '');
            }
            if (uppercase) {
                id = id.toUpperCase();
            }
            newIds.push(id);
        }
        setGeneratedIds(newIds);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const copyAll = () => {
        navigator.clipboard.writeText(generatedIds.join('\n'));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-purple-600" /> Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Type</Label>
                        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Button
                                variant={idType === 'uuid-v4' ? 'default' : 'ghost'}
                                onClick={() => setIdType('uuid-v4')}
                                className="flex-1"
                            >
                                UUID v4
                            </Button>
                            <Button
                                variant={idType === 'uuid-v7' ? 'default' : 'ghost'}
                                onClick={() => setIdType('uuid-v7')}
                                className="flex-1"
                            >
                                UUID v7
                            </Button>
                            <Button
                                variant={idType === 'ulid' ? 'default' : 'ghost'}
                                onClick={() => setIdType('ulid')}
                                className="flex-1"
                            >
                                ULID
                            </Button>
                        </div>
                        {idType === 'uuid-v7' && <p className="text-xs text-slate-500">v7 is time-sortable.</p>}
                        {idType === 'ulid' && <p className="text-xs text-slate-500">ULID is lexicographically sortable and URL safe.</p>}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Quantity: {count}</Label>
                        </div>
                        <Slider
                            value={[count]}
                            onValueChange={(v) => setCount(v[0])}
                            min={1}
                            max={100}
                            step={1}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="uppercase">Uppercase</Label>
                            <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                        </div>
                        {idType.startsWith('uuid') && (
                            <div className="flex items-center justify-between">
                                <Label htmlFor="hyphens">Hyphens</Label>
                                <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
                            </div>
                        )}
                    </div>

                    <Button onClick={generate} size="lg" className="w-full gap-2">
                        <RefreshCw className="h-4 w-4" /> Generate
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Results</CardTitle>
                    {generatedIds.length > 0 && (
                        <Button variant="outline" size="sm" onClick={copyAll}>Copy All</Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    <div className="space-y-2">
                        {generatedIds.length === 0 ? (
                            <div className="text-center text-slate-400 py-8 italic">
                                Ready to generate...
                            </div>
                        ) : (
                            generatedIds.map((id, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all">{id}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(id)}
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy className="h-3 w-3" />
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
