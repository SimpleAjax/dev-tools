"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Language = "JSON" | "CSS" | "JavaScript";

export function Minifier() {
    const [input, setInput] = useState(`{
  "project": "DevTools",
  "files": [
    "page.tsx",
    "layout.tsx"
  ],
  "active": true
}`);
    const [language, setLanguage] = useState<Language>("JSON");

    const output = useMemo(() => {
        if (!input) return "";
        try {
            switch (language) {
                case "JSON":
                    return JSON.stringify(JSON.parse(input));
                case "CSS":
                    // Very basic CSS minifier (regex based for client side)
                    return input
                        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                        .replace(/\s+/g, " ") // Collapse whitespace
                        .replace(/\s*([:;{}])\s*/g, "$1") // Remove space around delimiters
                        .replace(/;}/g, "}") // Remove last semicolon
                        .trim();
                case "JavaScript":
                    // Very basic JS minifier (regex based) - NOT a full parser
                    // Safe for simple scripts, risky for complex ones
                    return input
                        .replace(/\/\/.*$/gm, "") // Remove line comments
                        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                        .replace(/\s+/g, " ") // Collapse whitespace
                        .replace(/\s*([=+\-*/{}();,])\s*/g, "$1") // Remove space around operators
                        .trim();
                default:
                    return input;
            }
        } catch (e) {
            return `Error: ${(e as Error).message}`;
        }
    }, [input, language]);

    const stats = useMemo(() => {
        if (!input || !output) return null;
        const originalSize = new Blob([input]).size;
        const minifiedSize = new Blob([output]).size;
        const savings = ((originalSize - minifiedSize) / originalSize) * 100;
        return {
            original: originalSize,
            minified: minifiedSize,
            savings: savings.toFixed(2),
        };
    }, [input, output]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <div className="w-[200px] space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="JSON">JSON</SelectItem>
                            <SelectItem value="CSS">CSS</SelectItem>
                            <SelectItem value="JavaScript">JavaScript (Simple)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {stats && (
                    <div className="flex items-center gap-4 text-sm">
                        <div className="text-slate-500">Original: <span className="font-mono text-slate-900 dark:text-slate-100">{stats.original} B</span></div>
                        <div className="text-slate-500">Minified: <span className="font-mono text-slate-900 dark:text-slate-100">{stats.minified} B</span></div>
                        <div className="text-green-600 font-bold">-{stats.savings}%</div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-0">
                <Card className="flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle>Input Code</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Paste your ${language} code here...`}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col min-h-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Minified Output</CardTitle>
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
                            className="h-full resize-none font-mono text-xs leading-relaxed break-all bg-slate-50 dark:bg-slate-900 border-0 focus-visible:ring-0"
                            value={output}
                            readOnly
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
