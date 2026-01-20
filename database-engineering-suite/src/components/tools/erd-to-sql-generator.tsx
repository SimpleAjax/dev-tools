'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Workflow, Code, AlertCircle, Copy, Image as ImageIcon } from 'lucide-react';
import mermaid from 'mermaid';

// Type definitions for our parsed schema
type Column = {
    name: string;
    type: string;
    pk?: boolean;
    fk?: string; // "Table.col"
};

type Table = {
    name: string;
    columns: Column[];
};

export function ErdToSqlGenerator() {
    const [input, setInput] = useState(`erDiagram
    USER {
        int id PK
        string username
        string email
    }
    POST {
        int id PK
        string title
        string content
        int user_id FK
    }
    USER ||--o{ POST : writes`);

    const [sqlOutput, setSqlOutput] = useState('');
    const [dbType, setDbType] = useState<'postgres' | 'mysql'>('postgres');
    const [error, setError] = useState<string | null>(null);
    const mermaidRef = useRef<HTMLDivElement>(null);

    // Initial Mermaid Config
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            logLevel: 5 // Error only
        });
    }, []);

    // Render Diagram and Generate SQL on input change
    useEffect(() => {
        const timer = setTimeout(() => {
            renderDiagram();
            generateSql();
        }, 800);
        return () => clearTimeout(timer);
    }, [input, dbType]);

    const renderDiagram = async () => {
        if (!mermaidRef.current || !input.trim()) return;

        try {
            // Check if input is valid mermaid syntax vaguely
            if (!input.includes('erDiagram')) {
                // If user didn't type erDiagram, we might want to auto-prepend it or just wait
                if (!input.startsWith('erDiagram')) {
                    // For now, accept it might be raw definition
                }
            }

            const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), input);
            mermaidRef.current.innerHTML = svg;
            setError(null);
        } catch (e) {
            // Mermaid throws complex objects, standardizing error message
            console.error(e);
            // We don't block SQL gen on diagram render failure necessarily, 
            // but usually if diagram fails, syntax is wrong.
            setError("Syntax Error: " + (e as Error).message.split('\n')[0]);
        }
    };

    const generateSql = () => {
        // Very basic primitive parser for Mermaid ER syntax to SQL
        // Limitations: This is a regex-based approximation for the MVP
        try {
            const lines = input.split('\n');
            const tables: Table[] = [];
            let currentTable: Table | null = null;
            const relations: string[] = [];

            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('erDiagram') || line.startsWith('%%')) continue;

                // Detect Relation (e.g., USER ||--o{ POST : writes)
                if (line.match(/[}|][|o]--[|o][{|]/)) {
                    relations.push(line);
                    continue;
                }

                // Detect Table Start (e.g., USER {)
                if (line.match(/^[a-zA-Z0-9_]+\s*\{$/)) {
                    const name = line.replace('{', '').trim();
                    currentTable = { name, columns: [] };
                    tables.push(currentTable);
                    continue;
                }

                // Detect Table End
                if (line === '}') {
                    currentTable = null;
                    continue;
                }

                // Detect Column (e.g., int id PK)
                if (currentTable) {
                    const parts = line.split(/\s+/);
                    if (parts.length >= 2) {
                        const type = parts[0];
                        const name = parts[1];
                        const constraints = parts.slice(2);

                        const isPk = constraints.includes('PK');
                        const isFk = constraints.includes('FK'); // Mermaid uses FK comment usually? standard mermaid syntax is `int id FK`

                        currentTable.columns.push({
                            name,
                            type,
                            pk: isPk,
                            fk: isFk ? 'true' : undefined
                        });
                    }
                }
            }

            if (tables.length === 0 && !error) return; // Don't wipe output if parsing yielded nothing helpful yet

            // Build SQL
            let sql = '';

            // Helper to map generic types to specific DB types
            const mapType = (t: string) => {
                const lower = t.toLowerCase();
                if (lower === 'string') return dbType === 'postgres' ? 'TEXT' : 'VARCHAR(255)';
                if (lower === 'int') return 'INT';
                if (lower === 'float') return dbType === 'postgres' ? 'DOUBLE PRECISION' : 'FLOAT';
                if (lower === 'boolean') return 'BOOLEAN';
                if (lower === 'datetime') return dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';
                return t.toUpperCase(); // Fallback
            };

            const quote = (s: string) => dbType === 'postgres' ? `"${s}"` : `\`${s}\``;

            for (const table of tables) {
                sql += `CREATE TABLE ${quote(table.name)} (\n`;
                const colDefs = table.columns.map(col => {
                    let def = `    ${quote(col.name)} ${mapType(col.type)}`;
                    if (col.pk) def += ' PRIMARY KEY';
                    return def;
                });
                sql += colDefs.join(',\n');
                sql += '\n);\n\n';
            }

            // Add basic relations as comments or FKs (FK syntax parsing from mermaid is tricky reliably)
            if (relations.length > 0) {
                sql += `-- Relations (Add FK constraints manually or enable advanced parsing)\n`;
                relations.forEach(r => sql += `-- ${r}\n`);
            }

            setSqlOutput(sql);

        } catch (e) {
            console.error("SQL Gen Error", e);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sqlOutput);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            {/* Left Pipe: Input */}
            <div className="flex flex-col h-full gap-4">
                <Card className="flex flex-col h-1/2 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Workflow className="h-4 w-4 text-blue-500" /> Mermaid ER Syntax
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInput('erDiagram\n    USER {\n        int id PK\n        string email\n    }')}
                            className="h-7 text-xs text-slate-500"
                        >
                            Reset Example
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative">
                        <textarea
                            className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            spellCheck={false}
                            placeholder="erDiagram..."
                        />
                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                <Alert variant="destructive" className="py-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="text-xs font-bold">Syntax Error</AlertTitle>
                                    <AlertDescription className="text-xs truncate">{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Left Pipe Bottom: Visual Preview */}
                <Card className="flex flex-col h-1/2 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-2">
                            <ImageIcon className="h-3 w-3" /> Diagram Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-auto bg-white dark:bg-slate-950 flex items-center justify-center">
                        <div ref={mermaidRef} className="mermaid w-full flex justify-center scale-90 origin-top">
                            {/* SVG Injected Here */}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Pipe: Output */}
            <div className="flex flex-col h-full gap-4">
                {/* Controls */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardContent className="p-4 grid grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase">Target Database</Label>
                            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                                <Button
                                    variant={dbType === 'postgres' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setDbType('postgres')}
                                    className="flex-1 h-6 text-xs"
                                >
                                    Postgres
                                </Button>
                                <Button
                                    variant={dbType === 'mysql' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setDbType('mysql')}
                                    className="flex-1 h-6 text-xs"
                                >
                                    MySQL
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Code Output */}
                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Code className="h-4 w-4 text-green-500" /> Generated DDL
                        </CardTitle>
                        <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-7 text-xs gap-2">
                            <Copy className="h-3 w-3" /> Copy SQL
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950">
                            {sqlOutput || '-- SQL will appear here...'}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
