'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileJson, Copy, ArrowRightLeft, FileCode2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import yaml from 'js-yaml';

export function JsonYamlConverter() {
    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
    const [error, setError] = useState<string | null>(null);

    // Initial Example
    useEffect(() => {
        setLeftInput('{\n  "name": "example",\n  "version": 1,\n  "items": [\n    "a",\n    "b"\n  ]\n}');
    }, []);

    // Effect: Transpile whenever input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            convert();
        }, 500); // Debounce
        return () => clearTimeout(timer);
    }, [leftInput, mode]);

    const convert = () => {
        if (!leftInput.trim()) {
            setRightInput('');
            setError(null);
            return;
        }

        try {
            if (mode === 'json-to-yaml') {
                // Parse JSON -> Dump YAML
                const obj = JSON.parse(leftInput);
                const yamlStr = yaml.dump(obj);
                setRightInput(yamlStr);
            } else {
                // Parse YAML -> Dump JSON
                const obj = yaml.load(leftInput);
                const jsonStr = JSON.stringify(obj, null, 2);
                setRightInput(jsonStr);
            }
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const toggleMode = () => {
        // Swap inputs and mode
        setLeftInput(rightInput);
        setRightInput(leftInput);
        setMode(mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
        setError(null);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(rightInput);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
            {/* Toolbar */}
            <div className="flex justify-center items-center">
                <Button variant="outline" onClick={toggleMode} className="gap-2 min-w-[200px]">
                    <ArrowRightLeft className="h-4 w-4" />
                    Switch to {mode === 'json-to-yaml' ? 'YAML > JSON' : 'JSON > YAML'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Input Panel */}
                <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm min-h-0">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            {mode === 'json-to-yaml' ? <FileJson className="h-4 w-4 text-blue-500" /> : <FileCode2 className="h-4 w-4 text-purple-500" />}
                            {mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
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
                            placeholder={mode === 'json-to-yaml' ? 'Paste JSON here...' : 'Paste YAML here...'}
                        />
                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-2">
                                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Parsing Error</AlertTitle>
                                    <AlertDescription className="font-mono text-xs mt-1">{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Output Panel */}
                <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm min-h-0 overflow-hidden">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            {mode === 'json-to-yaml' ? <FileCode2 className="h-4 w-4 text-purple-500" /> : <FileJson className="h-4 w-4 text-blue-500" />}
                            {mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
                        </CardTitle>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={copyToClipboard}
                            disabled={!!error || !rightInput}
                            className="h-7 text-xs gap-2"
                        >
                            <Copy className="h-3 w-3" />
                            Copy Result
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
