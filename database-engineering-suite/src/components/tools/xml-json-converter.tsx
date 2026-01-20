'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, FileJson, Copy, ArrowRightLeft, FileCode, Code2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export function XmlJsonConverter() {
    const [leftInput, setLeftInput] = useState('');
    const [rightInput, setRightInput] = useState('');
    const [mode, setMode] = useState<'xml-to-json' | 'json-to-xml'>('xml-to-json');
    const [error, setError] = useState<string | null>(null);
    const [ignoreAttributes, setIgnoreAttributes] = useState(false);

    // Initial Example
    useEffect(() => {
        setLeftInput(`<user id="1">
  <name>John Doe</name>
  <email>john@example.com</email>
  <roles>
    <role>admin</role>
    <role>editor</role>
  </roles>
</user>`);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            convert();
        }, 500);
        return () => clearTimeout(timer);
    }, [leftInput, mode, ignoreAttributes]);

    const convert = () => {
        if (!leftInput.trim()) {
            setRightInput('');
            setError(null);
            return;
        }

        try {
            if (mode === 'xml-to-json') {
                const parser = new XMLParser({
                    ignoreAttributes: ignoreAttributes,
                    attributeNamePrefix: "@_",
                    textNodeName: "#text"
                });
                const obj = parser.parse(leftInput);
                // fast-xml-parser returns an object even on failure sometimes, check validity?
                // Actually it throws on validation error if strict mode, but default is loose.
                setRightInput(JSON.stringify(obj, null, 2));
            } else {
                // JSON to XML
                const obj = JSON.parse(leftInput);
                const builder = new XMLBuilder({
                    ignoreAttributes: ignoreAttributes,
                    format: true
                });
                const xmlStr = builder.build(obj);
                setRightInput(xmlStr);
            }
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const toggleMode = () => {
        setLeftInput(rightInput);
        setRightInput(leftInput);
        setMode(mode === 'xml-to-json' ? 'json-to-xml' : 'xml-to-json');
        setError(null);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(rightInput);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                    <Button variant="outline" size="sm" onClick={toggleMode} className="gap-2">
                        <ArrowRightLeft className="h-3 w-3" />
                        Swap: {mode === 'xml-to-json' ? 'XML → JSON' : 'JSON → XML'}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="ignore-attr" className="text-xs">Ignore Attributes</Label>
                    <Switch id="ignore-attr" checked={ignoreAttributes} onCheckedChange={setIgnoreAttributes} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm min-h-0">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            {mode === 'xml-to-json' ? <Code2 className="h-4 w-4 text-orange-500" /> : <FileJson className="h-4 w-4 text-blue-500" />}
                            {mode === 'xml-to-json' ? 'XML Input' : 'JSON Input'}
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
                            placeholder={mode === 'xml-to-json' ? '<root>...</root>' : '{ ... }'}
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
                            {mode === 'xml-to-json' ? <FileJson className="h-4 w-4 text-blue-500" /> : <Code2 className="h-4 w-4 text-orange-500" />}
                            {mode === 'xml-to-json' ? 'JSON Output' : 'XML Output'}
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
