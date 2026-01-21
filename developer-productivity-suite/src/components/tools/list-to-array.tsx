"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Format = "JSON" | "JS Single" | "JS Double" | "SQL" | "CSV";

export function ListToArray() {
    const [input, setInput] = useState(`Apple
Banana
Cherry
Date`);
    const [format, setFormat] = useState<Format>("JSON");

    const output = useMemo(() => {
        if (!input) return "";

        // Split by newline and filter empty lines
        const lines = input.split(/\r?\n/).filter(line => line.trim() !== "");

        switch (format) {
            case "JSON":
                return JSON.stringify(lines, null, 2);
            case "JS Single":
                return `['${lines.join("', '")}']`;
            case "JS Double":
                return `["${lines.join('", "')}"]`;
            case "SQL":
                // Useful for WHERE IN (...)
                return `('${lines.join("', '")}')`;
            case "CSV":
                return lines.join(",");
            default:
                return "";
        }
    }, [input, format]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <div className="w-[200px] space-y-2">
                    <Label>Output Format</Label>
                    <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="JSON">JSON Array</SelectItem>
                            <SelectItem value="JS Single">JS Array (Single Quote)</SelectItem>
                            <SelectItem value="JS Double">JS Array (Double Quote)</SelectItem>
                            <SelectItem value="SQL">SQL List (comma separated)</SelectItem>
                            <SelectItem value="CSV">CSV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-slate-500">
                    Converting {input.split(/\r?\n/).filter(l => l.trim()).length} items
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-0">
                <Card className="flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle>Input List (One per line)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your list here..."
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col min-h-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Formatted Output</CardTitle>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(output)}
                        >
                            Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 pt-2">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed bg-slate-50 dark:bg-slate-900 border-0 focus-visible:ring-0"
                            value={output}
                            readOnly
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
