'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, WrapText, ArrowRight } from 'lucide-react';

export function SqlInBuilder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [quoteType, setQuoteType] = useState<'single' | 'double' | 'none'>('single');
    const [separator, setSeparator] = useState<'comma' | 'newline'>('comma');
    const [deduplicate, setDeduplicate] = useState(true);

    useEffect(() => {
        build();
    }, [input, quoteType, separator, deduplicate]);

    const build = () => {
        if (!input.trim()) {
            setOutput('');
            return;
        }

        let items = input.split(/[\n,]+/).map(i => i.trim()).filter(i => i !== '');

        if (deduplicate) {
            items = Array.from(new Set(items));
        }

        const quoted = items.map(item => {
            if (quoteType === 'single') return `'${item}'`;
            if (quoteType === 'double') return `"${item}"`;
            return item;
        });

        if (separator === 'comma') {
            setOutput(`(${quoted.join(', ')})`);
        } else {
            // Newline useful for large lists or WHERE x IN (...)
            // Typically SQL needs commas anyway, but formatted with newlines
            setOutput(`(\n  ${quoted.join(',\n  ')}\n)`);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        Input List
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-xs text-slate-500">
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <textarea
                        className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Paste values here:\nID-123\nID-456\nID-789`}
                        spellCheck={false}
                    />
                </CardContent>
            </Card>

            <div className="flex flex-col gap-6 h-full">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <WrapText className="h-5 w-5 text-blue-500" /> Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Quotes</Label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                                <Button variant={quoteType === 'single' ? 'default' : 'ghost'} size="sm" onClick={() => setQuoteType('single')} className="h-7 text-xs">Single '</Button>
                                <Button variant={quoteType === 'double' ? 'default' : 'ghost'} size="sm" onClick={() => setQuoteType('double')} className="h-7 text-xs">Double "</Button>
                                <Button variant={quoteType === 'none' ? 'default' : 'ghost'} size="sm" onClick={() => setQuoteType('none')} className="h-7 text-xs">None</Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Format</Label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                                <Button variant={separator === 'comma' ? 'default' : 'ghost'} size="sm" onClick={() => setSeparator('comma')} className="h-7 text-xs">One Line</Button>
                                <Button variant={separator === 'newline' ? 'default' : 'ghost'} size="sm" onClick={() => setSeparator('newline')} className="h-7 text-xs">Multi-line</Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dedupe">Remove Duplicates</Label>
                            <Switch id="dedupe" checked={deduplicate} onCheckedChange={setDeduplicate} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-0">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <ArrowRight className="h-4 w-4 text-green-500" /> Generated SQL IN
                        </CardTitle>
                        <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={!output} className="h-7 text-xs gap-2">
                            <Copy className="h-3 w-3" /> Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 min-h-0">
                        <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950">
                            {output || '(...)'}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
