"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("gm");
    const [text, setText] = useState("The quick brown fox jumps over the lazy dog.\nEmail: test@example.com\nPhone: 123-456-7890");

    const result = useMemo(() => {
        if (!pattern) return { matches: [], error: null };

        try {
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;

            // Prevent infinite loops with global flag or empty matches
            let loopCount = 0;
            const MAX_LOOPS = 1000;

            // Duplicate regex for executing
            const execRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

            while ((match = execRegex.exec(text)) !== null) {
                matches.push({
                    index: match.index,
                    length: match[0].length,
                    content: match[0],
                    groups: match.groups || {},
                });

                if (!flags.includes("g")) break;
                if (match.index === execRegex.lastIndex) execRegex.lastIndex++;

                loopCount++;
                if (loopCount > MAX_LOOPS) break;
            }

            return { matches, error: null };
        } catch (e) {
            return { matches: [], error: (e as Error).message };
        }
    }, [pattern, flags, text]);

    const highlightedText = useMemo(() => {
        if (!pattern || result.error || result.matches.length === 0) return text;

        let lastIndex = 0;
        const parts = [];

        result.matches.forEach((match, i) => {
            // Text before match
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${i}`}>
                        {text.slice(lastIndex, match.index)}
                    </span>
                );
            }
            // Match
            parts.push(
                <span
                    key={`match-${i}`}
                    className="bg-blue-200 dark:bg-blue-900/50 border-b-2 border-blue-500 rounded-sm px-0.5"
                    title={`Match ${i + 1}`}
                >
                    {text.slice(match.index, match.index + match.length)}
                </span>
            );
            lastIndex = match.index + match.length;
        });

        // Remaining text
        if (lastIndex < text.length) {
            parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
        }

        return parts;
    }, [text, result, pattern]);

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-8rem)]">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Expression</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="pattern">Regex Pattern</Label>
                                <Input
                                    id="pattern"
                                    placeholder="e.g. [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                            <div className="w-24 space-y-2">
                                <Label htmlFor="flags">Flags</Label>
                                <Input
                                    id="flags"
                                    placeholder="gims"
                                    value={flags}
                                    onChange={(e) => setFlags(e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        {result.error ? (
                            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <span>{result.error}</span>
                            </div>
                        ) : pattern ? (
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-3 rounded-md">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Valid Expression - {result.matches.length} matches found</span>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle>Test String</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your text here to test against the regex..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="flex flex-col min-h-0">
                <CardHeader>
                    <CardTitle>Match Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-auto">
                    <div className="bg-slate-50 dark:bg-slate-900 border rounded-md p-4 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed h-full overflow-y-auto">
                        {highlightedText}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
