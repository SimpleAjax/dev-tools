"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// I will use native checkbox if ShadCN checkbox is not confirmed available, but earlier I saw 11 files in ui. checkbox wasn't there. 
// I will use a simple native checkbox wrapper or just input.

export function CsvToJson() {
    const [input, setInput] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [hasHeaders, setHasHeaders] = useState(true);
    const [minify, setMinify] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convert = () => {
        if (!input.trim()) return "";

        try {
            const rows = input.trim().split(/\r?\n/);
            if (rows.length === 0) return "[]";

            // Simple parser treating delimiter, need to handle quotes?
            // Implementing a basic safely split function
            const splitRow = (row: string) => {
                const res = [];
                let current = '';
                let inQuote = false;
                for (let i = 0; i < row.length; i++) {
                    const char = row[i];
                    if (char === '"') {
                        inQuote = !inQuote;
                    } else if (char === delimiter && !inQuote) {
                        res.push(current);
                        current = '';
                    } else {
                        current += char;
                    }
                }
                res.push(current);
                return res.map(s => s.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            };

            const data = rows.map(splitRow);

            if (hasHeaders) {
                const headers = data[0];
                const result = data.slice(1).map(row => {
                    const obj: any = {};
                    headers.forEach((h, i) => {
                        obj[h] = row[i] || ""; // Handle missing cols
                    });
                    return obj;
                });
                return minify ? JSON.stringify(result) : JSON.stringify(result, null, 2);
            } else {
                return minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);
            }

        } catch (e) {
            return "Error parsing CSV";
        }
    };

    const result = convert();

    return (
        <div className="grid gap-6 md:grid-cols-2 h-[600px]">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>CSV Input</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                    <div className="flex gap-4">
                        <div className="space-y-1">
                            <Label>Delimiter</Label>
                            <Select value={delimiter} onValueChange={setDelimiter}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=",">Comma</SelectItem>
                                    <SelectItem value=";">Semi-colon</SelectItem>
                                    <SelectItem value="\t">Tab</SelectItem>
                                    <SelectItem value="|">Pipe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <input
                                type="checkbox"
                                id="headers"
                                checked={hasHeaders}
                                onChange={(e) => setHasHeaders(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            <Label htmlFor="headers">First row is header</Label>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                            <input
                                type="checkbox"
                                id="minify"
                                checked={minify}
                                onChange={(e) => setMinify(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            <Label htmlFor="minify">Minify JSON</Label>
                        </div>
                    </div>

                    <Textarea
                        className="flex-1 font-mono text-sm resize-none whitespace-pre"
                        placeholder="id,name,age&#10;1,John,30&#10;2,Jane,25"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>JSON Output</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                    <div className="flex justify-end">
                        <Button
                            variant="outline" size="sm"
                            onClick={() => navigator.clipboard.writeText(result)}
                            disabled={!result || result === "Error parsing CSV"}
                        >
                            <Copy className="mr-2 h-4 w-4" /> Copy JSON
                        </Button>
                    </div>
                    <Textarea
                        className="flex-1 font-mono text-sm resize-none"
                        readOnly
                        value={result}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
