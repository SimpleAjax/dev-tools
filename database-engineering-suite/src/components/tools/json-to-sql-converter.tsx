'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, AlertCircle, FileJson, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function JsonToSqlConverter() {
    const [jsonInput, setJsonInput] = useState('');
    const [sqlOutput, setSqlOutput] = useState('');
    const [tableName, setTableName] = useState('my_table');
    const [dbType, setDbType] = useState<'postgres' | 'mysql'>('postgres');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        convert(jsonInput, tableName, dbType);
    }, [jsonInput, tableName, dbType]);

    const convert = (input: string, table: string, type: 'postgres' | 'mysql') => {
        if (!input.trim()) {
            setSqlOutput('');
            setError(null);
            return;
        }

        try {
            const data = JSON.parse(input);
            if (!Array.isArray(data)) {
                // If single object, wrap in array
                if (typeof data === 'object' && data !== null) {
                    generateSql([data], table, type);
                } else {
                    setError('Input must be a JSON array of objects or a single JSON object.');
                    setSqlOutput('');
                }
            } else {
                generateSql(data, table, type);
            }
            setError(null);
        } catch (e) {
            setError((e as Error).message);
            setSqlOutput('');
        }
    };

    const generateSql = (data: any[], table: string, type: 'postgres' | 'mysql') => {
        if (data.length === 0) {
            setSqlOutput('');
            return;
        }

        const keys = Object.keys(data[0]);
        if (keys.length === 0) {
            setSqlOutput('-- Empty objects');
            return;
        }

        // 1. Create Table Statement
        let createTable = `CREATE TABLE ${type === 'mysql' ? '`' + table + '`' : '"' + table + '"'} (\n`;
        const columns = keys.map(key => {
            const val = data[0][key];
            let sqlType = 'TEXT';
            if (typeof val === 'number') {
                sqlType = Number.isInteger(val) ? 'INT' : 'DECIMAL';
            } else if (typeof val === 'boolean') {
                sqlType = 'BOOLEAN';
            } else if (val instanceof Date) {
                sqlType = 'TIMESTAMP';
            }

            const quotedKey = type === 'mysql' ? '`' + key + '`' : '"' + key + '"';
            return `    ${quotedKey} ${sqlType}`;
        });
        createTable += columns.join(',\n') + '\n);\n\n';

        // 2. Insert Statement
        let insert = `INSERT INTO ${type === 'mysql' ? '`' + table + '`' : '"' + table + '"'} (${keys.map(k => type === 'mysql' ? '`' + k + '`' : '"' + k + '"').join(', ')}) VALUES\n`;

        const values = data.map(row => {
            const rowValues = keys.map(key => {
                const val = row[key];
                if (val === null || val === undefined) return 'NULL';
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`; // Escape single quotes
                return val;
            });
            return `(${rowValues.join(', ')})`;
        });

        insert += values.join(',\n') + ';';

        setSqlOutput(createTable + insert);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sqlOutput);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            {/* Left Panel: Input */}
            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <FileJson className="h-4 w-4 text-blue-500" /> JSON Input
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setJsonInput('[]')} className="h-7 text-xs text-slate-500">
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <textarea
                        className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                        placeholder={`[\n  {\n    "id": 1,\n    "name": "Alice",\n    "active": true\n  }\n]`}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        spellCheck={false}
                    />
                    {error && (
                        <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-2">
                            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Invalid JSON</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Right Panel: Output & Controls */}
            <div className="flex flex-col h-full gap-4">
                {/* Controls */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tableName" className="text-xs text-slate-500 font-semibold uppercase">Table Name</Label>
                            <Input
                                id="tableName"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 font-semibold uppercase">SQL Dialect</Label>
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

                {/* Output */}
                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Database className="h-4 w-4 text-green-500" /> SQL Output
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            disabled={!sqlOutput}
                            className="h-7 text-xs gap-2"
                        >
                            <Copy className="h-3 w-3" />
                            {sqlOutput ? 'Copy SQL' : 'No Output'}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950">
                            {sqlOutput || <span className="text-slate-400 select-none">// Enter JSON on the left to generate SQL...</span>}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
