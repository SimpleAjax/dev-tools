'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Copy, CheckCircle2 } from 'lucide-react';

export function ElasticQueryBuilder() {
    const [index, setIndex] = useState('logs-*');
    const [field, setField] = useState('status');
    const [value, setValue] = useState('500');
    const [queryType, setQueryType] = useState('term');
    const [size, setSize] = useState(10);
    const [output, setOutput] = useState('');

    useEffect(() => {
        build();
    }, [index, field, value, queryType, size]);

    const build = () => {
        const query: any = {
            query: {},
            size: Number(size),
            // sort usually needed but optional for basic builder
        };

        if (queryType === 'term') {
            query.query.term = { [field]: value };
        } else if (queryType === 'match') {
            query.query.match = { [field]: value };
        } else if (queryType === 'match_phrase') {
            query.query.match_phrase = { [field]: value };
        } else if (queryType === 'wildcard') {
            query.query.wildcard = { [field]: value };
        } else if (queryType === 'range') {
            // simplified range assumption
            query.query.range = {
                [field]: {
                    gte: value
                }
            };
        } else if (queryType === 'bool_must') {
            query.query.bool = {
                must: [
                    { match: { [field]: value } }
                ]
            };
        }

        setOutput(`GET /${index}/_search\n` + JSON.stringify(query, null, 2));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Search className="h-5 w-5 text-blue-500" /> Query Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Index Pattern</Label>
                        <Input value={index} onChange={(e) => setIndex(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Query Type</Label>
                        <Select value={queryType} onValueChange={setQueryType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="term">Term (Exact)</SelectItem>
                                <SelectItem value="match">Match (Full Text)</SelectItem>
                                <SelectItem value="match_phrase">Match Phrase</SelectItem>
                                <SelectItem value="wildcard">Wildcard</SelectItem>
                                <SelectItem value="range">Range (GTE)</SelectItem>
                                <SelectItem value="bool_must">Bool (Must Match)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Field</Label>
                            <Input value={field} onChange={(e) => setField(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Value</Label>
                            <Input value={value} onChange={(e) => setValue(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Size (Limit)</Label>
                        <Input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        JSON Output
                    </CardTitle>
                    <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-7 text-xs gap-2">
                        <Copy className="h-3 w-3" /> Copy
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0 min-h-0">
                    <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950">
                        {output}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
