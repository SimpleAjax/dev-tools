'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { FileSpreadsheet, Database, Copy, AlertCircle, UploadCloud } from 'lucide-react';
import Papa from 'papaparse';

export function CsvToSqlConverter() {
    const [csvInput, setCsvInput] = useState('');
    const [sqlOutput, setSqlOutput] = useState('');
    const [tableName, setTableName] = useState('imported_data');
    const [dbType, setDbType] = useState<'postgres' | 'mysql'>('postgres');
    const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
    const [hasHeader, setHasHeader] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        convert();
    }, [csvInput, tableName, dbType, delimiter, hasHeader]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setCsvInput(text);
        };
        reader.readAsText(file);
    };

    const convert = () => {
        if (!csvInput.trim()) {
            setSqlOutput('');
            setError(null);
            return;
        }

        try {
            Papa.parse(csvInput, {
                delimiter: delimiter === '\t' ? '\t' : delimiter,
                header: hasHeader,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        setError(`CSV Parsing Error: ${results.errors[0].message}`);
                        return;
                    }
                    generateSql(results.data as any[], results.meta.fields || []);
                    setError(null);
                },
                error: (err) => {
                    setError(err.message);
                }
            });
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const generateSql = (data: any[], headers: string[]) => {
        if (data.length === 0) {
            setSqlOutput('-- No data found in CSV');
            return;
        }

        // Handle case where header is false: Papa parse returns arrays instead of objects
        // We'll generate synthetic headers col_1, col_2, etc.
        let columns = headers;
        if (!hasHeader) {
            const firstRow = data[0];
            if (Array.isArray(firstRow)) {
                columns = firstRow.map((_, i) => `col_${i + 1}`);
            } else {
                // Should not happen with header:false usually returning arrays
                columns = Object.keys(firstRow);
            }
        }

        const quote = (str: string) => dbType === 'mysql' ? `\`${str}\`` : `"${str}"`;

        // 1. Create Table
        let createTable = `CREATE TABLE ${quote(tableName)} (\n`;
        const colDefs = columns.map(col => `    ${quote(col.trim())} TEXT`); // Default to TEXT for CSV import safety
        createTable += colDefs.join(',\n') + '\n);\n\n';

        // 2. Inserts
        // We batch inserts for performance (standard practice)
        let insert = `INSERT INTO ${quote(tableName)} (${columns.map(c => quote(c.trim())).join(', ')}) VALUES\n`;

        const rows = data.map(row => {
            // If header=true, row is object. If header=false, row is array.
            const values = hasHeader
                ? columns.map(col => row[col])
                : (Array.isArray(row) ? row : Object.values(row));

            const sqlValues = values.map((val: any) => {
                if (val === null || val === undefined) return 'NULL';
                const strVal = String(val).replace(/'/g, "''"); // Escape single quotes
                return `'${strVal}'`;
            });
            return `(${sqlValues.join(', ')})`;
        });

        insert += rows.join(',\n') + ';';
        setSqlOutput(createTable + insert);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sqlOutput);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            <div className="flex flex-col h-full gap-4">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" /> CSV Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" className="relative cursor-pointer" asChild>
                                <span>
                                    <UploadCloud className="mr-2 h-4 w-4" /> Upload CSV Input
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".csv,.txt"
                                        onChange={handleFileUpload}
                                    />
                                </span>
                            </Button>
                            <div className="text-xs text-slate-500">or paste content below</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase">Delimiter</Label>
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                                    <Button variant={delimiter === ',' ? 'default' : 'ghost'} size="sm" onClick={() => setDelimiter(',')} className="flex-1 h-6 text-xs">Comma</Button>
                                    <Button variant={delimiter === ';' ? 'default' : 'ghost'} size="sm" onClick={() => setDelimiter(';')} className="flex-1 h-6 text-xs">Semi</Button>
                                    <Button variant={delimiter === '\t' ? 'default' : 'ghost'} size="sm" onClick={() => setDelimiter('\t')} className="flex-1 h-6 text-xs">Tab</Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border rounded-md px-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <Label className="text-sm cursor-pointer" htmlFor="header-switch">First row is header</Label>
                                <Switch id="header-switch" checked={hasHeader} onCheckedChange={setHasHeader} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm relative">
                    <CardContent className="flex-1 p-0">
                        <textarea
                            className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                            placeholder="id,name,email&#10;1,John,john@example.com&#10;2,Jane,jane@example.com"
                            value={csvInput}
                            onChange={(e) => setCsvInput(e.target.value)}
                            spellCheck={false}
                        />
                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 animate-in fade-in zoom-in">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col h-full gap-4">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 font-semibold uppercase">Target Table</Label>
                            <Input
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 font-semibold uppercase">Dialect</Label>
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

                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <Database className="h-4 w-4 text-blue-500" /> SQL Import Script
                        </CardTitle>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={copyToClipboard}
                            disabled={!sqlOutput}
                            className="h-7 text-xs gap-2"
                        >
                            <Copy className="h-3 w-3" />
                            Copy SQL
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <pre className="w-full h-full p-4 overflow-auto font-mono text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-950">
                            {sqlOutput || <span className="text-slate-400 select-none">// Upload CSV to generate SQL INSERT statements...</span>}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
