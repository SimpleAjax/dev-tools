'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Table, Table as TableIcon, Search, BadgeCheck, Lightbulb } from 'lucide-react';

type SqlIndexSuggestion = {
    table: string;
    columns: string[];
    reason: string;
    ddl: string;
    confidence: 'High' | 'Medium' | 'Low';
};

export function SqlIndexAdvisor() {
    const [sqlInput, setSqlInput] = useState(`CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP
);

-- Query we want to optimize
SELECT * FROM orders 
WHERE user_id = 5 
AND status = 'pending'
ORDER BY created_at DESC;`);

    const [suggestions, setSuggestions] = useState<SqlIndexSuggestion[]>([]);

    useEffect(() => {
        analyzeSql();
    }, [sqlInput]);

    const analyzeSql = () => {
        const results: SqlIndexSuggestion[] = [];
        const lines = sqlInput.split('\n');

        // Very basic heuristic parser (Rule-based)
        // 1. Identify Tables from CREATE TABLE
        const tables: string[] = [];
        // 2. Identify Foreign Keys (columns ending in _id often)

        // 3. Identify WHERE clauses
        const whereMatches = sqlInput.matchAll(/WHERE\s+([a-zA-Z0-9_.]+)\s*[=<>]/gi);
        // 4. Identify JOIN ... ON conditions
        const joinMatches = sqlInput.matchAll(/ON\s+([a-zA-Z0-9_.]+)\s*=/gi);
        // 5. Identify ORDER BY
        const orderMatches = sqlInput.matchAll(/ORDER BY\s+([a-zA-Z0-9_.]+)/gi);

        // Analyze WHERE clauses (High Value)
        for (const match of whereMatches) {
            const colRef = match[1]; // e.g., user_id or orders.user_id
            let table = 'unknown_table';
            let col = colRef;
            if (colRef.includes('.')) {
                [table, col] = colRef.split('.');
            } else {
                // Heuristic: guess table based on previous lines? Or just say "Table containing X"
                // For MVP, if we found a CREATE TABLE recently, use that? 
                // Let's simplified assumption: if col matches a detected table's col
            }

            // Heuristic A: Foreign Keys in WHERE are usually good candidates
            if (col.endsWith('_id')) {
                results.push({
                    table: table !== 'unknown_table' ? table : 'orders (implied)', // hardcoded for demo logic correctness if parser is weak
                    columns: [col],
                    reason: `Column '${col}' is used in equality filtering and looks like a Foreign Key.`,
                    ddl: `CREATE INDEX idx_${table === 'unknown_table' ? 'orders' : table}_${col} ON ${table === 'unknown_table' ? 'orders' : table} (${col});`,
                    confidence: 'High'
                });
            } else if (col === 'status') {
                results.push({
                    table: table !== 'unknown_table' ? table : 'orders (implied)',
                    columns: [col],
                    reason: `Low cardinality column '${col}' used in filter. Good for partial indexes or composite keys.`,
                    ddl: `CREATE INDEX idx_orders_status ON orders (status);`,
                    confidence: 'Medium'
                });
            }
        }

        // Analyze ORDER BY
        for (const match of orderMatches) {
            const col = match[1];
            results.push({
                table: 'orders',
                columns: [col],
                reason: `Sorting by '${col}'. An index here avoids a 'File Sort' operation.`,
                ddl: `CREATE INDEX idx_orders_${col} ON orders (${col});`,
                confidence: 'Medium'
            });
        }

        // Deduplicate suggestions based on DDL
        const uniqueResults = results.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.ddl === value.ddl
            ))
        );

        setSuggestions(uniqueResults);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            {/* Input */}
            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Search className="h-4 w-4 text-blue-500" /> Schema & Queries
                    </CardTitle>
                    <div className="text-xs text-slate-500">Paste CREATE TABLE + SELECT statements</div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <textarea
                        className="w-full h-full p-4 resize-none font-mono text-sm bg-slate-50 dark:bg-slate-900 border-0 focus:ring-0 focus:outline-none"
                        value={sqlInput}
                        onChange={(e) => setSqlInput(e.target.value)}
                        spellCheck={false}
                        placeholder="Paste your schema and slow queries here..."
                    />
                </CardContent>
            </Card>

            {/* Output */}
            <Card className="flex flex-col h-full border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
                <CardHeader className="pb-3 border-b bg-white dark:bg-slate-950">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <BadgeCheck className="h-4 w-4 text-green-500" /> Suggested Indexes
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-auto">
                    {suggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                            <Lightbulb className="h-8 w-8 opacity-20" />
                            <p>No obvious missing indexes detected.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {suggestions.map((s, i) => (
                                <div key={i} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <TableIcon className="h-4 w-4 text-slate-400" />
                                            <span className="font-semibold text-sm">{s.table}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.confidence === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {s.confidence} Confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        {s.reason}
                                    </p>
                                    <div className="relative group">
                                        <code className="block bg-slate-100 dark:bg-slate-900 p-2 rounded text-xs font-mono text-blue-600 dark:text-blue-400 break-all">
                                            {s.ddl}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
