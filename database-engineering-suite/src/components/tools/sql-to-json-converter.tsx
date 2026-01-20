'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, FileJson, Table } from 'lucide-react';

export function SqlToJsonConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const convert = () => {
        if (!input.trim()) {
            setOutput('');
            setError(null);
            return;
        }

        try {
            const lines = input.trim().split('\n').map(l => l.trimStart());
            if (lines.length === 0) return;

            let json: any[] = [];

            // Heuristic 1: ASCII Pipe Table (MySQL/Postgres CLI)
            // +----+------+
            // | id | name |
            // +----+------+
            const isPipeTable = lines[0].startsWith('+') || lines[0].startsWith('|');

            if (isPipeTable) {
                json = parsePipeTable(lines);
            } else {
                // Heuristic 2: TSV / CSV (Heuristic guess)
                // Assume first line is header
                // Check delimiters
                const firstLine = lines[0];
                const tabCount = (firstLine.match(/\t/g) || []).length;
                const commaCount = (firstLine.match(/,/g) || []).length;
                const pipeCount = (firstLine.match(/\|/g) || []).length; // Pipe without ASCII borders

                if (tabCount > 0) {
                    json = parseDsv(lines, '\t');
                } else if (commaCount > 0) {
                    json = parseDsv(lines, ',');
                } else {
                    throw new Error("Could not detect format (Supported: ASCII Table, TSV, CSV)");
                }
            }

            setOutput(JSON.stringify(json, null, 2));
            setError(null);
        } catch (e) {
            setError((e as Error).message);
            setOutput('');
        }
    };

    const parsePipeTable = (lines: string[]) => {
        // Filter out separator lines (+---+)
        const contentLines = lines.filter(l => !l.startsWith('+'));
        if (contentLines.length < 2) throw new Error("Invalid ASCII Table");

        // First line is header
        // | id | name |  -> ["id", "name"]
        const parseRow = (line: string) => {
            return line.split('|')
                .map(c => c.trim())
                .filter((c, i, arr) => {
                    // Filter empty start/end if they exist due to split
                    if (i === 0 && c === '') return false;
                    if (i === arr.length - 1 && c === '') return false;
                    return true;
                });
        };

        const headers = parseRow(contentLines[0]);
        const dataLines = contentLines.slice(1);

        return dataLines.map(line => {
            const values = parseRow(line);
            const obj: any = {};
            headers.forEach((h, i) => {
                let val = values[i];
                // basic numeric inference
                if (val && !isNaN(Number(val))) {
                    obj[h] = Number(val);
                } else if (val === 'NULL') {
                    obj[h] = null;
                } else {
                    obj[h] = val;
                }
            });
            return obj;
        });
    };

    const parseDsv = (lines: string[], delimiter: string) => {
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^['"]|['"]$/g, ''));
        return lines.slice(1).map(line => {
            const values = line.split(delimiter).map(v => v.trim().replace(/^['"]|['"]$/g, ''));
            const obj: any = {};
            headers.forEach((h, i) => {
                let val = values[i];
                if (val && !isNaN(Number(val))) {
                    obj[h] = Number(val);
                } else if (val === 'NULL') {
                    obj[h] = null;
                } else {
                    obj[h] = val;
                }
            });
            return obj;
        });
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Table className="h-4 w-4 text-blue-500" /> SQL Query Output
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={convert}>Convert</Button>
                        <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-xs text-slate-500">
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <textarea
                        className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none whitespace-pre"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`+----+-------+\n| id | name  |\n+----+-------+\n|  1 | John  |\n+----+-------+`}
                        spellCheck={false}
                    />
                    {error && (
                        <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-900 font-medium">
                                Error: {error}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <FileJson className="h-4 w-4 text-green-500" /> JSON Result
                    </CardTitle>
                    <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={!output} className="h-7 text-xs gap-2">
                        <Copy className="h-3 w-3" /> Copy
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950">
                        {output || '// Paste ASCII table or TSV on the left to convert...'}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
