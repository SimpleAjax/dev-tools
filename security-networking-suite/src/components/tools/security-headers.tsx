"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";

export function HeaderAnalyzer() {
    const [headers, setHeaders] = useState("");

    const analyze = () => {
        const issues = [];
        const score = { current: 100, max: 100 };

        const lowerHeaders = headers.toLowerCase();

        if (!lowerHeaders.includes("strict-transport-security")) {
            issues.push({
                name: "HSTS Missing",
                severity: "High",
                desc: "Strict-Transport-Security header not found. This leaves users vulnerable to Man-in-the-Middle attacks."
            });
            score.current -= 20;
        }

        if (!lowerHeaders.includes("x-frame-options") && !lowerHeaders.includes("content-security-policy")) {
            issues.push({
                name: "Clickjacking Risk",
                severity: "Medium",
                desc: "Neither X-Frame-Options nor CSP frame-ancestors found. Site can be embedded in an iframe."
            });
            score.current -= 15;
        }

        if (!lowerHeaders.includes("x-content-type-options")) {
            issues.push({
                name: "MIME Sniffing",
                severity: "Low",
                desc: "X-Content-Type-Options: nosniff missing. Browser may incorrectly detect file types."
            });
            score.current -= 10;
        }

        return { issues, score };
    };

    const { issues, score } = analyze();

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Raw Headers</CardTitle>
                    <CardDescription>Paste HTTP headers here (Key: Value)</CardDescription>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="w-full h-64 p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded resize-none"
                        placeholder={`HTTP/1.1 200 OK\nContent-Type: text/html\n...`}
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                    />
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Security Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className={`text-4xl font-bold ${score.current > 80 ? "text-green-600" : (score.current > 50 ? "text-orange-500" : "text-red-600")}`}>
                                {score.current}/100
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Based on best practices.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {issues.length > 0 ? issues.map((issue, i) => (
                        <Card key={i} className="border-l-4 border-l-red-500">
                            <CardContent className="pt-4">
                                <h4 className="font-bold text-red-600 flex justify-between">
                                    {issue.name}
                                    <span className="text-xs px-2 py-0.5 bg-red-100 rounded text-red-800">{issue.severity}</span>
                                </h4>
                                <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">{issue.desc}</p>
                            </CardContent>
                        </Card>
                    )) : (
                        headers.length > 10 && (
                            <Card className="border-l-4 border-l-green-500 bg-green-50/50">
                                <CardContent className="pt-4">
                                    <h4 className="font-bold text-green-600">All Checks Passed</h4>
                                    <p className="text-sm text-green-700">No common missing headers detected.</p>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
