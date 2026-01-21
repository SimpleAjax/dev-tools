"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Temporary Copy Button component if not exists
function SimpleCopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

const ESCAPE_MODES = {
    JSON: {
        escape: (str: string) => JSON.stringify(str).slice(1, -1),
        unescape: (str: string) => JSON.parse(`"${str}"`),
    },
    JavaScript: {
        escape: (str: string) => str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r'),
        unescape: (str: string) => str.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
    },
    HTML: {
        escape: (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"),
        unescape: (str: string) => str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
    },
    URL: {
        escape: (str: string) => encodeURIComponent(str),
        unescape: (str: string) => decodeURIComponent(str),
    },
    SQL: {
        escape: (str: string) => str.replace(/'/g, "''"), // Simple SQL escape
        unescape: (str: string) => str.replace(/''/g, "'"),
    },
};

type Mode = keyof typeof ESCAPE_MODES;

export function StringEscaper() {
    const [input, setInput] = useState('{"name": "John Doe", "role": "Developer"}');
    const [mode, setMode] = useState<Mode>("JSON");
    const [direction, setDirection] = useState<"escape" | "unescape">("escape");

    const output = useMemo(() => {
        if (!input) return "";
        try {
            return ESCAPE_MODES[mode][direction](input);
        } catch (e) {
            return `Error: Could not ${direction} string. ${(e as Error).message}`;
        }
    }, [input, mode, direction]);

    return (
        <div className="grid gap-6 h-[calc(100vh-8rem)]">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-[200px]">
                            <Label>Language / Format</Label>
                            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(ESCAPE_MODES).map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-md self-end">
                            <Tabs value={direction} onValueChange={(v) => setDirection(v as "escape" | "unescape")}>
                                <TabsList>
                                    <TabsTrigger value="escape">Escape</TabsTrigger>
                                    <TabsTrigger value="unescape">Unescape</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-0 h-full">
                    <Card className="flex flex-col min-h-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Input</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 pt-2">
                            <Textarea
                                className="h-full resize-none font-mono text-sm leading-relaxed"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste string here..."
                            />
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col min-h-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Output</CardTitle>
                            <SimpleCopyButton text={output} />
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
        </div>
    );
}

import { useMemo } from "react";
