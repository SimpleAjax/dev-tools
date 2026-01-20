'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileJson, Copy, ArrowRightLeft, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import toml from '@iarna/toml';

export function TomlJsonConverter() {
    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [mode, setMode] = useState<'toml-to-json' | 'json-to-toml'>('toml-to-json');
    const [error, setError] = useState<string | null>(null);

    // Initial Example
    useEffect(() => {
        setLeftInput(`# This is a TOML document

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00

[database]
server = "192.168.1.1"
ports = [ 8000, 8001, 8002 ]
connection_max = 5000
enabled = true`);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            convert();
        }, 500);
        return () => clearTimeout(timer);
    }, [leftInput, mode]);

    const convert = () => {
        if (!leftInput.trim()) {
            setRightInput('');
            setError(null);
            return;
        }

        try {
            if (mode === 'toml-to-json') {
                const obj = toml.parse(leftInput);
                setRightInput(JSON.stringify(obj, null, 2));
            } else {
                const obj = JSON.parse(leftInput);
                const tomlStr = toml.stringify(obj);
                setRightInput(tomlStr);
            }
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const toggleMode = () => {
        setLeftInput(rightInput);
        setRightInput(leftInput);
        setMode(mode === 'toml-to-json' ? 'json-to-toml' : 'toml-to-json');
        setError(null);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(rightInput);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
            <div className="flex justify-center items-center">
                <Button variant="outline" onClick={toggleMode} className="gap-2 min-w-[200px]">
                    <ArrowRightLeft className="h-4 w-4" />
                    Switch to {mode === 'toml-to-json' ? 'JSON → TOML' : 'TOML → JSON'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm min-h-0">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            {mode === 'toml-to-json' ? <FileText className="h-4 w-4 text-orange-500" /> : <FileJson className="h-4 w-4 text-blue-500" />}
                            {mode === 'toml-to-json' ? 'TOML Input' : 'JSON Input'}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setLeftInput('')} className="h-7 text-xs text-slate-500">
                            Clear
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative min-h-0">
                        <textarea
                            className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                            value={leftInput}
                            onChange={(e) => setLeftInput(e.target.value)}
                            spellCheck={false}
                            placeholder={mode === 'toml-to-json' ? 'key = "value"' : '{ ... }'}
                        />
                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-2">
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription className="font-mono text-xs mt-1 truncate">{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm min-h-0 overflow-hidden">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            {mode === 'toml-to-json' ? <FileJson className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-orange-500" />}
                            {mode === 'toml-to-json' ? 'JSON Output' : 'TOML Output'}
                        </CardTitle>
                        <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={!rightInput} className="h-7 text-xs gap-2">
                            <Copy className="h-3 w-3" /> Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 min-h-0">
                        <pre className="w-full h-full p-4 overflow-auto font-mono text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                            {rightInput}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
