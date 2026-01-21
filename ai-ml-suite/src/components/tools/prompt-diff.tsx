"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import * as Diff from "diff";
import { GitCompare } from "lucide-react";

export function PromptDiff() {
    const [original, setOriginal] = useState("");
    const [modified, setModified] = useState("");
    const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);

    useEffect(() => {
        const diff = Diff.diffWordsWithSpace(original, modified);
        setDiffResult(diff);
    }, [original, modified]);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Original Prompt</CardTitle>
                        <CardDescription>Paste the original version here.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            placeholder="Enter original prompt..."
                            className="h-[300px] font-mono text-sm resize-none"
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">New Prompt</CardTitle>
                        <CardDescription>Paste the modified version here.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            placeholder="Enter new prompt..."
                            className="h-[300px] font-mono text-sm resize-none"
                            value={modified}
                            onChange={(e) => setModified(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCompare className="h-5 w-5 text-primary" />
                        Diff View
                        <Badge variant="secondary" className="ml-auto">
                            {diffResult.filter(d => d.added || d.removed).length} Differences
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="min-h-[150px] overflow-auto rounded-md border bg-muted/30 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {diffResult.length === 0 || (original === "" && modified === "") ? (
                            <span className="text-muted-foreground italic">Diff will appear here...</span>
                        ) : (
                            diffResult.map((part, index) => {
                                let className = "text-foreground";
                                if (part.added) {
                                    className = "bg-green-500/20 text-green-400 decoration-green-500 rounded px-0.5";
                                } else if (part.removed) {
                                    className = "bg-red-500/20 text-red-400 line-through decoration-red-500 decoration-2 opacity-70 rounded px-0.5 mx-0.5";
                                }

                                return (
                                    <span key={index} className={className}>
                                        {part.value}
                                    </span>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
