'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileJson, Copy, ArrowRightLeft, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export function DynamoDbMarshaller() {
    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [mode, setMode] = useState<'marshal' | 'unmarshal'>('marshal');
    const [error, setError] = useState<string | null>(null);

    // Initial Example
    useEffect(() => {
        setLeftInput('{\n  "pk": "USER#123",\n  "sk": "PROFILE",\n  "age": 30,\n  "isActive": true,\n  "roles": ["admin", "editor"],\n  "metadata": {\n    "created": 1678900000\n  }\n}');
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
            const json = JSON.parse(leftInput);
            let result;

            if (mode === 'marshal') {
                // Standard JSON -> DynamoDB JSON
                result = marshall(json);
            } else {
                // DynamoDB JSON -> Standard JSON
                result = unmarshall(json);
            }

            setRightInput(JSON.stringify(result, null, 2));
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const toggleMode = () => {
        setLeftInput(rightInput);
        setRightInput(leftInput);
        setMode(mode === 'marshal' ? 'unmarshal' : 'marshal');
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
                    Switch to {mode === 'marshal' ? 'Unmarshall (DDB → JSON)' : 'Marshall (JSON → DDB)'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm min-h-0">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            {mode === 'marshal' ? <FileJson className="h-4 w-4 text-blue-500" /> : <Database className="h-4 w-4 text-orange-500" />}
                            {mode === 'marshal' ? 'Standard JSON Input' : 'DynamoDB JSON Input'}
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
                            placeholder={mode === 'marshal' ? '{ "key": "value" }' : '{ "key": { "S": "value" } }'}
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
                            {mode === 'marshal' ? <Database className="h-4 w-4 text-orange-500" /> : <FileJson className="h-4 w-4 text-blue-500" />}
                            {mode === 'marshal' ? 'DynamoDB JSON Output' : 'Standard JSON Output'}
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
