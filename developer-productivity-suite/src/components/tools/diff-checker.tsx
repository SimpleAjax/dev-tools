"use client";

import { useState, useMemo } from "react";
import { diffLines, Change } from "diff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function DiffChecker() {
    const [original, setOriginal] = useState(`{
  "name": "DevTools",
  "version": "1.0.0",
  "private": true
}`);
    const [modified, setModified] = useState(`{
  "name": "DevTools",
  "version": "1.0.1",
  "private": false,
  "description": "A suite of developer tools"
}`);

    const diff = useMemo(() => {
        return diffLines(original, modified);
    }, [original, modified]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                <Card className="flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle>Original Text</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                            placeholder="Paste original text here..."
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col min-h-0">
                    <CardHeader>
                        <CardTitle>Modified Text</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={modified}
                            onChange={(e) => setModified(e.target.value)}
                            placeholder="Paste modified text here..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="h-1/3 min-h-[200px] flex flex-col">
                <CardHeader>
                    <CardTitle>Differences</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    <div className="bg-slate-50 dark:bg-slate-900 border rounded-md p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto h-full">
                        {diff.map((part: Change, index: number) => {
                            let color = "";
                            let bg = "";
                            if (part.added) {
                                color = "text-green-800 dark:text-green-300";
                                bg = "bg-green-100 dark:bg-green-900/30";
                            } else if (part.removed) {
                                color = "text-red-800 dark:text-red-300";
                                bg = "bg-red-100 dark:bg-red-900/30";
                            }

                            return (
                                <span key={index} className={`${color} ${bg} block`}>
                                    {part.value}
                                </span>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
