'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format as formatSql, SqlLanguage } from 'sql-formatter';
import { Copy, Code, Sparkles, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export function SqlFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState<SqlLanguage>('postgresql');
    const [tabWidth, setTabWidth] = useState(2);
    const [useTabs, setUseTabs] = useState(false);
    const [keywordCase, setKeywordCase] = useState<'preserve' | 'upper' | 'lower'>('upper');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!input.trim()) {
            setOutput('');
            setError(null);
            return;
        }

        try {
            const formatted = formatSql(input, {
                language: language,
                tabWidth: tabWidth,
                useTabs: useTabs,
                keywordCase: keywordCase,

            });
            setOutput(formatted);
            setError(null);
        } catch (e) {
            // SQL formatting errors are usually tolerant, but if it fails completely
            setError((e as Error).message);
        }
    }, [input, language, tabWidth, useTabs, keywordCase]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            {/* Left Output (Config + Source) */}
            <div className="flex flex-col h-full gap-4">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardContent className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase">Dialect</Label>
                            <Select value={language} onValueChange={(v) => setLanguage(v as SqlLanguage)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select dialect" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                    <SelectItem value="mysql">MySQL</SelectItem>
                                    <SelectItem value="sql">Standard SQL</SelectItem>
                                    <SelectItem value="sqlite">SQLite</SelectItem>
                                    <SelectItem value="snowflake">Snowflake</SelectItem>
                                    <SelectItem value="redshift">Redshift</SelectItem>
                                    <SelectItem value="bigquery">BigQuery</SelectItem>
                                    <SelectItem value="transactsql">T-SQL (SQL Server)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase">Keywords</Label>
                            <Select value={keywordCase} onValueChange={(v) => setKeywordCase(v as any)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upper">UPPERCASE</SelectItem>
                                    <SelectItem value="lower">lowercase</SelectItem>
                                    <SelectItem value="preserve">Preserve</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase">Indent Size: {tabWidth}</Label>
                            <Slider
                                value={[tabWidth]}
                                onValueChange={(v) => setTabWidth(v[0])}
                                min={2}
                                max={8}
                                step={2}
                                className="py-2"
                            />
                        </div>
                        <div className="flex items-center space-x-2 pb-2">
                            <Switch id="use-tabs" checked={useTabs} onCheckedChange={setUseTabs} />
                            <Label htmlFor="use-tabs" className="text-xs font-semibold uppercase">Use Tabs</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Code className="h-4 w-4 text-slate-500" /> Input Query
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-xs text-slate-500 hover:text-red-500">
                            <Trash2 className="h-3 w-3 mr-1" /> Clear
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <textarea
                            className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                            placeholder={"SELECT * FROM users WHERE id = 1"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            spellCheck={false}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Right Output */}
            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-blue-50/10 dark:bg-blue-900/10">
                    <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-600 dark:text-blue-400">
                        <Sparkles className="h-4 w-4" /> Formatted SQL
                    </CardTitle>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!output}
                        className="h-7 text-xs gap-2"
                    >
                        <Copy className="h-3 w-3" />
                        Copy
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0 bg-white dark:bg-slate-950">
                    <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-slate-700 dark:text-slate-300">
                        {output || <span className="text-slate-400 select-none">// Formatted result will appear here...</span>}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
