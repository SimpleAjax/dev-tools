"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";

interface Rule {
    agent: string;
    allow: string[];
    disallow: string[];
}

export function RobotsTxtGenerator() {
    const [rules, setRules] = useState<Rule[]>([
        { agent: "*", allow: [], disallow: ["/admin/", "/private/"] }
    ]);
    const [sitemap, setSitemap] = useState("");

    const addRule = () => {
        setRules([...rules, { agent: "", allow: [], disallow: [] }]);
    };

    const updateRule = (index: number, key: keyof Rule, val: any) => {
        const newRules = [...rules];
        // @ts-ignore
        newRules[index][key] = val;
        setRules(newRules);
    };

    const output = () => {
        let str = "";
        rules.forEach(r => {
            str += `User-agent: ${r.agent || "*"}\n`;
            r.allow.forEach(a => str += `Allow: ${a}\n`);
            r.disallow.forEach(d => str += `Disallow: ${d}\n`);
            str += "\n";
        });

        if (sitemap) str += `Sitemap: ${sitemap}\n`;
        return str.trim();
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                {rules.map((rule, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Bot Group {i + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">User Agent (e.g. Googlebot, *)</label>
                                <Input value={rule.agent} onChange={(e) => updateRule(i, "agent", e.target.value)} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-red-600">Disallow Paths (comma separated)</label>
                                <Input
                                    placeholder="/admin/, /tmp/"
                                    value={rule.disallow.join(", ")}
                                    onChange={(e) => updateRule(i, "disallow", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-green-600">Allow Paths (comma separated)</label>
                                <Input
                                    placeholder="/public/, /images/"
                                    value={rule.allow.join(", ")}
                                    onChange={(e) => updateRule(i, "allow", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button onClick={addRule} className="text-sm text-blue-600 hover:underline">+ Add Another User-Agent Rule</button>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Sitemap URL (Optional)</label>
                            <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 text-slate-50 border-slate-800 h-fit">
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400">robots.txt Output</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <pre className="font-mono text-sm bg-slate-950 p-4 rounded border border-slate-800 text-blue-300 min-h-[300px]">
                            {output()}
                        </pre>
                        <div className="absolute top-4 right-4">
                            <CopyButton text={output()} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
