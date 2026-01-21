"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

export function UrlParser() {
    const [inputUrl, setInputUrl] = useState("https://www.example.com:8080/path/to/resource?search=query&filter=active#section-1");

    const parsed = useMemo(() => {
        try {
            if (!inputUrl) return null;
            // Heuristic: if no protocol, add https:// to inspect it properly, 
            // but only if it looks like a domain.
            let urlStr = inputUrl;
            if (!urlStr.match(/^[a-zA-Z]+:\/\//)) {
                // If purely just paths or weird string, generic parser might fail or assume relative.
                // Let's assume user intends a full URL if possible, otherwise let it fail gracefully.
                if (urlStr.includes('.') && !urlStr.startsWith('/')) {
                    urlStr = "https://" + urlStr;
                }
            }

            const url = new URL(urlStr);
            const params: Record<string, string> = {};
            url.searchParams.forEach((value, key) => {
                params[key] = value;
            });

            return {
                valid: true,
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                pathname: url.pathname,
                search: url.search,
                hash: url.hash,
                origin: url.origin,
                params,
            };
        } catch {
            return { valid: false };
        }
    }, [inputUrl]);

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>URL Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="https://example.com/..."
                            className="font-mono"
                        />
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setInputUrl(encodeURIComponent(inputUrl))}>Encode</Button>
                            <Button variant="outline" onClick={() => setInputUrl(decodeURIComponent(inputUrl))}>Decode</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {parsed?.valid ? (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Components</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Protocol</Label>
                                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded border truncate">{parsed.protocol}</div>
                            </div>
                            <div className="space-y-1">
                                <Label>Host</Label>
                                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded border truncate">{parsed.hostname}</div>
                            </div>
                            <div className="space-y-1">
                                <Label>Port</Label>
                                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded border truncate">{parsed.port || "(default)"}</div>
                            </div>
                            <div className="space-y-1">
                                <Label>Path</Label>
                                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded border break-all">{parsed.pathname}</div>
                            </div>
                            <div className="space-y-1">
                                <Label>Hash (Fragment)</Label>
                                <div className="font-mono text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded border truncate">{parsed.hash || "-"}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader><CardTitle>Query Parameters</CardTitle></CardHeader>
                        <CardContent className="flex-1">
                            {Object.keys(parsed.params || {}).length > 0 ? (
                                <div className="border rounded-md divide-y dark:divide-slate-800">
                                    {Object.entries(parsed.params || {}).map(([key, val]) => (
                                        <div key={key} className="p-3 text-sm flex gap-2 overflow-hidden">
                                            <span className="font-semibold text-slate-500 w-1/3 shrink-0 truncate" title={key}>{key}</span>
                                            <span className="font-mono text-slate-900 dark:text-slate-100 break-all">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-slate-500 text-sm italic py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-md border border-dashed">
                                    No query parameters found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : inputUrl ? (
                <div className="p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-900 border border-dashed rounded-lg">
                    <LinkIcon className="mx-auto h-8 w-8 mb-4 text-slate-300" />
                    Not a valid URL.
                </div>
            ) : null}
        </div>
    );
}
