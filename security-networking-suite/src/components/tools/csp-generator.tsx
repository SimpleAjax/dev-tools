"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CspGenerator() {
    const [directives, setDirectives] = useState({
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
    });

    const toggle = (key: keyof typeof directives, val: string) => {
        setDirectives(prev => {
            const current = prev[key];
            if (current.includes(val)) {
                return { ...prev, [key]: current.filter(x => x !== val) };
            } else {
                return { ...prev, [key]: [...current, val] };
            }
        });
    };

    const addCustom = (key: keyof typeof directives, val: string) => {
        if (!val) return;
        setDirectives(prev => ({ ...prev, [key]: [...prev[key], val] }));
    };

    const generate = () => {
        let policy = "";
        Object.entries(directives).forEach(([key, vals]) => {
            if (vals.length > 0) {
                // Convert camelCase to kebab-case
                const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                policy += `${kebab} ${vals.join(" ")}; `;
            }
        });
        return policy.trim();
    };

    const Section = ({ title, dKey }: { title: string, dKey: keyof typeof directives }) => {
        const [custom, setCustom] = useState("");
        return (
            <div className="space-y-3 pb-4 border-b last:border-0 last:pb-0">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title} ({dKey.replace(/([A-Z])/g, "-$1").toLowerCase()})</h3>
                <div className="flex flex-wrap gap-4">
                    {["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "https:", "data:"].map(opt => (
                        <div key={opt} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${dKey}-${opt}`}
                                checked={directives[dKey].includes(opt)}
                                onCheckedChange={() => toggle(dKey, opt)}
                            />
                            <Label htmlFor={`${dKey}-${opt}`} className="font-mono text-xs">{opt}</Label>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                    <Input
                        placeholder="e.g. analytics.google.com"
                        value={custom}
                        onChange={(e) => setCustom(e.target.value)}
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addCustom(dKey, custom);
                                setCustom("");
                            }
                        }}
                    />
                    <button
                        onClick={() => { addCustom(dKey, custom); setCustom(""); }}
                        className="text-xs bg-slate-900 text-white px-3 rounded hover:bg-slate-800"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {directives[dKey].filter(x => !["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "https:", "data:"].includes(x)).map(c => (
                        <span key={c} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                            {c}
                            <button onClick={() => toggle(dKey, c)} className="hover:text-blue-900">×</button>
                        </span>
                    ))}
                </div>
            </div>
        )
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Policy Builder</CardTitle>
                    <CardDescription>Configure allowed sources for each content type.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Section title="Default" dKey="defaultSrc" />
                    <Section title="Scripts" dKey="scriptSrc" />
                    <Section title="Styles" dKey="styleSrc" />
                    <Section title="Images" dKey="imgSrc" />
                    <Section title="Connect (XHR/Fetch)" dKey="connectSrc" />
                    <Section title="Fonts" dKey="fontSrc" />
                    <Section title="Objects (Flash)" dKey="objectSrc" />
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="bg-slate-900 text-slate-50 border-slate-800 sticky top-4">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-wider text-slate-400">Content-Security-Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <pre className="font-mono text-sm bg-slate-950 p-4 rounded border border-slate-800 text-green-400 whitespace-pre-wrap break-all">
                                {generate()}
                            </pre>
                            <div className="mt-4 flex justify-end">
                                <CopyButton text={generate()} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                            </div>
                        </div>
                        <div className="mt-6 text-xs text-slate-500">
                            <p>Add this header to your Nginx/Apache config or HTML meta tag:</p>
                            <code className="block mt-2 bg-slate-800 p-2 rounded">
                                &lt;meta http-equiv="Content-Security-Policy" content="..." /&gt;
                            </code>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
